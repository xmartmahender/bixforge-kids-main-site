// lib/userTrackingService.ts
import { db } from "./firebase";
import {
  collection, doc, setDoc, updateDoc, deleteDoc, addDoc,
  onSnapshot, Timestamp, serverTimestamp, getDocs
} from "firebase/firestore";
import { v4 as uuidv4 } from 'uuid';

// Collection names
const ACTIVE_USERS_COLLECTION = 'activeUsers';
const USER_SESSIONS_COLLECTION = 'userSessions';
const PAGE_VIEWS_COLLECTION = 'pageViews';

// Time in milliseconds to consider a user inactive (5 minutes)
const INACTIVE_THRESHOLD = 5 * 60 * 1000;

// Enhanced user session data type
export interface UserSession {
  id: string;
  sessionId: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  lastActive: Timestamp;
  joinedAt: Timestamp;
  currentPage: string;
  referrer: string;
  ipAddress?: string;
  location?: string;
  pageViews: number;
  timeSpent: number;
  isActive: boolean;
  ageGroup?: '0-3' | '3-6' | '6-9' | '9-12';
  contentType?: 'story' | 'video' | 'code' | 'general';
  contentId?: string;
  userAgent: string;
  screenResolution?: string;
  language?: string;
  timezone?: string;
}

// Page view tracking
export interface PageView {
  sessionId: string;
  page: string;
  timestamp: Timestamp;
  timeSpent: number;
  ageGroup?: '0-3' | '3-6' | '6-9' | '9-12';
  contentType?: 'story' | 'video' | 'code' | 'general';
  contentId?: string;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  referrer?: string;
}

// Content interaction tracking
export interface ContentInteraction {
  sessionId: string;
  contentType: 'story' | 'video' | 'code';
  contentId: string;
  contentTitle: string;
  ageGroup: '0-3' | '3-6' | '6-9' | '9-12';
  action: 'view' | 'like' | 'share' | 'complete' | 'exit';
  timestamp: Timestamp;
  timeSpent: number;
  deviceType: 'desktop' | 'mobile' | 'tablet';
  progress?: number; // For videos/stories completion percentage
}

// Daily analytics summary
export interface DailyAnalytics {
  date: string; // YYYY-MM-DD format
  totalVisits: number;
  uniqueUsers: number;
  totalPageViews: number;
  averageSessionTime: number;
  bounceRate: number;
  deviceBreakdown: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  ageGroupBreakdown: {
    '0-3': number;
    '3-6': number;
    '6-9': number;
    '9-12': number;
  };
  contentViews: {
    stories: number;
    videos: number;
    code: number;
  };
  topContent: {
    contentType: string;
    contentId: string;
    title: string;
    views: number;
  }[];
}

// Get device information
const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;

  // Determine device type
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  const isTablet = /iPad|Android(?!.*Mobile)/i.test(userAgent);
  const deviceType = isTablet ? 'tablet' : (isMobile ? 'mobile' : 'desktop');

  // Determine browser
  let browser = 'Unknown';
  if (userAgent.indexOf('Chrome') > -1) browser = 'Chrome';
  else if (userAgent.indexOf('Safari') > -1) browser = 'Safari';
  else if (userAgent.indexOf('Firefox') > -1) browser = 'Firefox';
  else if (userAgent.indexOf('MSIE') > -1 || userAgent.indexOf('Trident') > -1) browser = 'Internet Explorer';
  else if (userAgent.indexOf('Edge') > -1) browser = 'Edge';

  // Determine OS
  let os = 'Unknown';
  if (userAgent.indexOf('Windows') > -1) os = 'Windows';
  else if (userAgent.indexOf('Mac') > -1) os = 'MacOS';
  else if (userAgent.indexOf('Linux') > -1) os = 'Linux';
  else if (userAgent.indexOf('Android') > -1) os = 'Android';
  else if (userAgent.indexOf('iOS') > -1 || userAgent.indexOf('iPhone') > -1 || userAgent.indexOf('iPad') > -1) os = 'iOS';

  // Get additional info
  const screenResolution = `${screen.width}x${screen.height}`;
  const language = navigator.language || 'en';
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return {
    deviceType: deviceType as 'desktop' | 'mobile' | 'tablet',
    browser,
    os,
    userAgent,
    screenResolution,
    language,
    timezone
  };
};

// Generate or retrieve a session ID from localStorage
const getSessionId = () => {
  let sessionId = localStorage.getItem('kidz_zone_session_id');

  if (!sessionId) {
    sessionId = uuidv4();
    localStorage.setItem('kidz_zone_session_id', sessionId);
  }

  return sessionId;
};

