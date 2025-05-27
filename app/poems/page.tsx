'use client';

import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';
import NewsletterSubscription from '../components/NewsletterSubscription';

export default function PoemsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('all');

  // Sample poems data
  const poems = [
    {
      id: 1,
      title: "The Rainbow's Promise",
      content: `Red and orange, yellow bright,
Green and blue in morning light,
Indigo and violet too,
Rainbow colors, just for you!

After rain comes sunshine clear,
Washing away each little tear,
Look up high and you will see,
Colors dancing, wild and free!`,
      category: "nature",
      ageGroup: "3-6",
      author: "Miss Emily",
      theme: "Colors & Weather",
      illustration: "https://placehold.co/300x200/rainbow/white?text=Rainbow"
    },
    {
      id: 2,
      title: "My Robot Friend",
      content: `Beep beep boop, my robot friend,
With circuits that never bend,
He helps me learn to count and read,
A digital friend indeed!

His screen lights up with colors bright,
Teaching me both day and night,
Programming fun for you and me,
Technology sets us free!`,
      category: "technology",
      ageGroup: "6-9",
      author: "Mr. Tech",
      theme: "Coding & Robots",
      illustration: "https://placehold.co/300x200/blue/white?text=Robot+Friend"
    },
    {
      id: 3,
      title: "Counting Sheep",
      content: `One little sheep jumps over the fence,
Two little sheep, the night grows dense,
Three little sheep with woolly white,
Four little sheep in pale moonlight.

Five little sheep, six, seven, eight,
Nine little sheep, it's getting late,
Ten little sheep all in a row,
Close your eyes and off you go!`,
      category: "bedtime",
      ageGroup: "0-3",
      author: "Grandma Rose",
      theme: "Numbers & Sleep",
      illustration: "https://placehold.co/300x200/purple/white?text=Counting+Sheep"
    },
    {
      id: 4,
      title: "The Alphabet Adventure",
      content: `A is for Apple, red and round,
B is for Ball that bounces around,
C is for Cat with whiskers so fine,
D is for Dog, a friend of mine.

E is for Elephant, big and gray,
F is for Fish that swim and play,
Learning letters is such fun,
From A to Z, we've just begun!`,
      category: "educational",
      ageGroup: "3-6",
      author: "Teacher Jane",
      theme: "Letters & Learning",
      illustration: "https://placehold.co/300x200/green/white?text=ABC+Adventure"
    },
    {
      id: 5,
      title: "The Brave Little Coder",
      content: `With keyboard clicking, mouse in hand,
I code and build throughout the land,
Variables dancing, functions too,
Creating magic, me and you.

If-then statements, loops that spin,
Debugging errors with a grin,
Young programmers, brave and bright,
Coding dreams from day to night!`,
      category: "technology",
      ageGroup: "9-12",
      author: "Code Master Sam",
      theme: "Programming & Dreams",
      illustration: "https://placehold.co/300x200/orange/white?text=Young+Coder"
    },
    {
      id: 6,
      title: "Friendship Garden",
      content: `In the garden of my heart,
Friendship flowers have their start,
Kindness blooms in every row,
Helping friendships grow and grow.

Sharing toys and sharing smiles,
Walking together many miles,
Friends are treasures, friends are gold,
Stories that will never get old.`,
      category: "friendship",
      ageGroup: "6-9",
      author: "Miss Sunshine",
      theme: "Friendship & Kindness",
      illustration: "https://placehold.co/300x200/pink/white?text=Friendship+Garden"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Performances', icon: '🎪' },
    { id: 'nature', name: 'Nature Theater', icon: '🌈' },
    { id: 'technology', name: 'Tech Drama', icon: '🤖' },
    { id: 'bedtime', name: 'Bedtime Stories', icon: '🌙' },
    { id: 'educational', name: 'Learning Stage', icon: '🎓' },
    { id: 'friendship', name: 'Friendship Tales', icon: '🎭' }
  ];

  const ageGroups = [
    { id: 'all', name: 'All Ages' },
    { id: '0-3', name: '0-3 Years' },
    { id: '3-6', name: '3-6 Years' },
    { id: '6-9', name: '6-9 Years' },
    { id: '9-12', name: '9-12 Years' }
  ];

  const filteredPoems = poems.filter(poem => {
    const categoryMatch = selectedCategory === 'all' || poem.category === selectedCategory;
    const ageMatch = selectedAgeGroup === 'all' || poem.ageGroup === selectedAgeGroup;
    return categoryMatch && ageMatch;
  });

  return (
    <div>
      <UserTracker contentType="general" contentId={`${selectedCategory}-${selectedAgeGroup}`} />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🎪</span>
              <h1 className="text-4xl md:text-5xl font-bold">Poetry Theater</h1>
              <span className="text-4xl ml-3">🎭</span>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Beautiful poems and theatrical performances to inspire imagination, learning, and joy
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Creative poetry</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Age-appropriate content</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Educational themes</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">

          {/* Filters */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Category Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Choose a Theme:</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-3 rounded-lg text-left transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-purple-50 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Age Group Filter */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Age Group:</h3>
                <div className="space-y-2">
                  {ageGroups.map(ageGroup => (
                    <button
                      key={ageGroup.id}
                      onClick={() => setSelectedAgeGroup(ageGroup.id)}
                      className={`w-full p-3 rounded-lg text-left transition-colors ${
                        selectedAgeGroup === ageGroup.id
                          ? 'bg-blue-100 text-blue-700 border-2 border-blue-300'
                          : 'bg-gray-50 text-gray-700 hover:bg-blue-50 border-2 border-transparent'
                      }`}
                    >
                      {ageGroup.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-purple-700">
              {selectedCategory === 'all' ? 'All Poems' : categories.find(c => c.id === selectedCategory)?.name + ' Poems'}
              {selectedAgeGroup !== 'all' && ` (${selectedAgeGroup} years)`}
            </h2>
            <span className="text-gray-500 text-sm">
              {filteredPoems.length} poem{filteredPoems.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {/* Poems Grid */}
          {filteredPoems.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No poems found</h3>
              <p className="text-gray-500">Try selecting different filters to find poems.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPoems.map(poem => (
                <div key={poem.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-200 hover:border-purple-300">
                  <div className="relative h-48">
                    <img
                      src={poem.illustration}
                      alt={poem.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-purple-700">
                      {poem.ageGroup}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold text-purple-800">{poem.title}</h3>
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                        {poem.theme}
                      </span>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg mb-4">
                      <pre className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap font-serif">
                        {poem.content}
                      </pre>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>By {poem.author}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">
                          {categories.find(c => c.id === poem.category)?.icon}
                        </span>
                        <span>{categories.find(c => c.id === poem.category)?.name}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Newsletter Subscription */}
          <div className="mt-12">
            <NewsletterSubscription />
          </div>

          {/* Call to Action */}
          <div className="mt-12 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Love Reading Poems?</h3>
            <p className="text-lg mb-6">
              Explore our collection of interactive stories and educational videos too!
            </p>
            <div className="space-x-4">
              <Link
                href="/stories"
                className="inline-block bg-white text-purple-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors"
              >
                Read Stories
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
      </div>
      <Footer />
    </div>
  );
}
