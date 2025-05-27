'use client';

import React, { useState, useEffect } from 'react';
import {
  FaHeart,
  FaBookOpen,
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaShieldAlt,
  FaUserFriends
} from 'react-icons/fa';

export default function FamiliesHero() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayReadingTime, setTodayReadingTime] = useState(0);
  const [booksCompleted, setBooksCompleted] = useState(0);
  const [familyStreak] = useState(7);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time data updates
    const dataInterval = setInterval(() => {
      setTodayReadingTime(prev => Math.min(180, prev + Math.floor(Math.random() * 2)));
      if (Math.random() > 0.8) {
        setBooksCompleted(prev => prev + 1);
      }
    }, 8000);

    // Initialize with realistic data
    setTodayReadingTime(45);
    setBooksCompleted(3);

    return () => {
      clearInterval(timeInterval);
      clearInterval(dataInterval);
    };
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    if (hour >= 6 && hour < 9) return 'Perfect time for morning reading!';
    if (hour >= 9 && hour < 12) return 'Learning time is in full swing!';
    if (hour >= 12 && hour < 17) return 'Afternoon adventures await!';
    if (hour >= 17 && hour < 20) return 'Family time - let&apos;s learn together!';
    return 'Bedtime stories are calling!';
  };

  const realTimeStats = [
    {
      icon: FaClock,
      label: 'Reading Time Today',
      value: `${todayReadingTime} min`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: 'Keep it up!',
      target: '60 min goal'
    },
    {
      icon: FaBookOpen,
      label: 'Books Completed',
      value: booksCompleted,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 'This week',
      target: '5 book goal'
    },
    {
      icon: FaStar,
      label: 'Family Streak',
      value: `${familyStreak} days`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: 'Amazing!',
      target: 'Keep going!'
    },
    {
      icon: FaShieldAlt,
      label: 'Safe Learning',
      value: '100%',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: 'Protected',
      target: 'Always secure'
    }
  ];

  const children = [
    { name: 'Emma', age: 7, status: 'Reading "Magic Garden"', avatar: '👧', color: 'bg-pink-100 text-pink-600' },
    { name: 'Liam', age: 5, status: 'Completed coding puzzle', avatar: '👦', color: 'bg-blue-100 text-blue-600' }
  ];

  return (
    <section className="relative bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 text-white py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-400/20 to-purple-400/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"></div>

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-pink-300/10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-purple-400/10 rounded-full animate-ping"></div>

      <div className="relative container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Time and Date Display */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <FaClock className="text-yellow-400 text-xl" />
                <span className="text-2xl font-bold text-yellow-400">{formatTime(currentTime)}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaCalendarAlt className="text-pink-300" />
                <span className="text-pink-200">{formatDate(currentTime)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-pink-200 text-sm">{getTimeBasedMessage()}</p>
              <h2 className="text-2xl font-bold text-yellow-400">{getGreeting()}, Family!</h2>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-white/20 p-4 rounded-full mr-4">
                  <FaHeart className="text-4xl text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Family Learning Hub
                  </h1>
                  <p className="text-xl text-pink-200">
                    Creating magical moments together
                  </p>
                </div>
              </div>

              <p className="text-lg text-pink-100 mb-8 leading-relaxed">
                Watch your children grow and learn in a safe, engaging environment. Track their progress,
                discover new adventures, and create lasting memories through interactive learning experiences.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <button className="bg-yellow-400 text-purple-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2">
                  <FaUserFriends />
                  <span>Start Family Time</span>
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                  Safety Settings
                </button>
              </div>

              {/* Children Status */}
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">Your Children Right Now:</h3>
                {children.map((child, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${child.color}`}>
                      <span className="text-lg">{child.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">{child.name}</span>
                        <span className="text-xs bg-green-400 text-green-900 px-2 py-1 rounded-full">Online</span>
                      </div>
                      <p className="text-sm text-pink-200">{child.status}</p>
                    </div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Real-time Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {realTimeStats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-full ${stat.bgColor}`}>
                        <IconComponent className={`text-xl ${stat.color}`} />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                        </div>
                        <div className="text-xs text-green-300">{stat.change}</div>
                      </div>
                    </div>
                    <div className="text-sm text-pink-200 mb-1">{stat.label}</div>
                    <div className="text-xs text-pink-300">{stat.target}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📚', label: 'Read Together', action: 'Start story time' },
              { icon: '🎮', label: 'Play & Learn', action: 'Educational games' },
              { icon: '📊', label: 'View Progress', action: 'Check achievements' },
              { icon: '🛡️', label: 'Safety Center', action: 'Parental controls' }
            ].map((item, index) => (
              <button
                key={index}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-pink-200 mt-1">{item.action}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
