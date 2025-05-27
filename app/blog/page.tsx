'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UserTracker from '../components/UserTracker';
import DynamicBlogSystem from '../components/DynamicBlogSystem';
import { useLanguage } from '../contexts/LanguageContext';

export default function BlogPage() {
  const { t, isRTL } = useLanguage();

  return (
    <div className={isRTL ? 'rtl' : 'ltr'}>
      <UserTracker contentType="general" contentId="main" />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">✍️</span>
              <h1 className="text-4xl md:text-5xl font-bold">
                {t('blog.title', 'Educational Blog')}
              </h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              {t('blog.subtitle', 'Expert insights, tips, and resources for parents and educators')}
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Expert articles</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Parenting tips</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Educational insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <DynamicBlogSystem
              showFeatured={true}
              limit={12}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
