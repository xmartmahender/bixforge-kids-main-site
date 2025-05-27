'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UserTracker from '../components/UserTracker';

export default function ParentsPage() {
  return (
    <div>
      <UserTracker contentType="general" />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">👪</span>
              <h1 className="text-4xl md:text-5xl font-bold">For Parents</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Safe, educational, and engaging content designed with your child&apos;s development in mind
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Expert-reviewed content</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Age-appropriate materials</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Safe environment</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            {/* Our Commitment Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">🎯 Our Commitment to Your Children</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="mb-4 text-gray-700 text-lg leading-relaxed">
                    At BixForge Kids Zone, we understand that parents are looking for safe, educational, and engaging content for their children.
                    Our platform is designed with your child&apos;s development and safety in mind, providing age-appropriate stories and videos
                    that entertain while they educate.
                  </p>
                </div>
                <div>
                  <p className="mb-4 text-gray-700 text-lg leading-relaxed">
                    Every piece of content on our platform is carefully reviewed by our team of educators and child development experts
                    to ensure it meets our high standards for quality and appropriateness.
                  </p>
                </div>
              </div>
            </div>

            {/* Content Safety Section */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border-2 border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">🛡️ Content Safety & Trust</h2>
              <p className="mb-8 text-gray-700 text-lg text-center max-w-3xl mx-auto">
                We take the safety of our content extremely seriously. Here&apos;s how we ensure our platform remains trustworthy:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
                  <div className="text-3xl mb-3">✅</div>
                  <h3 className="font-bold text-blue-700 mb-2">Manual Review</h3>
                  <p className="text-gray-700 text-sm">All stories and videos are manually reviewed before being published</p>
                </div>
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border-2 border-green-200">
                  <div className="text-3xl mb-3">👶</div>
                  <h3 className="font-bold text-green-700 mb-2">Age-Appropriate</h3>
                  <p className="text-gray-700 text-sm">Content is categorized by age group to ensure age-appropriateness</p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border-2 border-purple-200">
                  <div className="text-3xl mb-3">🚫</div>
                  <h3 className="font-bold text-purple-700 mb-2">No Ads</h3>
                  <p className="text-gray-700 text-sm">No advertisements or external links that could lead children away</p>
                </div>
                <div className="bg-gradient-to-r from-pink-50 to-pink-100 p-6 rounded-xl border-2 border-pink-200">
                  <div className="text-3xl mb-3">🔒</div>
                  <h3 className="font-bold text-pink-700 mb-2">Privacy Protected</h3>
                  <p className="text-gray-700 text-sm">No collection of personal information from children</p>
                </div>
                <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border-2 border-yellow-200">
                  <div className="text-3xl mb-3">🔍</div>
                  <h3 className="font-bold text-yellow-700 mb-2">Regular Audits</h3>
                  <p className="text-gray-700 text-sm">Regular content audits to maintain our high standards</p>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-xl border-2 border-indigo-200">
                  <div className="text-3xl mb-3">💬</div>
                  <h3 className="font-bold text-indigo-700 mb-2">Transparent</h3>
                  <p className="text-gray-700 text-sm">Open communication with parents about any concerns</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-gray-700 text-lg">
                  We believe in transparency with parents. If you ever have concerns about any content on our platform,
                  please don&apos;t hesitate to contact us.
                </p>
              </div>
            </div>

            {/* Educational Benefits & Parent Involvement */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">📚 Educational Benefits</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">📖</span>
                    <p className="text-gray-700">Promotes literacy and language development</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl">🎨</span>
                    <p className="text-gray-700">Encourages imagination and creativity</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">💡</span>
                    <p className="text-gray-700">Teaches important life lessons and values</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-pink-500 text-xl">🧠</span>
                    <p className="text-gray-700">Supports cognitive development</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-500 text-xl">🌍</span>
                    <p className="text-gray-700">Introduces diverse cultures and perspectives</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">👨‍👩‍👧‍👦 How Parents Can Get Involved</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-blue-500 text-xl">👀</span>
                    <p className="text-gray-700">Explore stories and videos with your child</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">💬</span>
                    <p className="text-gray-700">Discuss the themes and lessons from the stories</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-purple-500 text-xl">💡</span>
                    <p className="text-gray-700">Suggest new content or topics you&apos;d like to see</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-pink-500 text-xl">📝</span>
                    <p className="text-gray-700">Provide feedback on existing content</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-500 text-xl">📤</span>
                    <p className="text-gray-700">Share your child&apos;s favorite stories with friends and family</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl shadow-lg p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">📞 Contact Us</h2>
              <p className="mb-8 text-xl opacity-90 max-w-2xl mx-auto">
                We value your input and are always looking to improve our platform. If you have any questions,
                suggestions, or concerns, please don&apos;t hesitate to reach out to us.
              </p>
              <div className="flex flex-col md:flex-row justify-center gap-6">
                <a
                  href="mailto:contact@bixforge.com"
                  className="bg-white text-purple-600 px-8 py-4 rounded-xl text-center hover:bg-gray-100 transition-all duration-300 font-bold text-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>📧</span>
                  <span>Email Us</span>
                </a>
                <a
                  href="#"
                  className="bg-white/20 text-white px-8 py-4 rounded-xl text-center hover:bg-white/30 transition-all duration-300 font-bold text-lg transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>📝</span>
                  <span>Feedback Form</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
