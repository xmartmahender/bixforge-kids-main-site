'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UserTracker from '../components/UserTracker';
import FamiliesHero from '../components/FamiliesHero';
import {
  FaHome,
  FaChild,
  FaShieldAlt,
  FaChartLine,
  FaClock,
  FaAward,
  FaBookOpen,
  FaUserFriends,
  FaStar,
  FaLock,
  FaEye,
  FaDownload,
  FaGamepad
} from 'react-icons/fa';

export default function FamiliesPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);
  const [, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    totalReadingTime: 245, // minutes today
    booksCompleted: 3,
    activeChildren: 2,
    safetyScore: 100
  });

  useEffect(() => {
    setMounted(true);

    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time updates
    const statsInterval = setInterval(() => {
      setLiveStats(prev => ({
        totalReadingTime: Math.min(360, prev.totalReadingTime + Math.floor(Math.random() * 3)),
        booksCompleted: prev.booksCompleted + (Math.random() > 0.9 ? 1 : 0),
        activeChildren: Math.random() > 0.7 ? (prev.activeChildren === 2 ? 1 : 2) : prev.activeChildren,
        safetyScore: 100 // Always maintain 100% safety
      }));
    }, 15000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserTracker ageGroup="3-6" contentType="general" />
        <Header />
        <div className="pt-20">
          <FamiliesHero />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const children = [
    {
      id: 1,
      name: 'Emma',
      age: 7,
      grade: '2nd',
      readingLevel: 'Advanced',
      booksRead: 15,
      timeSpent: '2h 30m',
      favoriteGenre: 'Adventure',
      currentActivity: 'Reading "The Magic Garden"',
      status: 'online',
      lastSeen: 'Now'
    },
    {
      id: 2,
      name: 'Liam',
      age: 5,
      grade: 'K',
      readingLevel: 'Beginner',
      booksRead: 8,
      timeSpent: '1h 45m',
      favoriteGenre: 'Animals',
      currentActivity: 'Completed coding puzzle',
      status: 'online',
      lastSeen: '5 min ago'
    }
  ];

  const familyActivities = [
    {
      id: 1,
      title: 'Family Story Time',
      type: 'reading',
      duration: '30 min',
      participants: 2,
      lastCompleted: 'Yesterday',
      difficulty: 'Easy'
    },
    {
      id: 2,
      title: 'Coding Adventure',
      type: 'coding',
      duration: '45 min',
      participants: 1,
      lastCompleted: '3 days ago',
      difficulty: 'Medium'
    },
    {
      id: 3,
      title: 'Math Games',
      type: 'math',
      duration: '20 min',
      participants: 2,
      lastCompleted: 'Today',
      difficulty: 'Easy'
    }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Family Dashboard', icon: FaHome },
    { id: 'children', label: 'My Children', icon: FaChild },
    { id: 'safety', label: 'Safety & Controls', icon: FaShieldAlt },
    { id: 'activities', label: 'Family Activities', icon: FaUserFriends },
    { id: 'progress', label: 'Progress Reports', icon: FaChartLine }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserTracker ageGroup="3-6" contentType="general" />
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <FamiliesHero />

        {/* Navigation Tabs */}
        <div className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-6 py-4 font-medium transition-colors whitespace-nowrap
                      ${activeTab === tab.id
                        ? 'text-pink-600 border-b-2 border-pink-600'
                        : 'text-gray-600 hover:text-pink-600'
                      }
                    `}
                  >
                    <IconComponent className="text-lg" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Family Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Quick Stats - Real-time */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Children</p>
                      <p className="text-3xl font-bold text-pink-600">{liveStats.activeChildren}</p>
                      <p className="text-xs text-green-600 mt-1">
                        {liveStats.activeChildren === 2 ? 'Both online' : '1 online'}
                      </p>
                    </div>
                    <FaChild className="text-3xl text-pink-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Books Completed Today</p>
                      <p className="text-3xl font-bold text-green-600">{liveStats.booksCompleted}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        2 in progress
                      </p>
                    </div>
                    <FaBookOpen className="text-3xl text-green-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Learning Time Today</p>
                      <p className="text-3xl font-bold text-blue-600">
                        {Math.floor(liveStats.totalReadingTime / 60)}h {liveStats.totalReadingTime % 60}m
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        +3 min this hour
                      </p>
                    </div>
                    <FaClock className="text-3xl text-blue-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Safety Score</p>
                      <p className="text-3xl font-bold text-purple-600">{liveStats.safetyScore}%</p>
                      <p className="text-xs text-green-600 mt-1">All protections active</p>
                    </div>
                    <FaAward className="text-3xl text-purple-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Children Overview */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Children&apos;s Progress Today</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {children.map((child) => (
                    <div key={child.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold">
                            {child.name[0]}
                          </div>
                          <div>
                            <h4 className="font-bold">{child.name}</h4>
                            <p className="text-sm text-gray-600">Age {child.age} • {child.grade} Grade</p>
                          </div>
                        </div>
                        <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          {child.readingLevel}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Books Read:</span>
                          <span className="font-semibold ml-1">{child.booksRead}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Time Spent:</span>
                          <span className="font-semibold ml-1">{child.timeSpent}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Activities */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Recommended Family Activities</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <FaBookOpen className="text-blue-500 text-xl mr-3" />
                      <h4 className="font-bold">Bedtime Stories</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Perfect for winding down with age-appropriate tales.</p>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      Start Reading →
                    </button>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <FaGamepad className="text-green-500 text-xl mr-3" />
                      <h4 className="font-bold">Coding Games</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Fun coding challenges for the whole family.</p>
                    <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                      Play Together →
                    </button>
                  </div>

                  <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-3">
                      <FaStar className="text-yellow-500 text-xl mr-3" />
                      <h4 className="font-bold">Achievement Review</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Celebrate your children&apos;s learning milestones.</p>
                    <button className="text-yellow-600 hover:text-yellow-700 font-medium text-sm">
                      View Achievements →
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Recent Family Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <FaBookOpen className="text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">Emma completed &quot;The Magic Garden&quot;</p>
                      <p className="text-sm text-gray-600">30 minutes ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <FaAward className="text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Liam earned &quot;First Steps in Coding&quot; badge</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <FaUserFriends className="text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium">Family completed &quot;Math Adventure&quot; together</p>
                      <p className="text-sm text-gray-600">Yesterday</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* My Children Tab */}
          {activeTab === 'children' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Children</h2>
                <button className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors">
                  Add Child Profile
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div key={child.id} className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                          {child.name[0]}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold">{child.name}</h3>
                          <p className="text-gray-600">Age {child.age} • {child.grade} Grade</p>
                          <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mt-1">
                            {child.readingLevel} Reader
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{child.booksRead}</div>
                        <div className="text-sm text-gray-600">Books Read</div>
                      </div>
                      <div className="text-center p-3 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{child.timeSpent}</div>
                        <div className="text-sm text-gray-600">Time Spent</div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-gray-600 mb-1">Favorite Genre:</p>
                      <p className="font-semibold text-purple-600">{child.favoriteGenre}</p>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors">
                        View Progress
                      </button>
                      <button className="flex-1 border border-pink-600 text-pink-600 py-2 rounded-lg hover:bg-pink-50 transition-colors">
                        Settings
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Safety & Controls Tab */}
          {activeTab === 'safety' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Safety & Parental Controls</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaShieldAlt className="text-2xl text-green-500 mr-3" />
                    <h3 className="text-xl font-bold">Content Filtering</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Age-Appropriate Content Only</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Block External Links</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Safe Search Mode</span>
                      <div className="w-12 h-6 bg-green-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaClock className="text-2xl text-blue-500 mr-3" />
                    <h3 className="text-xl font-bold">Time Management</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Daily Screen Time Limit</label>
                      <select className="w-full p-2 border rounded-lg">
                        <option>2 hours</option>
                        <option>3 hours</option>
                        <option>4 hours</option>
                        <option>No limit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bedtime Restrictions</label>
                      <div className="flex space-x-2">
                        <input type="time" value="20:00" className="flex-1 p-2 border rounded-lg" />
                        <span className="flex items-center">to</span>
                        <input type="time" value="07:00" className="flex-1 p-2 border rounded-lg" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaEye className="text-2xl text-purple-500 mr-3" />
                    <h3 className="text-xl font-bold">Activity Monitoring</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Real-time Activity Alerts</span>
                      <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Weekly Progress Reports</span>
                      <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Achievement Notifications</span>
                      <div className="w-12 h-6 bg-purple-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaLock className="text-2xl text-red-500 mr-3" />
                    <h3 className="text-xl font-bold">Privacy Settings</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Private Profile Mode</span>
                      <div className="w-12 h-6 bg-red-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Data Collection Opt-out</span>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute left-0.5 top-0.5"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Anonymous Usage Stats</span>
                      <div className="w-12 h-6 bg-red-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Family Activities Tab */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Family Activities</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Create Activity
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaBookOpen className="text-2xl text-blue-500 mr-3" />
                    <h3 className="text-xl font-bold">Reading Together</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Shared reading experiences that bring families closer while learning.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Recommended Age:</span>
                      <span className="font-semibold">3-8 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-semibold">15-30 minutes</span>
                    </div>
                  </div>
                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Start Reading Session
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaGamepad className="text-2xl text-green-500 mr-3" />
                    <h3 className="text-xl font-bold">Coding Challenges</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Fun coding puzzles and games that parents and children can solve together.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Recommended Age:</span>
                      <span className="font-semibold">6-12 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-semibold">20-45 minutes</span>
                    </div>
                  </div>
                  <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors">
                    Start Coding Challenge
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaStar className="text-2xl text-yellow-500 mr-3" />
                    <h3 className="text-xl font-bold">Creative Writing</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Collaborative storytelling activities to spark imagination and creativity.</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span>Recommended Age:</span>
                      <span className="font-semibold">5-10 years</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Duration:</span>
                      <span className="font-semibold">30-60 minutes</span>
                    </div>
                  </div>
                  <button className="w-full bg-yellow-600 text-white py-2 rounded-lg hover:bg-yellow-700 transition-colors">
                    Start Writing Together
                  </button>
                </div>
              </div>

              {/* Recent Family Activities */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Recent Family Activities</h3>
                <div className="space-y-4">
                  {familyActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          activity.type === 'reading' ? 'bg-blue-100 text-blue-600' :
                          activity.type === 'coding' ? 'bg-green-100 text-green-600' :
                          'bg-purple-100 text-purple-600'
                        }`}>
                          {activity.type === 'reading' ? <FaBookOpen /> :
                           activity.type === 'coding' ? <FaGamepad /> :
                           <FaStar />}
                        </div>
                        <div>
                          <h4 className="font-semibold">{activity.title}</h4>
                          <p className="text-sm text-gray-600">{activity.duration} • {activity.participants} participants</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Repeat Activity
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Progress Reports Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Progress Reports</h2>
                <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2">
                  <FaDownload />
                  <span>Download Report</span>
                </button>
              </div>

              {/* Overall Family Progress */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Family Learning Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">156</div>
                    <div className="text-gray-600">Total Books Read</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">42h</div>
                    <div className="text-gray-600">Learning Time</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">28</div>
                    <div className="text-gray-600">Achievements Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600">15</div>
                    <div className="text-gray-600">Family Activities</div>
                  </div>
                </div>
              </div>

              {/* Individual Child Progress */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div key={child.id} className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                        {child.name[0]}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">{child.name}&apos;s Progress</h3>
                        <p className="text-gray-600">This Week</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Reading Progress</span>
                          <span className="text-sm text-gray-600">85%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Math Skills</span>
                          <span className="text-sm text-gray-600">72%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{width: '72%'}}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Coding Basics</span>
                          <span className="text-sm text-gray-600">68%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{width: '68%'}}></div>
                        </div>
                      </div>
                    </div>

                    <button className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      View Detailed Report
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
