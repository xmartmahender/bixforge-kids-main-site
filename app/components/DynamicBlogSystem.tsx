'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useLanguage } from '../contexts/LanguageContext';
import { FaCalendar, FaUser, FaClock, FaTag, FaEye, FaHeart, FaShare, FaArrowRight } from 'react-icons/fa';
import { db } from '../../lib/firebase';
import { collection, query, getDocs, orderBy, limit, where, doc, updateDoc, increment } from 'firebase/firestore';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  featuredImage: string;
  tags: string[];
  category: string;
  readTime: number;
  views: number;
  likes: number;
  isPublished: boolean;
  isFeatured: boolean;
  language: string;
  seoTitle?: string;
  seoDescription?: string;
}

interface DynamicBlogSystemProps {
  showFeatured?: boolean;
  limit?: number;
  category?: string;
  language?: string;
}

const DynamicBlogSystem: React.FC<DynamicBlogSystemProps> = ({
  showFeatured = false,
  limit: postLimit = 6,
  category,
  language
}) => {
  const { t, currentLanguage, isRTL } = useLanguage();
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || 'all');

  const loadBlogPosts = useCallback(async () => {
    try {
      setLoading(true);

      // Build query
      let blogQuery = query(
        collection(db, 'blog_posts'),
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc')
      );

      // Add category filter if specified
      if (selectedCategory !== 'all') {
        blogQuery = query(
          collection(db, 'blog_posts'),
          where('isPublished', '==', true),
          where('category', '==', selectedCategory),
          orderBy('publishedAt', 'desc')
        );
      }

      // Add language filter
      if (language || currentLanguage) {
        blogQuery = query(
          collection(db, 'blog_posts'),
          where('isPublished', '==', true),
          where('language', '==', language || currentLanguage),
          orderBy('publishedAt', 'desc')
        );
      }

      // Add limit
      if (postLimit) {
        blogQuery = query(blogQuery, limit(postLimit));
      }

      const snapshot = await getDocs(blogQuery);
      const posts: BlogPost[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        posts.push({
          id: doc.id,
          ...data
        } as BlogPost);
      });

      setBlogPosts(posts);

      // Load featured posts if requested
      if (showFeatured) {
        const featuredQuery = query(
          collection(db, 'blog_posts'),
          where('isPublished', '==', true),
          where('isFeatured', '==', true),
          orderBy('publishedAt', 'desc'),
          limit(3)
        );

        const featuredSnapshot = await getDocs(featuredQuery);
        const featured: BlogPost[] = [];

        featuredSnapshot.forEach(doc => {
          const data = doc.data();
          featured.push({
            id: doc.id,
            ...data
          } as BlogPost);
        });

        setFeaturedPosts(featured);
      }

    } catch (error) {
      console.error('Error loading blog posts:', error);
      // No fallback - show empty state instead
      setBlogPosts([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, currentLanguage, language, postLimit, showFeatured]);

  useEffect(() => {
    loadBlogPosts();
    loadCategories();
  }, [loadBlogPosts]);

  const loadCategories = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'blog_posts'));
      const categorySet = new Set<string>();

      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.category) {
          categorySet.add(data.category);
        }
      });

      setCategories(Array.from(categorySet));
    } catch (error) {
      console.error('Error loading categories:', error);
      setCategories(['Education', 'Programming', 'Parenting', 'Technology', 'Safety']);
    }
  };

  // Mock data removed - using only real Firebase data

  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'ur-PK', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleLike = async (postId: string) => {
    try {
      await updateDoc(doc(db, 'blog_posts', postId), {
        likes: increment(1)
      });

      // Update local state
      setBlogPosts(prev => prev.map(post =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleShare = (post: BlogPost) => {
    const url = `${window.location.origin}/blog/${post.id}`;
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-300"></div>
            <div className="p-6">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Featured Posts */}
      {showFeatured && featuredPosts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Articles</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="relative">
                  <img
                    src={post.featuredImage || 'https://placehold.co/400x200/orange/white?text=Featured+Article'}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <FaCalendar className="mr-1" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      {post.readTime} {t('blog.readTime', 'min read')}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <FaEye className="mr-1" />
                        {post.views}
                      </div>
                      <div className="flex items-center">
                        <FaHeart className="mr-1" />
                        {post.likes}
                      </div>
                    </div>
                    <Link
                      href={`/blog/${post.id}`}
                      className="text-orange-600 hover:text-orange-800 font-semibold flex items-center"
                    >
                      {t('common.readMore', 'Read More')}
                      <FaArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'}`} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full transition-colors ${
              selectedCategory === 'all'
                ? 'bg-orange-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img
                src={post.featuredImage || 'https://placehold.co/400x200/orange/white?text=Blog+Post'}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className="bg-white bg-opacity-90 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-6">
              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                <div className="flex items-center">
                  <FaUser className="mr-1" />
                  {post.author}
                </div>
                <div className="flex items-center">
                  <FaCalendar className="mr-1" />
                  {formatDate(post.publishedAt)}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors">
                <Link href={`/blog/${post.id}`}>
                  {post.title}
                </Link>
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      <FaTag className="mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <FaClock className="mr-1" />
                    {post.readTime} min
                  </div>
                  <div className="flex items-center">
                    <FaEye className="mr-1" />
                    {post.views}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleLike(post.id)}
                    className="flex items-center text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <FaHeart className="mr-1" />
                    {post.likes}
                  </button>
                  <button
                    onClick={() => handleShare(post)}
                    className="text-gray-500 hover:text-blue-500 transition-colors"
                  >
                    <FaShare />
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Load More Button */}
      {blogPosts.length >= postLimit && (
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
          >
            {t('common.viewAll', 'View All Articles')}
            <FaArrowRight className={`${isRTL ? 'mr-2' : 'ml-2'}`} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default DynamicBlogSystem;
