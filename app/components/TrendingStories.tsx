'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getTrendingStories, TrendingStory } from '../../lib/storyService';
import { FaFire, FaEye, FaHeart, FaStar, FaClock } from 'react-icons/fa';

interface TrendingStoriesProps {
  selectedAgeGroup?: string;
}

export default function TrendingStories({ selectedAgeGroup }: TrendingStoriesProps) {
  const [trendingStories, setTrendingStories] = useState<TrendingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrendingStories = async () => {
      try {
        setLoading(true);
        const stories = await getTrendingStories(6, 'english'); // Include language parameter

        // Filter by age group if specified
        const filteredStories = selectedAgeGroup && selectedAgeGroup !== ''
          ? stories.filter(story => story.ageGroup === selectedAgeGroup)
          : stories;

        setTrendingStories(filteredStories);
        console.log(`🔥 Loaded ${filteredStories.length} trending stories (including admin content)`);
        setError('');
      } catch (err) {
        console.error('Error fetching trending stories:', err);
        setError('Failed to load trending stories');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingStories();
  }, [selectedAgeGroup]);

  if (loading) {
    return (
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FaFire className="text-3xl text-orange-500 mr-3 animate-pulse" />
            <h2 className="text-3xl font-bold text-gray-800">Trending Stories</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-3 bg-gray-300 rounded w-16"></div>
                    <div className="h-3 bg-gray-300 rounded w-12"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FaFire className="text-3xl text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Trending Stories</h2>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (trendingStories.length === 0) {
    return (
      <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <FaFire className="text-3xl text-orange-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-800">Trending Stories</h2>
          </div>
          <div className="text-center py-8">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No trending stories yet</h3>
            <p className="text-gray-500">Check back soon for exciting trending content!</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 bg-gradient-to-r from-orange-50 to-red-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-center mb-8">
          <FaFire className="text-3xl text-orange-500 mr-3 animate-bounce" />
          <h2 className="text-3xl font-bold text-gray-800">Trending Stories</h2>
          <FaFire className="text-3xl text-orange-500 ml-3 animate-bounce" />
        </div>

        <p className="text-center text-gray-600 mb-8 text-lg">
          🔥 The hottest stories everyone is reading right now!
        </p>

        {/* Trending Stories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {trendingStories.map((story, index) => (
            <Link href={`/trending/${story.id}`} key={story.id}>
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative group">
                {/* Trending Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                    <FaFire className="mr-1" />
                    #{index + 1} Trending
                  </div>
                </div>

                {/* Priority Badge */}
                {story.priority > 5 && (
                  <div className="absolute top-3 right-3 z-10">
                    <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                      <FaStar className="mr-1" />
                      Hot
                    </div>
                  </div>
                )}

                {/* Story Image */}
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={story.imageUrl || 'https://placehold.co/400x300/orange/white?text=Trending+Story'}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Story Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-orange-100 text-orange-700 text-xs px-2 py-1 rounded-full font-semibold">
                      {story.ageGroup} years
                    </span>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center">
                        <FaEye className="mr-1" />
                        {story.views.toLocaleString()}
                      </div>
                      <div className="flex items-center">
                        <FaHeart className="mr-1 text-red-500" />
                        {story.likes.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold text-lg mb-2 text-gray-800 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {story.title}
                  </h3>

                  <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                    {story.description}
                  </p>

                  {/* Categories */}
                  {story.category && Array.isArray(story.category) && story.category.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {story.category.slice(0, 2).map((cat, catIndex) => (
                        <span key={catIndex} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          {cat}
                        </span>
                      ))}
                      {story.category.length > 2 && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                          +{story.category.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                  {/* Fallback for string category */}
                  {story.category && typeof story.category === 'string' && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                        {story.category}
                      </span>
                    </div>
                  )}

                  {/* Read Button */}
                  <div className="flex items-center justify-between">
                    <span className="text-orange-600 font-semibold text-sm group-hover:text-orange-700 transition-colors">
                      Read Story →
                    </span>
                    <div className="flex items-center text-xs text-gray-400">
                      <FaClock className="mr-1" />
                      5 min read
                    </div>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        {trendingStories.length > 0 && (
          <div className="text-center mt-8">
            <Link href="/trending" className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105">
              <FaFire className="mr-2" />
              View All Trending Stories
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
