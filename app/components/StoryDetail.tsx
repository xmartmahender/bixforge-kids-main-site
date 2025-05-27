'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Story } from '../../lib/storyService';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FeedbackButton } from './FeedbackForm';
import ContentLanguageTranslator, { useContentLanguage } from './ContentLanguageTranslator';
import { translationService } from '../../lib/translationService';

interface StoryDetailProps {
  storyId: string;
}

export default function StoryDetail({ storyId }: StoryDetailProps) {
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const { contentLanguage, setContentLanguage } = useContentLanguage();
  const [translatedContent, setTranslatedContent] = useState<{
    title: string;
    description: string;
    content: string;
  } | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationError, setTranslationError] = useState<string | null>(null);

  useEffect(() => {
    const loadStory = async () => {
      if (!storyId) return;

      setLoading(true);
      try {
        const storyDoc = await getDoc(doc(db, 'stories', storyId));
        if (storyDoc.exists()) {
          const storyData = {
            id: storyDoc.id,
            ...storyDoc.data()
          } as Story;
          setStory(storyData);
        }
      } catch (error) {
        console.error("Error loading story:", error);
      } finally {
        setLoading(false);
      }
    };

    loadStory();
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
        // Check if translation already exists in story data
        if (story.translations && story.translations[contentLanguage]) {
          const existingTranslation = story.translations[contentLanguage];
          setTranslatedContent({
            title: existingTranslation.title || story.title,
            description: existingTranslation.description || story.description || '',
            content: existingTranslation.content || story.content || ''
          });
        } else {
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
        }
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

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading story...</div>;
  }

  if (!story) {
    return <div className="flex justify-center items-center min-h-screen">Story not found</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto p-4 md:p-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors group">
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Stories
          </Link>

          {/* Content Language Translator */}
          <ContentLanguageTranslator
            currentLanguage={contentLanguage}
            onLanguageChange={setContentLanguage}
            isTranslating={isTranslating}
            compact={true}
          />
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
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Story Image */}
          <div className="relative h-64 md:h-96 overflow-hidden">
            <img
              src={story.imageUrl || "https://placehold.co/1200x600/6366f1/ffffff?text=Story+Image"}
              alt={currentTitle}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://placehold.co/1200x600/6366f1/ffffff?text=Story+Image";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

            {/* Story Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-purple-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {story.isCodeStory ? '💻 Code Story' : '📚 Story'}
              </span>
            </div>

            {/* Age Group Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                👶 Ages {story.ageGroup}
              </span>
            </div>
          </div>

          {/* Story Info */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800 leading-tight">
              {currentTitle}
            </h1>

            {currentDescription && (
              <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-xl mb-6 border-l-4 border-purple-500">
                <p className="text-lg text-gray-700 italic leading-relaxed">
                  {currentDescription}
                </p>
              </div>
            )}

            {/* Story Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                5-10 min read
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Perfect for ages {story.ageGroup}
              </div>
              {story.programmingLanguage && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {story.programmingLanguage.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Story Content */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
          {currentContent ? (
            <div className="prose prose-lg max-w-none">
              {currentContent.split('\n').map((paragraph: string, idx: number) => {
                if (!paragraph.trim()) return <div key={idx} className="h-4"></div>;

                // Process text formatting
                let content = paragraph;

                // Format emphasis
                content = content.replace(/\*([^*]+)\*/g,
                  '<span class="font-semibold text-purple-700 bg-purple-50 px-1 rounded">$1</span>'
                );

                // Format sound effects
                content = content.replace(/\b([A-Z]{2,}!+)\b/g,
                  '<span class="font-bold text-xl text-red-600 bg-red-50 px-2 py-1 rounded-lg">$1</span>'
                );

                // Format dialogue
                content = content.replace(/"([^"]+)"/g,
                  '<span class="text-blue-600 bg-blue-50 px-1 rounded italic">"$1"</span>'
                );

                return (
                  <p key={idx} className="mb-6 text-lg leading-relaxed text-gray-700"
                    dangerouslySetInnerHTML={{ __html: content }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-xl text-gray-600">No content available for this story.</p>
            </div>
          )}

          {/* Feedback Section */}
          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
            <FeedbackButton
              contentId={story.id}
              contentType="story"
              contentTitle={currentTitle}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            />
          </div>
        </div>

        {/* Practice Code Section - Only for Code Stories */}
        {story.isCodeStory && story.programmingLanguage && (
          <div className="mt-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-xl p-6 md:p-8 border border-indigo-200">
            <div className="text-center">
              <div className="text-6xl mb-4">💻</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Practice Coding?</h3>
              <p className="text-lg text-gray-600 mb-6">
                Now that you&apos;ve learned about {story.programmingLanguage.toUpperCase()},
                try writing your own code in our free online IDE!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={`/code-playground?language=${story.programmingLanguage}&age=${story.ageGroup}`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Practice {story.programmingLanguage.toUpperCase()} Code
                </Link>
                <Link
                  href="/code-stories"
                  className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 border-2 border-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  More Code Stories
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Related Stories Section */}
        <div className="mt-12 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">More Stories You Might Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for related stories */}
            <div className="text-center py-8 text-gray-500">
              <p>Related stories coming soon!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}