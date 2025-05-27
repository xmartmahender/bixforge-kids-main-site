'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  registerUserSession,
  updateUserSession,
  trackContentInteraction,
  trackPageView
} from '../../lib/userTrackingService';

interface UserTrackerProps {
  ageGroup?: '0-3' | '3-6' | '6-9' | '9-12';
  contentType?: 'story' | 'video' | 'code' | 'general';
  contentId?: string;
}

export default function UserTracker({ ageGroup, contentType, contentId }: UserTrackerProps) {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);
  const lastPageRef = useRef<string>('');
  const [isClient, setIsClient] = useState(false);

  // Ensure this only runs on the client to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Auto-detect age group from URL if not provided
  const detectAgeGroup = useCallback((path: string): '0-3' | '3-6' | '6-9' | '9-12' | undefined => {
    if (ageGroup) return ageGroup;
    if (path.includes('0-3') || path.includes('babies') || path.includes('toddlers')) return '0-3';
    if (path.includes('3-6') || path.includes('preschool')) return '3-6';
    if (path.includes('6-9') || path.includes('elementary')) return '6-9';
    if (path.includes('9-12') || path.includes('tweens') || path.includes('code')) return '9-12';
    return undefined;
  }, [ageGroup]);

  // Auto-detect content type from URL if not provided
  const detectContentType = useCallback((path: string): 'story' | 'video' | 'code' | 'general' => {
    if (contentType) return contentType;
    if (path.includes('/stories/') || path.includes('/story/')) return 'story';
    if (path.includes('/videos/') || path.includes('/video/')) return 'video';
    if (path.includes('/code/') || path.includes('/coding/') || path.includes('/programming/')) return 'code';
    return 'general';
  }, [contentType]);

  // Auto-extract content ID from URL if not provided
  const extractContentId = useCallback((path: string): string | undefined => {
    if (contentId) return contentId;
    const segments = path.split('/');
    if (segments.length >= 3 && (segments[1] === 'stories' || segments[1] === 'videos' || segments[1] === 'code')) {
      return segments[2];
    }
    return undefined;
  }, [contentId]);

  // Initialize tracking on mount (only on client)
  useEffect(() => {
    if (!isClient) return;

    const initializeTracking = async () => {
      try {
        const detectedAgeGroup = detectAgeGroup(pathname);
        const detectedContentType = detectContentType(pathname);
        const detectedContentId = extractContentId(pathname);

        const sessionId = await registerUserSession(
          pathname,
          detectedAgeGroup,
          detectedContentType,
          detectedContentId
        );

        sessionIdRef.current = sessionId;
        lastPageRef.current = pathname;

        // Track initial content interaction if on content page
        if (sessionId && detectedContentType !== 'general' && detectedContentId && typeof document !== 'undefined') {
          await trackContentInteraction(
            sessionId,
            detectedContentType,
            detectedContentId,
            document.title || 'Unknown Content',
            detectedAgeGroup || '6-9', // Default age group
            'view'
          );
        }
      } catch (error) {
        console.warn('Error initializing user tracking:', error);
      }
    };

    initializeTracking();

    // Cleanup function
    return () => {
      if (typeof window !== 'undefined') {
        const cleanup = (window as { userSessionCleanup?: () => Promise<void> }).userSessionCleanup;
        if (cleanup) {
          cleanup();
        }
      }
    };
  }, [isClient, pathname, detectAgeGroup, detectContentType, extractContentId]);

  // Track page changes (only on client)
  useEffect(() => {
    if (!isClient) return;

    if (lastPageRef.current && lastPageRef.current !== pathname) {
      const handlePageChange = async () => {
        try {
          const detectedAgeGroup = detectAgeGroup(pathname);
          const detectedContentType = detectContentType(pathname);
          const detectedContentId = extractContentId(pathname);

          // Update session with new page
          await updateUserSession(pathname, detectedAgeGroup, detectedContentType, detectedContentId);

          // Track page view
          if (sessionIdRef.current) {
            await trackPageView(sessionIdRef.current, pathname, detectedAgeGroup, detectedContentType, detectedContentId);

            // Track content interaction if on content page
            if (detectedContentType !== 'general' && detectedContentId && typeof document !== 'undefined') {
              await trackContentInteraction(
                sessionIdRef.current,
                detectedContentType,
                detectedContentId,
                document.title || 'Unknown Content',
                detectedAgeGroup || '6-9',
                'view'
              );
            }
          }

          lastPageRef.current = pathname;
        } catch (error) {
          console.warn('Error tracking page change:', error);
        }
      };

      handlePageChange();
    }
  }, [isClient, pathname, ageGroup, contentType, contentId, detectAgeGroup, detectContentType, extractContentId]);

  // Track user interactions (only on client)
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;

    const trackInteraction = (action: 'like' | 'share' | 'complete') => {
      return async () => {
        if (sessionIdRef.current) {
          const detectedContentType = detectContentType(pathname);
          const detectedContentId = extractContentId(pathname);
          const detectedAgeGroup = detectAgeGroup(pathname);

          if (detectedContentType !== 'general' && detectedContentId && typeof document !== 'undefined') {
            await trackContentInteraction(
              sessionIdRef.current,
              detectedContentType,
              detectedContentId,
              document.title || 'Unknown Content',
              detectedAgeGroup || '6-9',
              action
            );
          }
        }
      };
    };

    // Listen for custom events from content components
    const handleLike = trackInteraction('like');
    const handleShare = trackInteraction('share');
    const handleComplete = trackInteraction('complete');

    window.addEventListener('content-liked', handleLike);
    window.addEventListener('content-shared', handleShare);
    window.addEventListener('content-completed', handleComplete);

    return () => {
      window.removeEventListener('content-liked', handleLike);
      window.removeEventListener('content-shared', handleShare);
      window.removeEventListener('content-completed', handleComplete);
    };
  }, [isClient, pathname, detectAgeGroup, detectContentType, extractContentId]);

  return null; // This component doesn't render anything
}
