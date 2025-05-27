'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import StoriesList from '../../components/StoriesList';
import VideosList from '../../components/VideosList';
import UserTracker from '../../components/UserTracker';
import Link from 'next/link';

export default function AgeGroupPage({ params }: { params: Promise<{ ageGroup: string }> }) {
  const [ageGroup, setAgeGroup] = React.useState<string>('');

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setAgeGroup(resolvedParams.ageGroup);
    });
  }, [params]);

  // Function to get a readable age group title
  const getAgeGroupTitle = (ageGroup: string) => {
    switch(ageGroup) {
      case '0-3':
        return 'Toddlers (0-3 years)';
      case '3-6':
        return 'Preschoolers (3-6 years)';
      case '6-9':
        return 'Early Elementary (6-9 years)';
      case '9-12':
        return 'Pre-Teens (9-12 years)';
      default:
        return 'All Ages';
    }
  };

  const getAgeGroupIcon = (ageGroup: string) => {
    switch(ageGroup) {
      case '0-3': return '👶';
      case '3-6': return '🧒';
      case '6-9': return '👦';
      case '9-12': return '👧';
      default: return '👶';
    }
  };

  if (!ageGroup) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <UserTracker ageGroup={ageGroup as '0-3' | '3-6' | '6-9' | '9-12'} contentType="general" />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">{getAgeGroupIcon(ageGroup)}</span>
              <h1 className="text-4xl md:text-5xl font-bold">{getAgeGroupTitle(ageGroup)}</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Stories and videos specially selected for children aged {ageGroup} years
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Age-appropriate content</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Educational stories</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Interactive videos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Age Group Navigation */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center gap-4 mb-12">
            <Link
              href="/age-groups/0-3"
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                ageGroup === '0-3'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-md'
              }`}
            >
              👶 0-3 years
            </Link>
            <Link
              href="/age-groups/3-6"
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                ageGroup === '3-6'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-md'
              }`}
            >
              🧒 3-6 years
            </Link>
            <Link
              href="/age-groups/6-9"
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                ageGroup === '6-9'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-md'
              }`}
            >
              👦 6-9 years
            </Link>
            <Link
              href="/age-groups/9-12"
              className={`px-6 py-3 rounded-xl text-base font-semibold transition-all duration-300 ${
                ageGroup === '9-12'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-purple-50 hover:text-purple-700 shadow-md'
              }`}
            >
              👧 9-12 years
            </Link>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            <StoriesList selectedAgeGroup={ageGroup} showAdminContent={true} />
            <VideosList selectedAgeGroup={ageGroup} showAdminContent={true} />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
