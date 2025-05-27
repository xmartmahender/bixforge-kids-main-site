'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/header';
import Footer from '../../components/footer';
import UserTracker from '../../components/UserTracker';
import ContentLanguageTranslator, { useContentLanguage } from '../../components/ContentLanguageTranslator';
import { translationService } from '../../../lib/translationService';
import { db } from '../../../lib/firebase';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { FaFire, FaEye, FaHeart, FaClock, FaArrowLeft, FaShare, FaStar } from 'react-icons/fa';

type TrendingStory = {
  id: string;
  title: string;
  description: string;
  content?: string;
  imageUrl: string;
  ageGroup: string;
  category?: string[] | string; // Can be array or string
  views: number;
  likes: number;
  priority: number;
  isActive: boolean;
  createdAt: { seconds: number; nanoseconds: number } | null;
  updatedAt: { seconds: number; nanoseconds: number } | null;
};

export default function TrendingStoryPage() {
  const params = useParams();
  const storyId = params.id as string;
  const [story, setStory] = useState<TrendingStory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const { contentLanguage, setContentLanguage } = useContentLanguage();
  const [translatedContent, setTranslatedContent] = useState<{
    title: string;
    description: string;
    content: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      if (!storyId) return;

      try {
        setLoading(true);

        // Fetch story from Firebase
        const storyDoc = await getDoc(doc(db, 'trending_stories', storyId));

        if (storyDoc.exists()) {
          const storyData = { id: storyDoc.id, ...storyDoc.data() } as TrendingStory;
          setStory(storyData);

          // Increment view count
          await updateDoc(doc(db, 'trending_stories', storyId), {
            views: increment(1)
          });

          console.log('📖 Trending story loaded:', storyData.title);
        } else {
          setError('Trending story not found');
        }
      } catch (err) {
        console.error('Error fetching trending story:', err);
        setError('Failed to load trending story');
      } finally {
        setLoading(false);
      }
    };

    fetchStory();
  }, [storyId]);

  // Handle content translation when language changes
  useEffect(() => {
    if (!story) return;

    const translateContent = async () => {
      if (contentLanguage === 'en') {
        // Reset to original English content
        setTranslatedContent(null);
        setTranslationError(null);
        return;
      }

      setIsTranslating(true);
      setTranslationError(null);

      try {
        // Use translation service
        const [translatedTitle, translatedDescription, translatedContentText] = await Promise.all([
          translationService.translateText(story.title, 'en', contentLanguage),
          story.description ? translationService.translateText(story.description, 'en', contentLanguage) : '',
          story.content ? translationService.translateStoryContent(story.content, 'en', contentLanguage) : ''
        ]);

        setTranslatedContent({
          title: translatedTitle,
          description: translatedDescription,
          content: translatedContentText
        });
      } catch (error) {
        console.error('Translation error:', error);
        setTranslationError('Translation failed. Showing original content.');
        setTranslatedContent(null);
      } finally {
        setIsTranslating(false);
      }
    };

    translateContent();
  }, [contentLanguage, story]);

  // Get content in the selected language
  const getCurrentContent = () => {
    if (!story) return { title: '', description: '', content: '' };

    if (contentLanguage === 'en' || !translatedContent) {
      return {
        title: story.title,
        description: story.description || '',
        content: story.content || ''
      };
    }

    return translatedContent;
  };

  const { title: currentTitle, description: currentDescription, content: currentContent } = getCurrentContent();

  const handleLike = async () => {
    if (!story || liked) return;

    try {
      await updateDoc(doc(db, 'trending_stories', story.id), {
        likes: increment(1)
      });

      setStory(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
      setLiked(true);

      // Store in localStorage to prevent multiple likes
      localStorage.setItem(`liked_trending_${story.id}`, 'true');
    } catch (err) {
      console.error('Error liking story:', err);
    }
  };

  const handleShare = () => {
    if (navigator.share && story) {
      navigator.share({
        title: story.title,
        text: story.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    // Check if user already liked this story
    if (story) {
      const hasLiked = localStorage.getItem(`liked_trending_${story.id}`);
      setLiked(!!hasLiked);
    }
  }, [story]);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading trending story...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="max-w-4xl mx-auto p-4 md:p-8">
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😔</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Story Not Found</h1>
              <p className="text-gray-600 mb-6">{error || 'The trending story you\'re looking for doesn\'t exist.'}</p>
              <Link href="/trending" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors">
                Back to Trending Stories
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <UserTracker contentType="story" contentId={story.id} />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {/* Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Link href="/trending" className="inline-flex items-center text-orange-600 hover:text-orange-800 transition-colors group">
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Trending Stories
            </Link>
            <div className="flex items-center space-x-4">
              <ContentLanguageTranslator
                currentLanguage={contentLanguage}
                onLanguageChange={setContentLanguage}
                isTranslating={isTranslating}
                compact={true}
              />
              <button
                onClick={handleShare}
                className="flex items-center text-gray-600 hover:text-orange-600 transition-colors"
              >
                <FaShare className="mr-1" />
                Share
              </button>
            </div>
          </div>

          {/* Translation Status Messages */}
          {isTranslating && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 shadow-sm">
              <div className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <div>
                  <p className="font-semibold">Translating Content...</p>
                  <p className="text-sm">Please wait while we translate this story for you.</p>
                </div>
              </div>
            </div>
          )}

          {translationError && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 shadow-sm">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-semibold">Translation Notice</p>
                  <p className="text-sm">{translationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* Story Header */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80">
              <img
                src={story.imageUrl || 'https://placehold.co/800x400/orange/white?text=Trending+Story'}
                alt={currentTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

              {/* Trending Badge */}
              <div className="absolute top-4 left-4">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center">
                  <FaFire className="mr-2" />
                  Trending Story
                </div>
              </div>

              {/* Priority Badge */}
              {story.priority > 5 && (
                <div className="absolute top-4 right-4">
                  <div className="bg-yellow-500 text-white px-3 py-2 rounded-full text-sm font-bold flex items-center">
                    <FaStar className="mr-1" />
                    Hot
                  </div>
                </div>
              )}
            </div>

            {/* Story Info */}
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
                  Ages {story.ageGroup}
                </span>
                {story.category && Array.isArray(story.category) && story.category.map((cat, index) => (
                  <span key={index} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {cat}
                  </span>
                ))}
                {story.category && typeof story.category === 'string' && (
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {story.category}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {currentTitle}
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {currentDescription}
              </p>

              {/* Stats and Actions */}
              <div className="flex items-center justify-between border-t pt-6">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    {story.views.toLocaleString()} views
                  </div>
                  <div className="flex items-center">
                    <FaHeart className="mr-1 text-red-500" />
                    {story.likes.toLocaleString()} likes
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    5 min read
                  </div>
                </div>

                <button
                  onClick={handleLike}
                  disabled={liked}
                  className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                    liked
                      ? 'bg-red-100 text-red-600 cursor-not-allowed'
                      : 'bg-red-500 text-white hover:bg-red-600'
                  }`}
                >
                  <FaHeart className="mr-2" />
                  {liked ? 'Liked!' : 'Like'}
                </button>
              </div>
            </div>
          </div>

          {/* Story Content */}
          <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
            <div className="prose prose-lg max-w-none">
              {currentContent ? (
                <div dangerouslySetInnerHTML={{ __html: currentContent }} />
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📖</div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Story Content Coming Soon</h3>
                  <p className="text-gray-500">
                    The full content for this trending story will be available soon.
                    Check back later for the complete story!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Stories */}
          <div className="mt-8 text-center">
            <Link
              href="/trending"
              className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
            >
              <FaFire className="mr-2" />
              Explore More Trending Stories
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
