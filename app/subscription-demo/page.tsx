'use client';

import React, { useState } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import ContentAccessControl from '../components/ContentAccessControl';
import { FeedbackButton } from '../components/FeedbackForm';
import {
  FaCrown, FaVideo, FaBook, FaCode, FaStar,
  FaUsers, FaCheck
} from 'react-icons/fa';

export default function SubscriptionDemoPage() {
  const [selectedDemo, setSelectedDemo] = useState<'stories' | 'videos' | 'codeStories' | 'codeVideos' | 'poems'>('stories');

  const demoContent = {
    stories: {
      title: "The Magic Forest Adventure",
      description: "Join Luna on her magical journey through an enchanted forest where she meets talking animals and learns about friendship.",
      content: `Once upon a time, in a magical forest far away, there lived a young girl named Luna. She had sparkling blue eyes and hair as golden as sunlight.

One sunny morning, Luna decided to explore the deepest part of the forest that she had never visited before. As she walked along the winding path, she heard a soft voice calling for help.

"Help! Help!" squeaked a tiny voice.

Luna looked around and saw a small rabbit caught under a fallen branch. Without hesitation, she carefully lifted the branch and freed the little rabbit.

"Thank you so much!" said the rabbit, much to Luna's surprise. "I'm Pip, and you've just saved my life!"

Luna couldn't believe her ears - the rabbit was talking! But instead of being scared, she felt excited and curious.

"I'm Luna," she replied with a smile. "I've never met a talking rabbit before!"

Pip laughed, a sound like tiny silver bells. "In this part of the forest, all animals can talk. We've been waiting for someone kind like you to visit us!"

And so began Luna's greatest adventure, where she learned that kindness and friendship are the most powerful magic of all.`,
      ageGroup: "3-6"
    },
    videos: {
      title: "Learning Colors with Rainbow Friends",
      description: "An educational video where colorful characters teach children about primary and secondary colors through fun songs and activities.",
      content: "This premium video content teaches children about colors through interactive storytelling and memorable songs.",
      ageGroup: "0-3"
    },
    codeStories: {
      title: "HTML Adventure: Building Your First Webpage",
      description: "Learn HTML basics by helping Tommy create his first website about his pet hamster.",
      content: `Tommy was excited to create his very first website! He wanted to tell the world about his pet hamster, Whiskers.

"Where do I start?" Tommy wondered.

His teacher, Ms. Code, smiled and said, "Every webpage starts with HTML - HyperText Markup Language. Think of it as the skeleton of your website!"

Tommy learned that HTML uses special tags that look like this:
<h1>This is a big heading!</h1>
<p>This is a paragraph of text.</p>

"The tags are like containers," explained Ms. Code. "They tell the browser how to display your content."

Tommy started typing:
<h1>Welcome to Whiskers' World!</h1>
<p>Whiskers is my pet hamster. He loves running on his wheel and eating sunflower seeds.</p>

"Wow!" Tommy exclaimed as he saw his webpage come to life. "HTML is like magic!"

And that's how Tommy began his coding journey, one tag at a time.`,
      ageGroup: "6-9",
      programmingLanguage: "html"
    },
    codeVideos: {
      title: "Python for Kids: Making a Simple Calculator",
      description: "Learn Python programming by creating a fun calculator that can add, subtract, multiply, and divide numbers.",
      content: "This premium coding video teaches children Python programming through building a simple calculator application.",
      ageGroup: "9-12",
      programmingLanguage: "python"
    },
    poems: {
      title: "The Dancing Stars",
      description: "A beautiful poem about stars that dance in the night sky and the dreams they inspire.",
      content: `High above in the velvet night,
The stars begin their dance so bright.
They twirl and spin with graceful ease,
Like dancers swaying in the breeze.

Each star a story, each one a dream,
They sparkle with a silver gleam.
The moon conducts this cosmic show,
While children sleep in beds below.

So when you see the stars at night,
Remember they're dancing just for you,
Spreading magic, spreading light,
Making all your dreams come true.`,
      ageGroup: "3-6"
    }
  };

  const currentContent = demoContent[selectedDemo];

  const demoTabs = [
    { id: 'stories', label: 'Stories', icon: FaBook, color: 'text-blue-600' },
    { id: 'videos', label: 'Videos', icon: FaVideo, color: 'text-red-600' },
    { id: 'codeStories', label: 'Code Stories', icon: FaCode, color: 'text-purple-600' },
    { id: 'codeVideos', label: 'Code Videos', icon: FaCode, color: 'text-green-600' },
    { id: 'poems', label: 'Poems', icon: FaStar, color: 'text-yellow-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FaCrown className="text-4xl text-yellow-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-800">Subscription System Demo</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience our comprehensive subscription management system with content access control,
            user feedback collection, and admin management features.
          </p>
        </div>

        {/* Demo Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Try Different Content Types</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {demoTabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedDemo(tab.id as 'stories' | 'videos' | 'codeStories' | 'codeVideos' | 'poems')}
                  className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedDemo === tab.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Icon className={`text-2xl mb-2 mx-auto ${tab.color}`} />
                  <div className="text-sm font-medium text-gray-800">{tab.label}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Access Control Demo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Content Access Control</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Content Type:</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {demoTabs.find(tab => tab.id === selectedDemo)?.label}
              </span>
            </div>
          </div>

          <ContentAccessControl
            contentType={selectedDemo}
            ageGroup={currentContent.ageGroup}
            fallbackContent={
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-700 mb-2">Free Preview Available:</h4>
                <p className="text-gray-600 text-sm">
                  {currentContent.description}
                </p>
              </div>
            }
          >
            {/* Premium Content */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-800">{currentContent.title}</h3>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  ✅ Access Granted
                </span>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800">{currentContent.description}</p>
              </div>

              <div className="prose max-w-none">
                {currentContent.content.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4 text-gray-700 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* Feedback Button */}
              <div className="flex justify-center pt-6 border-t border-gray-200">
                <FeedbackButton
                  contentId={`demo-${selectedDemo}`}
                  contentType={selectedDemo === 'codeStories' ? 'code-story' :
                             selectedDemo === 'codeVideos' ? 'code-video' :
                             selectedDemo as 'story' | 'video' | 'poem'}
                  contentTitle={currentContent.title}
                />
              </div>
            </div>
          </ContentAccessControl>
        </div>

        {/* Features Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaUsers className="text-2xl text-blue-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">User Management</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                View and edit user accounts
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Assign subscription packages
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Track user activity and usage
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Manage user status and permissions
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaCrown className="text-2xl text-yellow-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Subscription Packages</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Create custom packages
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Set content access levels
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Configure pricing and duration
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Age group restrictions
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-4">
              <FaBook className="text-2xl text-purple-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-800">Feedback System</h3>
            </div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Collect user feedback
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Categorize and prioritize
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Track resolution status
              </li>
              <li className="flex items-center">
                <FaCheck className="text-green-500 mr-2" />
                Admin response system
              </li>
            </ul>
          </div>
        </div>

        {/* User Experience Focus */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg shadow-md p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Complete User Experience</h2>
          <p className="text-xl mb-6">
            This demo showcases the user-side features. Admin manages feedback and subscriptions through a separate admin dashboard.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📝 Feedback Collection</h3>
              <p>Users submit feedback through the main site</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔒 Access Control</h3>
              <p>Content access based on subscription levels</p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 Admin Management</h3>
              <p>Admins manage everything through separate dashboard</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
