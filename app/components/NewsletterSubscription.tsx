'use client';

import React, { useState } from 'react';
import { FaBell, FaEnvelope, FaGift, FaCheck, FaTimes } from 'react-icons/fa';

interface NewsletterSubscriptionProps {
  className?: string;
}

export default function NewsletterSubscription({ className = '' }: NewsletterSubscriptionProps) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // Simulate API call - replace with actual subscription logic
      await new Promise(resolve => setTimeout(resolve, 1500));

      // For now, just store in localStorage (replace with actual backend)
      const subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
      }

      setIsSubscribed(true);
      setEmail('');
      setShowModal(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  if (isSubscribed && !showModal) {
    return (
      <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white text-center ${className}`}>
        <div className="flex items-center justify-center mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FaCheck className="text-3xl text-white" />
          </div>
        </div>
        <h3 className="text-2xl font-bold mb-2">You&apos;re All Set! 🎉</h3>
        <p className="text-green-100">
          Thank you for subscribing! You&apos;ll be the first to know about new stories, videos, and coding adventures.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden ${className}`}>
        {/* Background decorations */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

        <div className="relative z-10">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-full mr-3">
                <FaBell className="text-3xl text-yellow-300 animate-pulse" />
              </div>
              <div className="bg-white/20 p-4 rounded-full">
                <FaGift className="text-3xl text-pink-300" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-2">Stay Updated! 📚✨</h3>
            <p className="text-lg text-purple-100 mb-4">
              Get notified about new stories, coding adventures, and educational content!
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="bg-white/20 px-3 py-1 rounded-full">🆕 New Stories</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🎥 Fresh Videos</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">💻 Code Tutorials</span>
              <span className="bg-white/20 px-3 py-1 rounded-full">🎪 Poetry Updates</span>
            </div>
          </div>

          <form onSubmit={handleSubscribe} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full pl-12 pr-4 py-4 bg-white/90 backdrop-blur-sm border border-white/20 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-3 text-red-100 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Subscribing...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <FaBell className="mr-2" />
                  Subscribe for Updates
                </div>
              )}
            </button>
          </form>

          <p className="text-xs text-purple-200 text-center mt-4">
            📧 We respect your privacy. Unsubscribe anytime. No spam, just awesome content!
          </p>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center relative">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="mb-6">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FaCheck className="text-3xl text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Welcome Aboard! 🎉</h3>
              <p className="text-gray-600">
                You&apos;ve successfully subscribed to our newsletter. Get ready for amazing content!
              </p>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">What to expect:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>🆕 Weekly new story releases</li>
                <li>🎥 Fresh educational videos</li>
                <li>💻 Coding tutorials and tips</li>
                <li>🎪 Poetry and creative content</li>
                <li>🎁 Exclusive subscriber content</li>
              </ul>
            </div>

            <button
              onClick={closeModal}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
            >
              Start Exploring!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
