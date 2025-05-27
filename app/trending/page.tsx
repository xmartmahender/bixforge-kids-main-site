'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { getTrendingStories, TrendingStory } from '../../lib/storyService';
import { FaFire, FaEye, FaHeart, FaStar, FaClock, FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import AgeGroupFilter from '../components/AgeGroupFilter';

export default function TrendingPage() {
  const [trendingStories, setTrendingStories] = useState<TrendingStory[]>([]);
  const [filteredStories, setFilteredStories] = useState<TrendingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('priority'); // priority, views, likes, newest

  useEffect(() => {
    const fetchTrendingStories = async () => {
      try {
        setLoading(true);
        const stories = await getTrendingStories(50); // Get more stories for the dedicated page
        setTrendingStories(stories);
        setFilteredStories(stories);
        setError('');
      } catch (err) {
        console.error('Error fetching trending stories:', err);
        setError('Failed to load trending stories');
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingStories();
  }, []);

  useEffect(() => {
    let filtered = [...trendingStories];

    // Filter by age group
    if (selectedAgeGroup && selectedAgeGroup !== '') {
      filtered = filtered.filter(story => story.ageGroup === selectedAgeGroup);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(story =>
        story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (story.category && (
          Array.isArray(story.category)
            ? story.category.some(cat => cat.toLowerCase().includes(searchTerm.toLowerCase()))
            : story.category.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      );
    }

    // Sort stories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'views':
          return b.views - a.views;
        case 'likes':
          return b.likes - a.likes;
        case 'newest':
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        case 'priority':
        default:
          if (a.priority !== b.priority) return b.priority - a.priority;
          if (a.views !== b.views) return b.views - a.views;
          return 0;
      }
    });

    setFilteredStories(filtered);
  }, [trendingStories, selectedAgeGroup, searchTerm, sortBy]);

  const handleAgeGroupChange = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
          <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-8">
              <FaFire className="text-6xl text-orange-500 mx-auto mb-4 animate-pulse" />
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Loading Trending Stories...</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, index) => (
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
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <div className="container mx-auto px-4 py-12">
          {/* Page Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <FaFire className="text-6xl text-orange-500 mr-4 animate-bounce" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                Trending Stories
              </h1>
              <FaFire className="text-6xl text-orange-500 ml-4 animate-bounce" />
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              🔥 Discover the hottest stories that everyone is reading right now!
              From magical adventures to coding quests, find your next favorite story here.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center">
              {/* Age Group Filter */}
              <div className="flex-1">
                <AgeGroupFilter
                  selectedAgeGroup={selectedAgeGroup}
                  onAgeGroupChange={handleAgeGroupChange}
                />
              </div>

              {/* Search */}
              <div className="flex-1 relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search trending stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {/* Sort */}
              <div className="flex-1">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="priority">🔥 Most Trending</option>
                  <option value="views">👀 Most Viewed</option>
                  <option value="likes">❤️ Most Liked</option>
                  <option value="newest">🆕 Newest</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600 text-lg">
              {filteredStories.length === 0 ? (
                'No trending stories found matching your criteria'
              ) : (
                `Showing ${filteredStories.length} trending ${filteredStories.length === 1 ? 'story' : 'stories'}`
              )}
              {selectedAgeGroup && ` for ages ${selectedAgeGroup}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Error State */}
          {error && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">😞</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* No Results */}
          {!error && filteredStories.length === 0 && !loading && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No trending stories found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or search terms to find more stories.
              </p>
              <button
                onClick={() => {
                  setSelectedAgeGroup('');
                  setSearchTerm('');
                  setSortBy('priority');
                }}
                className="bg-orange-500 text-white px-8 py-3 rounded-lg hover:bg-orange-600 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Trending Stories Grid */}
          {filteredStories.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredStories.map((story, index) => (
                <Link href={`/trending/${story.id}`} key={story.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 relative group">
                    {/* Trending Rank Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
                        <FaFire className="mr-1" />
                        #{index + 1}
                      </div>
                    </div>

                    {/* Priority Badge */}
                    {story.priority > 7 && (
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                          <FaStar className="mr-1" />
                          HOT
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
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
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

                      <p className="text-gray-600 text-sm line-clamp-3 mb-3">
                        {story.description}
                      </p>

                      {/* Categories */}
                      {story.category && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {Array.isArray(story.category) ? (
                            <>
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
                            </>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                              {story.category}
                            </span>
                          )}
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
          )}

          {/* Load More Button (if needed) */}
          {filteredStories.length > 0 && filteredStories.length >= 20 && (
            <div className="text-center mt-12">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105">
                Load More Trending Stories
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
