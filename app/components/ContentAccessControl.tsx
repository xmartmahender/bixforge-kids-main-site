'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FaLock, FaCrown, FaTimes, FaCheck, FaStar,
  FaVideo, FaBook, FaCode
} from 'react-icons/fa';
import {
  checkUserAccess,
  getSubscriptionPackages,
  SubscriptionPackage
} from '../../lib/subscriptionService';

interface ContentAccessControlProps {
  contentType: 'stories' | 'videos' | 'codeStories' | 'codeVideos' | 'poems' | 'blog' | 'codePlayground';
  ageGroup?: string;
  children: React.ReactNode;
  fallbackContent?: React.ReactNode;
}

export default function ContentAccessControl({
  contentType,
  ageGroup,
  children,
  fallbackContent
}: ContentAccessControlProps) {
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);

  const checkAccess = useCallback(async () => {
    setLoading(true);
    try {
      // Get user ID from localStorage (in a real app, this would come from authentication)
      const userId = localStorage.getItem('user_id');

      if (!userId) {
        // No user logged in, show free content only
        setHasAccess(contentType === 'stories' || contentType === 'poems' || contentType === 'blog');
      } else {
        const access = await checkUserAccess(userId, contentType, ageGroup);
        setHasAccess(access);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      // Default to basic access on error
      setHasAccess(contentType === 'stories' || contentType === 'poems' || contentType === 'blog');
    } finally {
      setLoading(false);
    }
  }, [contentType, ageGroup]);

  useEffect(() => {
    checkAccess();
  }, [checkAccess]);

  const loadPackages = async () => {
    try {
      const packagesData = await getSubscriptionPackages();
      setPackages(packagesData);
    } catch (error) {
      console.error('Error loading packages:', error);
    }
  };

  const handleUpgradeClick = async () => {
    await loadPackages();
    setShowUpgradeModal(true);
  };

  const getContentTypeInfo = () => {
    const contentInfo = {
      stories: { icon: FaBook, label: 'Stories', color: 'text-blue-600' },
      videos: { icon: FaVideo, label: 'Videos', color: 'text-red-600' },
      codeStories: { icon: FaCode, label: 'Code Stories', color: 'text-purple-600' },
      codeVideos: { icon: FaCode, label: 'Code Videos', color: 'text-green-600' },
      poems: { icon: FaStar, label: 'Poems', color: 'text-yellow-600' },
      blog: { icon: FaBook, label: 'Blog', color: 'text-gray-600' },
      codePlayground: { icon: FaCode, label: 'Code Playground', color: 'text-indigo-600' }
    };

    return contentInfo[contentType] || contentInfo.stories;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (hasAccess) {
    return <>{children}</>;
  }

  // Show access denied content
  const contentInfo = getContentTypeInfo();
  const Icon = contentInfo.icon;

  return (
    <>
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
        <div className="mb-6">
          <div className="bg-white rounded-full p-4 w-20 h-20 mx-auto mb-4 shadow-lg">
            <FaLock className="text-3xl text-gray-400 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Premium Content</h3>
          <p className="text-gray-600">
            This {contentInfo.label.toLowerCase()} content requires a subscription to access.
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-center mb-4">
            <Icon className={`text-2xl ${contentInfo.color} mr-2`} />
            <span className="font-semibold text-gray-800">{contentInfo.label}</span>
            {ageGroup && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                Ages {ageGroup}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600">
            Unlock access to premium {contentInfo.label.toLowerCase()} and much more with a subscription.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleUpgradeClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center mx-auto font-semibold"
          >
            <FaCrown className="mr-2" />
            Upgrade Now
          </button>

          <p className="text-xs text-gray-500">
            Start with our free plan or choose a premium subscription
          </p>
        </div>

        {fallbackContent && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h4 className="font-semibold text-gray-700 mb-4">Free Content Available:</h4>
            {fallbackContent}
          </div>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <UpgradeModal
          packages={packages}
          contentType={contentType}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  );
}

// Upgrade Modal Component
interface UpgradeModalProps {
  packages: SubscriptionPackage[];
  contentType: string;
  onClose: () => void;
}

function UpgradeModal({ packages, contentType, onClose }: UpgradeModalProps) {
  const getRelevantPackages = () => {
    return packages.filter(pkg => {
      const contentAccess = pkg.contentAccess[contentType as keyof typeof pkg.contentAccess];
      return contentAccess;
    });
  };

  const relevantPackages = getRelevantPackages();

  const getAccessLevelBadge = (level: string) => {
    const levelConfig = {
      'basic': { color: 'bg-gray-200 text-gray-700', icon: '🌱' },
      'premium': { color: 'bg-blue-200 text-blue-700', icon: '⭐' },
      'pro': { color: 'bg-purple-200 text-purple-700', icon: '💎' },
      'unlimited': { color: 'bg-yellow-200 text-yellow-700', icon: '👑' }
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.basic;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {level.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaCrown className="text-2xl text-yellow-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-800">Choose Your Plan</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <p className="text-gray-600 mb-8 text-center">
          Unlock premium content and features with one of our subscription plans
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relevantPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`border rounded-lg p-6 transition-all duration-300 hover:shadow-lg ${
                pkg.accessLevel === 'premium'
                  ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {pkg.accessLevel === 'premium' && (
                <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
              )}

              <div className="mb-4">
                <h4 className="text-xl font-bold text-gray-800">{pkg.name}</h4>
                <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
              </div>

              <div className="mb-4">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-green-600">
                    ${pkg.price}
                  </span>
                  <span className="text-gray-500 ml-2">
                    /{pkg.duration} days
                  </span>
                </div>
                {pkg.price === 0 && (
                  <span className="text-green-600 text-sm font-medium">FREE FOREVER</span>
                )}
              </div>

              <div className="mb-6">
                {getAccessLevelBadge(pkg.accessLevel)}
              </div>

              <div className="mb-6">
                <h5 className="font-semibold text-gray-700 mb-3">Features:</h5>
                <ul className="space-y-2">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Downloads:</span>
                  <span>{pkg.maxDownloads === -1 ? 'Unlimited' : pkg.maxDownloads}</span>
                </div>
                <div className="flex justify-between">
                  <span>Support:</span>
                  <span className="capitalize">{pkg.supportLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age Groups:</span>
                  <span>{pkg.ageGroupAccess.join(', ')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  // In a real app, this would redirect to payment
                  alert(`Redirecting to payment for ${pkg.name}...`);
                }}
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                  pkg.price === 0
                    ? 'bg-gray-600 text-white hover:bg-gray-700'
                    : pkg.accessLevel === 'premium'
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-purple-600 text-white hover:bg-purple-700'
                }`}
              >
                {pkg.price === 0 ? 'Get Started Free' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>All plans include a 7-day free trial. Cancel anytime.</p>
          <p className="mt-2">
            Questions? <a href="/contact" className="text-blue-600 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
