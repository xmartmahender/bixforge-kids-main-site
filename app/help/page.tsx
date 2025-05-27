'use client';

import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';

export default function HelpPage() {
  return (
    <div>
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Help <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">Center</span>
              </h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Find answers to common questions and get help using Kidz Zone.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Getting Started</h3>
                <p className="text-gray-600 mb-4">
                  New to Kidz Zone? Learn how to navigate our platform and find the best content for your child.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Browse content by age group</li>
                  <li>• Use the search feature</li>
                  <li>• Create a safe learning environment</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-4">👨‍👩‍👧‍👦</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">For Parents</h3>
                <p className="text-gray-600 mb-4">
                  Learn how to monitor your child&apos;s learning progress and ensure a safe online experience.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Set up parental controls</li>
                  <li>• Monitor screen time</li>
                  <li>• Track learning progress</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-4">🎓</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">For Educators</h3>
                <p className="text-gray-600 mb-4">
                  Discover how to integrate Kidz Zone content into your classroom curriculum.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Access educator resources</li>
                  <li>• Create lesson plans</li>
                  <li>• Track student progress</li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="text-3xl mb-4">🔧</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">Technical Support</h3>
                <p className="text-gray-600 mb-4">
                  Having technical issues? Find solutions to common problems here.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Video playback issues</li>
                  <li>• Browser compatibility</li>
                  <li>• Account management</li>
                </ul>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Is Kidz Zone free to use?</h3>
                  <p className="text-gray-600">
                    Yes! Kidz Zone offers free access to educational content designed for children of all ages.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">What age groups is the content suitable for?</h3>
                  <p className="text-gray-600">
                    Our content is organized by age groups: 0-3, 3-6, 6-9, and 9-12 years old, ensuring age-appropriate learning experiences.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">How do I report inappropriate content?</h3>
                  <p className="text-gray-600">
                    If you encounter any content that seems inappropriate, please contact us immediately at hello@kidzzone.com
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Can I use this content in my classroom?</h3>
                  <p className="text-gray-600">
                    Yes! Educators are welcome to use our content for educational purposes. Visit our Educators page for more resources.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-xl text-white p-8 text-center mt-8">
              <h2 className="text-2xl font-bold mb-4">Still Need Help?</h2>
              <p className="text-lg mb-6">
                Can&apos;t find what you&apos;re looking for? Our support team is here to help!
              </p>
              <a
                href="/contact"
                className="inline-block bg-white text-green-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