// Get user's IP address
const getIPAddress = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch {
    return 'unknown';
  }
};

// Register a user session with enhanced tracking
export const registerUserSession = async (page: string, ageGroup?: '0-3' | '3-6' | '6-9' | '9-12', contentType?: 'story' | 'video' | 'code' | 'general', contentId?: string) => {
  try {
    const sessionId = getSessionId();
    const { deviceType, browser, os, userAgent, screenResolution, language, timezone } = getDeviceInfo();

    // Get IP address with fallback
    let ipAddress = 'unknown';
    try {
      ipAddress = await getIPAddress();
    } catch (error) {
      console.warn('Could not get IP address:', error);
    }

    const joinedAt = Timestamp.now();

    const userSession: Omit<UserSession, 'id'> = {
      sessionId,
      deviceType,
      browser,
      os,
      userAgent,
      screenResolution,
      language,
      timezone,
      lastActive: joinedAt,
      joinedAt,
      currentPage: page,
      referrer: document.referrer || 'direct',
      ipAddress,
      pageViews: 1,
      timeSpent: 0,
      isActive: true,
      ...(ageGroup && { ageGroup }),
      ...(contentType && { contentType }),
      ...(contentId && { contentId })
    };

    // Try to create active user session with fallback
    try {
      await setDoc(doc(db, ACTIVE_USERS_COLLECTION, sessionId), userSession);
    } catch (error) {
      console.warn('Could not create active user session:', error);
      // Continue without Firebase tracking
      return sessionId;
    }

    // Try to create historical session record
    try {
      await addDoc(collection(db, USER_SESSIONS_COLLECTION), userSession);
    } catch (error) {
      console.warn('Could not create historical session record:', error);
    }

    // Try to track initial page view
    try {
      await trackPageView(sessionId, page, ageGroup, contentType, contentId);
    } catch (error) {
      console.warn('Could not track initial page view:', error);
    }

    // Set up heartbeat to update lastActive timestamp and time spent
    const startTime = Date.now();
    let pageViewCount = 1;

    const heartbeatInterval = setInterval(async () => {
      try {
        const currentTime = Date.now();
        const timeSpent = currentTime - startTime;

        await updateDoc(doc(db, ACTIVE_USERS_COLLECTION, sessionId), {
          lastActive: serverTimestamp(),
          timeSpent: timeSpent,
          pageViews: pageViewCount
        });
      } catch (error) {
        console.error('Error updating heartbeat:', error);
        clearInterval(heartbeatInterval);
      }
    }, 30000); // Update every 30 seconds

    // Track page changes
    let currentPage = page;
    const handlePageChange = async () => {
      const newPage = window.location.pathname;
      if (newPage !== currentPage) {
        currentPage = newPage;
        pageViewCount++;
        await trackPageView(sessionId, newPage, ageGroup, contentType, contentId);
        await updateUserSession(newPage, ageGroup, contentType, contentId);
      }
    };

    // Listen for page changes
    window.addEventListener('popstate', handlePageChange);

    // Set up cleanup on page unload
    const cleanup = async () => {
      clearInterval(heartbeatInterval);
      window.removeEventListener('popstate', handlePageChange);

      try {
        const finalTime = Date.now();
        const totalTimeSpent = finalTime - startTime;

        // Update final session data
        await updateDoc(doc(db, ACTIVE_USERS_COLLECTION, sessionId), {
          isActive: false,
          timeSpent: totalTimeSpent,
          pageViews: pageViewCount,
          lastActive: serverTimestamp()
        });

        // Remove from active users after a short delay
        setTimeout(async () => {
          try {
            await deleteDoc(doc(db, ACTIVE_USERS_COLLECTION, sessionId));
          } catch (error) {
            console.error('Error removing user session:', error);
          }
        }, 1000);

      } catch (error) {
        console.error('Error in cleanup:', error);
      }
    };

    window.addEventListener('beforeunload', cleanup);
    window.addEventListener('unload', cleanup);

    // Store cleanup function for manual cleanup
    (window as { userSessionCleanup?: () => Promise<void> }).userSessionCleanup = cleanup;

    return sessionId;
  } catch (error) {
    console.error('Error registering user session:', error);
    return null;
  }
};

