'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';

export default function AboutPage() {
  return (
    <div>
      <UserTracker contentType="general" contentId="about" />
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
          &larr; Back to Home
        </Link>

        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-8 text-purple-800">About Kidz Zone</h1>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-700 mb-4">Welcome to Our Magical World!</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Kidz Zone is a safe, fun, and educational platform designed specifically for children.
                We believe in nurturing young minds through engaging stories, interactive videos,
                and coding adventures that spark creativity and learning.
              </p>
            </div>
          </div>

          {/* Mission Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-blue-700 mb-3">Our Mission</h3>
                <p className="text-gray-600">
                  To provide a safe, educational, and entertaining digital space where children can
                  explore, learn, and grow through age-appropriate content that inspires creativity
                  and critical thinking.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-green-700 mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To be the leading platform for children&apos;s digital education, fostering a love
                  for learning through innovative storytelling, coding education, and interactive
                  experiences.
                </p>
              </div>
            </div>
          </div>

          {/* What We Offer */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-center text-purple-700 mb-6">What We Offer</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-purple-600 mb-2">Interactive Stories</h4>
                <p className="text-sm text-gray-600">Age-appropriate stories that engage and educate</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-pink-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-pink-600 mb-2">Educational Videos</h4>
                <p className="text-sm text-gray-600">Fun videos that make learning enjoyable</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-blue-600 mb-2">Coding Adventures</h4>
                <p className="text-sm text-gray-600">Introduction to programming through fun activities</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-yellow-600 mb-2">Creative Poems</h4>
                <p className="text-sm text-gray-600">Beautiful poems that inspire imagination</p>
              </div>
            </div>
          </div>

          {/* Age Groups */}
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-center text-purple-700 mb-6">Age-Appropriate Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-bold text-purple-600 mb-2">0-3 Years</h4>
                <p className="text-sm text-gray-600">Simple stories and colorful videos for toddlers</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-bold text-blue-600 mb-2">3-6 Years</h4>
                <p className="text-sm text-gray-600">Interactive content for preschoolers</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-bold text-green-600 mb-2">6-9 Years</h4>
                <p className="text-sm text-gray-600">Educational adventures for early learners</p>
              </div>
              <div className="bg-white rounded-lg p-4 text-center">
                <h4 className="font-bold text-orange-600 mb-2">9-12 Years</h4>
                <p className="text-sm text-gray-600">Advanced content for pre-teens</p>
              </div>
            </div>
          </div>

          {/* Safety & Values */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h3 className="text-2xl font-bold text-center text-purple-700 mb-6">Our Commitment to Safety</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-green-600 mb-2">Safe Content</h4>
                <p className="text-sm text-gray-600">All content is carefully reviewed and age-appropriate</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M7.07,18.28C7.5,17.38 10.12,16.5 12,16.5C13.88,16.5 16.5,17.38 16.93,18.28C15.57,19.36 13.86,20 12,20C10.14,20 8.43,19.36 7.07,18.28M18.36,16.83C16.93,15.09 13.46,14.5 12,14.5C10.54,14.5 7.07,15.09 5.64,16.83C4.62,15.5 4,13.82 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,13.82 19.38,15.5 18.36,16.83M12,6C10.06,6 8.5,7.56 8.5,9.5C8.5,11.44 10.06,13 12,13C13.94,13 15.5,11.44 15.5,9.5C15.5,7.56 13.94,6 12,6M12,11A1.5,1.5 0 0,1 10.5,9.5A1.5,1.5 0 0,1 12,8A1.5,1.5 0 0,1 13.5,9.5A1.5,1.5 0 0,1 12,11Z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-blue-600 mb-2">Privacy First</h4>
                <p className="text-sm text-gray-600">We protect children&apos;s privacy and data</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12,2A2,2 0 0,1 14,4C14,4.74 13.6,5.39 13,5.73V7H14A7,7 0 0,1 21,14H22A1,1 0 0,1 23,15V18A1,1 0 0,1 22,19H21V20A2,2 0 0,1 19,22H5A2,2 0 0,1 3,20V19H2A1,1 0 0,1 1,18V15A1,1 0 0,1 2,14H3A7,7 0 0,1 10,7H11V5.73C10.4,5.39 10,4.74 10,4A2,2 0 0,1 12,2M7.5,13A2.5,2.5 0 0,0 5,15.5A2.5,2.5 0 0,0 7.5,18A2.5,2.5 0 0,0 10,15.5A2.5,2.5 0 0,0 7.5,13M16.5,13A2.5,2.5 0 0,0 14,15.5A2.5,2.5 0 0,0 16.5,18A2.5,2.5 0 0,0 19,15.5A2.5,2.5 0 0,0 16.5,13Z"/>
                  </svg>
                </div>
                <h4 className="font-bold text-purple-600 mb-2">Educational Focus</h4>
                <p className="text-sm text-gray-600">Every piece of content has educational value</p>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Community!</h3>
            <p className="text-lg mb-6">
              Start your child&apos;s learning journey with us today. Explore our vast collection of
              stories, videos, and coding adventures designed just for kids.
            </p>
            <div className="space-x-4">
              <Link
                href="/stories"
                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Explore Stories
              </Link>
              <Link
                href="/videos"
                className="inline-block bg-purple-800 text-white px-6 py-3 rounded-md font-semibold hover:bg-purple-900 transition-colors"
              >
                Watch Videos
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
