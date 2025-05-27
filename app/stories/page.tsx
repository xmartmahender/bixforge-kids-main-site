'use client';

import { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import StoriesList from '../components/StoriesList';
import { FeedbackButton } from '../components/FeedbackForm';
import AgeGroupFilter from '../components/AgeGroupFilter';

export default function StoriesPage() {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>('all');

  const handleAgeGroupChange = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              📚 Story Library
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Discover amazing stories that spark imagination, teach valuable lessons, and create magical moments for children of all ages.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-lg">
              <div className="bg-white/20 px-4 py-2 rounded-full">
                ✨ Educational Stories
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                🎭 Adventure Tales
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                💻 Coding Stories
              </div>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                🌟 Bedtime Stories
              </div>
            </div>
          </div>
        </div>

        {/* Age Group Filter */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AgeGroupFilter
            selectedAgeGroup={selectedAgeGroup}
            onAgeGroupChange={handleAgeGroupChange}
          />
        </div>

        {/* Stories List */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <StoriesList selectedAgeGroup={selectedAgeGroup} />
        </div>

        {/* Featured Categories */}
        <div className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Story Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🧚‍♀️</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Fairy Tales</h3>
                <p className="text-gray-600">Classic and modern fairy tales that transport children to magical worlds.</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Adventure</h3>
                <p className="text-gray-600">Exciting adventures that inspire courage and exploration.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Educational</h3>
                <p className="text-gray-600">Fun stories that teach important lessons and skills.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💻</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Coding</h3>
                <p className="text-gray-600">Interactive stories that introduce programming concepts.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Love Our Stories?</h2>
            <p className="text-xl mb-8 opacity-90">
              Share your thoughts and help us create even better stories for children!
            </p>
            <FeedbackButton
              contentId="stories-page"
              contentType="story"
              contentTitle="Stories Library Page"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
