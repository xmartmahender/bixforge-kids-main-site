'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '../contexts/LanguageContext';
import { FaSearch, FaTimes, FaBook, FaVideo, FaCode, FaFileAlt, FaFire } from 'react-icons/fa';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, limit, orderBy } from 'firebase/firestore';

interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'story' | 'video' | 'code-story' | 'blog' | 'trending';
  category?: string;
  ageGroup?: string;
  imageUrl?: string;
  url: string;
}

interface SearchEngineProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchEngine: React.FC<SearchEngineProps> = ({ isOpen, onClose }) => {
  const { t, isRTL } = useLanguage();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularContent, setPopularContent] = useState<SearchResult[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bixforge-recent-searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Load popular content on mount
  useEffect(() => {
    loadPopularContent();
  }, []);

  const loadPopularContent = async () => {
    try {
      const popularItems: SearchResult[] = [];

      // Get popular stories
      const storiesQuery = query(
        collection(db, 'stories'),
        orderBy('views', 'desc'),
        limit(3)
      );
      const storiesSnapshot = await getDocs(storiesQuery);
      storiesSnapshot.forEach(doc => {
        const data = doc.data();
        popularItems.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          type: 'story',
          ageGroup: data.ageGroup,
          imageUrl: data.imageUrl,
          url: `/stories/${doc.id}`
        });
      });

      // Get popular videos
      const videosQuery = query(
        collection(db, 'videos'),
        orderBy('views', 'desc'),
        limit(2)
      );
      const videosSnapshot = await getDocs(videosQuery);
      videosSnapshot.forEach(doc => {
        const data = doc.data();
        popularItems.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          type: 'video',
          ageGroup: data.ageGroup,
          imageUrl: data.thumbnail,
          url: `/videos/${doc.id}`
        });
      });

      // Get trending stories
      const trendingQuery = query(
        collection(db, 'trending_stories'),
        orderBy('priority', 'desc'),
        limit(2)
      );
      const trendingSnapshot = await getDocs(trendingQuery);
      trendingSnapshot.forEach(doc => {
        const data = doc.data();
        popularItems.push({
          id: doc.id,
          title: data.title,
          description: data.description,
          type: 'trending',
          ageGroup: data.ageGroup,
          imageUrl: data.imageUrl,
          url: `/trending/${doc.id}`
        });
      });

      setPopularContent(popularItems);
    } catch (error) {
      console.error('Error loading popular content:', error);
    }
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results: SearchResult[] = [];
      const searchTerm = query.toLowerCase();

      // Search in stories
      const storiesSnapshot = await getDocs(collection(db, 'stories'));
      storiesSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.title?.toLowerCase().includes(searchTerm) ||
          data.description?.toLowerCase().includes(searchTerm) ||
          data.category?.some((cat: string) => cat.toLowerCase().includes(searchTerm))
        ) {
          results.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'story',
            category: Array.isArray(data.category) ? data.category.join(', ') : data.category,
            ageGroup: data.ageGroup,
            imageUrl: data.imageUrl,
            url: `/stories/${doc.id}`
          });
        }
      });

      // Search in videos
      const videosSnapshot = await getDocs(collection(db, 'videos'));
      videosSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.title?.toLowerCase().includes(searchTerm) ||
          data.description?.toLowerCase().includes(searchTerm) ||
          data.category?.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'video',
            category: data.category,
            ageGroup: data.ageGroup,
            imageUrl: data.thumbnail,
            url: `/videos/${doc.id}`
          });
        }
      });

      // Search in code stories
      const codeStoriesSnapshot = await getDocs(collection(db, 'code_stories'));
      codeStoriesSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.title?.toLowerCase().includes(searchTerm) ||
          data.description?.toLowerCase().includes(searchTerm) ||
          data.programmingLanguage?.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'code-story',
            category: data.programmingLanguage,
            ageGroup: data.ageGroup,
            imageUrl: data.imageUrl,
            url: `/code-stories/${doc.id}`
          });
        }
      });

      // Search in blog posts
      const blogSnapshot = await getDocs(collection(db, 'blog_posts'));
      blogSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.title?.toLowerCase().includes(searchTerm) ||
          data.excerpt?.toLowerCase().includes(searchTerm) ||
          data.tags?.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        ) {
          results.push({
            id: doc.id,
            title: data.title,
            description: data.excerpt,
            type: 'blog',
            category: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            imageUrl: data.featuredImage,
            url: `/blog/${doc.id}`
          });
        }
      });

      // Search in trending stories
      const trendingSnapshot = await getDocs(collection(db, 'trending_stories'));
      trendingSnapshot.forEach(doc => {
        const data = doc.data();
        if (
          data.title?.toLowerCase().includes(searchTerm) ||
          data.description?.toLowerCase().includes(searchTerm)
        ) {
          results.push({
            id: doc.id,
            title: data.title,
            description: data.description,
            type: 'trending',
            ageGroup: data.ageGroup,
            imageUrl: data.imageUrl,
            url: `/trending/${doc.id}`
          });
        }
      });

      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      performSearch(query);
    } else {
      setSearchResults([]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    // Save to recent searches
    const newRecentSearches = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('bixforge-recent-searches', JSON.stringify(newRecentSearches));

    // Navigate to result
    router.push(result.url);
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'story': return <FaBook className="text-blue-500" />;
      case 'video': return <FaVideo className="text-red-500" />;
      case 'code-story': return <FaCode className="text-green-500" />;
      case 'blog': return <FaFileAlt className="text-purple-500" />;
      case 'trending': return <FaFire className="text-orange-500" />;
      default: return <FaBook className="text-gray-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'story': return t('stories.title', 'Stories');
      case 'video': return t('videos.title', 'Videos');
      case 'code-story': return t('codeStories.title', 'Code Stories');
      case 'blog': return t('blog.title', 'Blog');
      case 'trending': return 'Trending';
      default: return type;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-4 sm:pt-20">
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-2 sm:mx-4 max-h-[90vh] sm:max-h-[80vh] overflow-hidden ${isRTL ? 'text-right' : 'text-left'}`}>
        {/* Search Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="flex-1 relative">
              <FaSearch className={`absolute top-1/2 transform -translate-y-1/2 text-gray-400 ${isRTL ? 'right-3 sm:right-4' : 'left-3 sm:left-4'}`} />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t('search.placeholder', 'Search stories, videos, code tutorials...')}
                className={`w-full ${isRTL ? 'pr-10 sm:pr-12 pl-3 sm:pl-4' : 'pl-10 sm:pl-12 pr-3 sm:pr-4'} py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base`}
              />
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
            >
              <FaTimes size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>

        {/* Search Results */}
        <div className="max-h-80 sm:max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-6 sm:p-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600 text-sm sm:text-base">{t('common.loading', 'Loading...')}</p>
            </div>
          ) : searchQuery && searchResults.length > 0 ? (
            <div className="p-3 sm:p-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
                {t('search.results', 'Search Results')} ({searchResults.length})
              </h3>
              <div className="space-y-3">
                {searchResults.map((result) => (
                  <div
                    key={`${result.type}-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div className="flex-shrink-0">
                      {result.imageUrl ? (
                        <img
                          src={result.imageUrl}
                          alt={result.title}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          {getTypeIcon(result.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-1 sm:space-x-2 mb-1 flex-wrap">
                        <div className="flex items-center space-x-1">
                          {getTypeIcon(result.type)}
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            {getTypeLabel(result.type)}
                          </span>
                        </div>
                        {result.ageGroup && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded whitespace-nowrap">
                            Ages {result.ageGroup}
                          </span>
                        )}
                      </div>
                      <h4 className="font-medium text-gray-900 truncate text-sm sm:text-base">{result.title}</h4>
                      <p className="text-xs sm:text-sm text-gray-600 truncate">{result.description}</p>
                      {result.category && (
                        <p className="text-xs text-gray-500 mt-1 truncate">{result.category}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : searchQuery && searchResults.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t('search.noResults', 'No results found')}
              </h3>
              <p className="text-gray-600">Try different keywords or browse our popular content below.</p>
            </div>
          ) : (
            <div className="p-4">
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Recent Searches</h3>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Content */}
              {popularContent.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">Popular Content</h3>
                  <div className="space-y-3">
                    {popularContent.map((item) => (
                      <div
                        key={`${item.type}-${item.id}`}
                        onClick={() => handleResultClick(item)}
                        className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                      >
                        <div className="flex-shrink-0">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              className="w-10 h-10 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                              {getTypeIcon(item.type)}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-xs text-gray-500 uppercase tracking-wide">
                              {getTypeLabel(item.type)}
                            </span>
                            {item.ageGroup && (
                              <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                Ages {item.ageGroup}
                              </span>
                            )}
                          </div>
                          <h4 className="font-medium text-gray-900 truncate">{item.title}</h4>
                          <p className="text-sm text-gray-600 truncate">{item.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchEngine;
