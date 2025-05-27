'use client';

import React, { useState } from 'react';
import Header from './components/header';
import Hero1 from './components/hero1';
import Footer from './components/footer';
import StoriesList from './components/StoriesList';
import VideosList from './components/VideosList';
import TrendingStories from './components/TrendingStories';
import FeaturedCodeStories from './components/FeaturedCodeStories';
import AgeGroupFilter from './components/AgeGroupFilter';
import UserTracker from './components/UserTracker';
import NewsletterSubscription from './components/NewsletterSubscription';
import { FeedbackButton } from './components/FeedbackForm';
import Link from 'next/link';

export default function Home() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');

  const handleAgeGroupChange = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
  };

  return (
    <div>
      <UserTracker ageGroup={selectedAgeGroup as '0-3' | '3-6' | '6-9' | '9-12'} contentType="general" />
      <Header />
      <div className="pt-20"> {/* Add padding for fixed header */}
        <Hero1 />

        {/* Trending Stories Section */}
        <TrendingStories selectedAgeGroup={selectedAgeGroup} />

        {/* Newsletter Subscription Section */}
        <div className="container mx-auto px-4 py-8">
          <NewsletterSubscription className="mb-8" />
        </div>

      <div className="container mx-auto px-4 py-8">
        <AgeGroupFilter
          selectedAgeGroup={selectedAgeGroup}
          onAgeGroupChange={handleAgeGroupChange}
        />

        <div className="space-y-12">
          <StoriesList selectedAgeGroup={selectedAgeGroup} showAdminContent={true} />
          <VideosList selectedAgeGroup={selectedAgeGroup} showAdminContent={true} />

          {/* Featured Code Stories and Videos */}
          <FeaturedCodeStories selectedAgeGroup={selectedAgeGroup} />
        </div>

        {/* Featured Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 mb-12">
          <div className="bg-indigo-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-indigo-700 mb-3">For Educators</h3>
            <p className="text-gray-600 mb-4">
              Professional dashboard with real-time classroom management and student progress tracking.
            </p>
            <Link
              href="/educators"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Educator Portal
            </Link>
          </div>

          <div className="bg-pink-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-pink-700 mb-3">For Families</h3>
            <p className="text-gray-600 mb-4">
              Safe family hub with real-time monitoring and interactive learning experiences.
            </p>
            <Link
              href="/families"
              className="inline-block bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Family Hub
            </Link>
          </div>

          <div className="bg-blue-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-blue-700 mb-3">Age-Based Content</h3>
            <p className="text-gray-600 mb-4">
              Discover stories and videos specifically designed for your child&apos;s age group.
            </p>
            <Link
              href="/age-groups/0-3"
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Browse by Age
            </Link>
          </div>

          <div className="bg-purple-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-purple-700 mb-3">Code Stories</h3>
            <p className="text-gray-600 mb-4">
              Fun and interactive coding tutorials to introduce your child to programming.
            </p>
            <Link
              href="/code-stories"
              className="inline-block bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              Explore Code Stories
            </Link>
          </div>

          <div className="bg-teal-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-teal-700 mb-3">Code Videos</h3>
            <p className="text-gray-600 mb-4">
              Watch coding video tutorials and learn programming concepts through visual lessons.
            </p>
            <Link
              href="/code-videos"
              className="inline-block bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition-colors"
            >
              Watch Code Videos
            </Link>
          </div>

          <div className="bg-indigo-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-indigo-700 mb-3">Code Playground</h3>
            <p className="text-gray-600 mb-4">
              Practice coding with our free online IDE! Write, run, and experiment with code after learning.
            </p>
            <Link
              href="/code-playground"
              className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Start Coding
            </Link>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-purple-200">
            <h3 className="text-xl font-bold text-purple-700 mb-3">📖 Sample Code Story</h3>
            <p className="text-gray-600 mb-4">
              See how code stories work! Read &quot;My First HTML Adventure&quot; with interactive syntax examples.
            </p>
            <Link
              href="/sample-code-story"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:from-purple-700 hover:to-pink-700 transition-colors"
            >
              Read Sample Story
            </Link>
          </div>

          <div className="bg-yellow-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-yellow-700 mb-3">🎪 Poetry Theater</h3>
            <p className="text-gray-600 mb-4">
              Beautiful poems and theatrical performances that inspire imagination and creativity in young minds.
            </p>
            <Link
              href="/poems"
              className="inline-block bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Visit Poetry Theater
            </Link>
          </div>

          <div className="bg-green-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-green-700 mb-3">Educational Blog</h3>
            <p className="text-gray-600 mb-4">
              Expert insights and tips for parents and educators on child development.
            </p>
            <Link
              href="/blog"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Read Blog
            </Link>
          </div>

          <div className="bg-pink-50 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-bold text-pink-700 mb-3">For Parents</h3>
            <p className="text-gray-600 mb-4">
              Learn about our commitment to providing safe, educational content for your children.
            </p>
            <Link
              href="/parents"
              className="inline-block bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors"
            >
              Parents Information
            </Link>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 mt-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">We Value Your Feedback!</h2>
            <p className="text-xl mb-8 opacity-90">
              Help us improve BixForge Kids Zone by sharing your thoughts and suggestions
            </p>
            <FeedbackButton
              contentId="main-page"
              contentType="story"
              contentTitle="BixForge Kids Zone Main Page"
              className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            />
          </div>
        </div>

      </div>

        <Footer />
      </div>
    </div>
  );
}