// Track individual page views
export const trackPageView = async (
  sessionId: string,
  page: string,
  ageGroup?: '0-3' | '3-6' | '6-9' | '9-12',
  contentType?: 'story' | 'video' | 'code' | 'general',
  contentId?: string
) => {
  try {
    const { deviceType, browser } = getDeviceInfo();

    const pageView: PageView = {
      sessionId,
      page,
      timestamp: Timestamp.now(),
      timeSpent: 0,
      deviceType,
      browser,
      referrer: document.referrer || 'direct',
      ...(ageGroup && { ageGroup }),
      ...(contentType && { contentType }),
      ...(contentId && { contentId })
    };

    await addDoc(collection(db, PAGE_VIEWS_COLLECTION), pageView);
  } catch (error) {
    console.warn('Error tracking page view:', error);
    // Fail silently to not break the user experience
  }
};

// Update user session with new page or content
export const updateUserSession = async (
  page: string,
  ageGroup?: '0-3' | '3-6' | '6-9' | '9-12',
  contentType?: 'story' | 'video' | 'code' | 'general',
  contentId?: string
) => {
  try {
    const sessionId = getSessionId();

    const updateData: {
      lastActive: ReturnType<typeof serverTimestamp>;
      currentPage: string;
      ageGroup?: string;
      contentType?: string;
      contentId?: string;
    } = {
      lastActive: serverTimestamp(),
      currentPage: page
    };

    if (ageGroup) updateData.ageGroup = ageGroup;
    if (contentType) updateData.contentType = contentType;
    if (contentId) updateData.contentId = contentId;

    await updateDoc(doc(db, ACTIVE_USERS_COLLECTION, sessionId), updateData);
  } catch (error) {
    console.warn('Error updating user session:', error);
    // Fail silently to not break the user experience
  }
};

// Listen for active users (for admin dashboard)
export const listenForActiveUsers = (callback: (users: UserSession[]) => void) => {
  try {
    // Create a simple query for active users (without complex where clause to avoid index issues)
    const activeUsersQuery = collection(db, ACTIVE_USERS_COLLECTION);

    // Set up the listener with error handling
    return onSnapshot(activeUsersQuery,
      (snapshot) => {
        const activeUsers: UserSession[] = [];
        const currentTime = Date.now();

        snapshot.forEach((doc) => {
          const userData = doc.data() as UserSession;
          // Filter on client side to avoid Firebase index requirements
          if (userData.lastActive && userData.lastActive.toDate().getTime() > (currentTime - INACTIVE_THRESHOLD)) {
            activeUsers.push({ ...userData, id: doc.id });
          }
        });

        callback(activeUsers);
      },
      (error) => {
        console.warn('Error listening for active users:', error);
        // Return empty array on error
        callback([]);
      }
    );
  } catch (error) {
    console.warn('Error setting up active users listener:', error);
    // Return a dummy unsubscribe function
    return () => {};
  }
};

// Track content interaction
export const trackContentInteraction = async (
  sessionId: string,
  contentType: 'story' | 'video' | 'code',
  contentId: string,
  contentTitle: string,
  ageGroup: '0-3' | '3-6' | '6-9' | '9-12',
  action: 'view' | 'like' | 'share' | 'complete' | 'exit',
  timeSpent: number = 0,
  progress?: number
) => {
  try {
    const { deviceType } = getDeviceInfo();

    const interaction: ContentInteraction = {
      sessionId,
      contentType,
      contentId,
      contentTitle,
      ageGroup,
      action,
      timestamp: Timestamp.now(),
      timeSpent,
      deviceType,
      ...(progress !== undefined && { progress })
    };

    await addDoc(collection(db, 'contentInteractions'), interaction);
  } catch (error) {
    console.warn('Error tracking content interaction:', error);
    // Fail silently to not break the user experience
  }
};

