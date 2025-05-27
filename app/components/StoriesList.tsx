'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { getStories } from '../../lib/storyService';

interface Story {
  id?: string;
  title: string;
  description: string;
  ageGroup: string;
  imageUrl?: string;
  rating?: number;
  readCount?: number;
  category?: string | string[];
  isCodeStory?: boolean;
  programmingLanguage?: string;
  content?: string;
  disabled?: boolean;
  featured?: boolean;
  createdAt?: { seconds: number };
  updatedAt?: { seconds: number };
}

interface StoriesListProps {
  selectedAgeGroup: string;
  showAdminContent?: boolean;
}

export default function StoriesList({ selectedAgeGroup, showAdminContent = false }: StoriesListProps) {
  const [adminStories, setAdminStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch admin-created stories from Firebase
  useEffect(() => {
    if (showAdminContent) {
      fetchAdminStories();
    }
  }, [showAdminContent]);

  const fetchAdminStories = async () => {
    setLoading(true);
    try {
      // Use the updated storyService that includes admin content
      const stories = await getStories('', 50, 'english'); // Get all stories including admin content

      const formattedStories: Story[] = stories.map(story => ({
        id: story.id,
        title: story.title || 'Untitled Story',
        description: story.description || 'No description available',
        ageGroup: story.ageGroup || '3-6',
        imageUrl: story.imageUrl || 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=300&fit=crop',
        rating: 4.5, // Default rating
        readCount: Math.floor(Math.random() * 1000) + 100,
        category: story.isCodeStory ? 'Code Story' : (Array.isArray(story.category) ? story.category[0] : story.category) || 'Story',
        isCodeStory: story.isCodeStory || false,
        programmingLanguage: story.programmingLanguage,
        content: story.content,
        disabled: story.disabled || false,
        featured: story.featured || false,
        createdAt: story.createdAt,
        updatedAt: story.updatedAt
      }));

      setAdminStories(formattedStories);
      console.log(`📚 Loaded ${formattedStories.length} stories (including admin content)`);
    } catch (error) {
      console.error('Error fetching admin stories:', error);
    } finally {
      setLoading(false);
    }
  };

  // No mock stories - only show admin content

  // Filter stories based on selected age group - only show admin content
  const filteredStories = useMemo(() => {
    // Always use admin stories only
    const allStories = adminStories;

    if (!selectedAgeGroup || selectedAgeGroup === 'all') {
      return allStories;
    }
    return allStories.filter(story => story.ageGroup === selectedAgeGroup);
  }, [selectedAgeGroup, adminStories]);

  // Group stories by age group
  const storiesByAgeGroup = useMemo(() => {
    return filteredStories.reduce((acc, story) => {
      const ageGroup = story.ageGroup || 'Other';
      if (!acc[ageGroup]) {
        acc[ageGroup] = [];
      }
      acc[ageGroup].push(story);
      return acc;
    }, {} as Record<string, Story[]>);
  }, [filteredStories]);

  // Sort age groups in a specific order
  const ageGroupOrder = ['0-3', '3-6', '6-9', '9-12', 'Other'];
  const sortedAgeGroups = Object.keys(storiesByAgeGroup).sort(
    (a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b)
  );

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4 animate-pulse">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Loading stories...</h3>
        <p className="text-gray-500">Please wait while we fetch the latest content.</p>
      </div>
    );
  }

  if (filteredStories.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No stories found</h3>
        <p className="text-gray-500">
          {selectedAgeGroup
            ? `No stories available for age group ${selectedAgeGroup}. Add stories through the admin dashboard!`
            : 'No stories have been added yet. Add stories through the admin dashboard!'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {sortedAgeGroups.map(ageGroup => (
        <div key={ageGroup} className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Ages {ageGroup}
            </div>
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-500">{storiesByAgeGroup[ageGroup].length} stories</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {storiesByAgeGroup[ageGroup].map(story => (
              <Link href={`/stories/${story.id}`} key={story.id} className="group">
                <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:border-purple-200">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
                      {story.category || (story.isCodeStory ? 'Code Story' : 'Story')}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {story.title}
                    </h3>

                    <p className="text-gray-600 text-sm line-clamp-2">
                      {story.description}
                    </p>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-400">⭐</span>
                        <span>{story.rating || 4.5}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>👁️</span>
                        <span>{(story.readCount || 0).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