// Generate daily analytics
export const generateDailyAnalytics = async (date: string): Promise<DailyAnalytics | null> => {
  try {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    // Use simple queries to avoid index issues, then filter client-side
    let sessions: UserSession[] = [];
    let pageViews: PageView[] = [];
    let interactions: ContentInteraction[] = [];

    try {
      // Get all sessions and filter client-side
      const sessionsSnapshot = await getDocs(collection(db, USER_SESSIONS_COLLECTION));
      sessions = sessionsSnapshot.docs
        .map(doc => doc.data() as UserSession)
        .filter(session => {
          if (!session.joinedAt) return false;
          const sessionDate = session.joinedAt.toDate();
          return sessionDate >= startDate && sessionDate <= endDate;
        });
    } catch (error) {
      console.warn('Error fetching sessions for analytics:', error);
    }

    try {
      // Get all page views and filter client-side
      const pageViewsSnapshot = await getDocs(collection(db, PAGE_VIEWS_COLLECTION));
      pageViews = pageViewsSnapshot.docs
        .map(doc => doc.data() as PageView)
        .filter(pageView => {
          if (!pageView.timestamp) return false;
          const pageViewDate = pageView.timestamp.toDate();
          return pageViewDate >= startDate && pageViewDate <= endDate;
        });
    } catch (error) {
      console.warn('Error fetching page views for analytics:', error);
    }

    try {
      // Get all interactions and filter client-side
      const interactionsSnapshot = await getDocs(collection(db, 'contentInteractions'));
      interactions = interactionsSnapshot.docs
        .map(doc => doc.data() as ContentInteraction)
        .filter(interaction => {
          if (!interaction.timestamp) return false;
          const interactionDate = interaction.timestamp.toDate();
          return interactionDate >= startDate && interactionDate <= endDate;
        });
    } catch (error) {
      console.warn('Error fetching interactions for analytics:', error);
    }

    // Calculate analytics
    const totalVisits = sessions.length;
    const uniqueUsers = new Set(sessions.map(s => s.sessionId)).size;
    const totalPageViews = pageViews.length;
    const totalTimeSpent = sessions.reduce((sum, session) => sum + (session.timeSpent || 0), 0);
    const averageSessionTime = totalVisits > 0 ? Math.round(totalTimeSpent / totalVisits / 1000) : 0;

    // Calculate bounce rate (sessions with only 1 page view)
    const bouncedSessions = sessions.filter(session => session.pageViews <= 1).length;
    const bounceRate = totalVisits > 0 ? Math.round((bouncedSessions / totalVisits) * 100) : 0;

    // Device breakdown
    const deviceBreakdown = {
      desktop: sessions.filter(s => s.deviceType === 'desktop').length,
      mobile: sessions.filter(s => s.deviceType === 'mobile').length,
      tablet: sessions.filter(s => s.deviceType === 'tablet').length,
    };

    // Age group breakdown
    const ageGroupBreakdown = {
      '0-3': sessions.filter(s => s.ageGroup === '0-3').length,
      '3-6': sessions.filter(s => s.ageGroup === '3-6').length,
      '6-9': sessions.filter(s => s.ageGroup === '6-9').length,
      '9-12': sessions.filter(s => s.ageGroup === '9-12').length,
    };

    // Content views
    const contentViews = {
      stories: interactions.filter(i => i.contentType === 'story' && i.action === 'view').length,
      videos: interactions.filter(i => i.contentType === 'video' && i.action === 'view').length,
      code: interactions.filter(i => i.contentType === 'code' && i.action === 'view').length,
    };

    // Top content
    const contentViewCounts: { [key: string]: { title: string; views: number; type: string } } = {};
    interactions.filter(i => i.action === 'view').forEach(interaction => {
      const key = `${interaction.contentType}-${interaction.contentId}`;
      if (!contentViewCounts[key]) {
        contentViewCounts[key] = {
          title: interaction.contentTitle,
          views: 0,
          type: interaction.contentType
        };
      }
      contentViewCounts[key].views++;
    });

    const topContent = Object.entries(contentViewCounts)
      .map(([key, data]) => ({
        contentType: data.type,
        contentId: key.split('-')[1],
        title: data.title,
        views: data.views
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);

    const analytics: DailyAnalytics = {
      date,
      totalVisits,
      uniqueUsers,
      totalPageViews,
      averageSessionTime,
      bounceRate,
      deviceBreakdown,
      ageGroupBreakdown,
      contentViews,
      topContent
    };

    // Try to store the analytics
    try {
      await addDoc(collection(db, 'dailyAnalytics'), analytics);
    } catch (error) {
      console.warn('Error storing daily analytics:', error);
    }

    return analytics;
  } catch (error) {
    console.warn('Error generating daily analytics:', error);
    return null;
  }
};

// Get analytics for last 7 days
export const getWeeklyAnalytics = async (): Promise<DailyAnalytics[]> => {
  try {
    const analytics: DailyAnalytics[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];

      try {
        // Try to get existing analytics first (simple query to avoid index issues)
        const analyticsSnapshot = await getDocs(collection(db, 'dailyAnalytics'));
        const existingAnalytics = analyticsSnapshot.docs
          .map(doc => doc.data() as DailyAnalytics)
          .find(data => data.date === dateString);

        if (existingAnalytics) {
          analytics.push(existingAnalytics);
        } else {
          // Generate analytics for this date
          const dayAnalytics = await generateDailyAnalytics(dateString);
          if (dayAnalytics) {
            analytics.push(dayAnalytics);
          }
        }
      } catch (error) {
        console.warn(`Error getting analytics for ${dateString}:`, error);
        // Continue with next date
      }
    }

    return analytics;
  } catch (error) {
    console.warn('Error getting weekly analytics:', error);
    return [];
  }
};
