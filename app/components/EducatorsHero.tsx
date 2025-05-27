'use client';

import React, { useState, useEffect } from 'react';
import { 
  FaChalkboardTeacher, 
  FaUsers, 
  FaChartLine, 
  FaBookOpen, 
  FaPlay,
  FaAward,
  FaClock,
  FaCalendarAlt
} from 'react-icons/fa';

export default function EducatorsHero() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeStudents, setActiveStudents] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(0);

  useEffect(() => {
    // Update time every second
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Simulate real-time data updates
    const dataInterval = setInterval(() => {
      setActiveStudents(prev => Math.max(15, prev + Math.floor(Math.random() * 3) - 1));
      setCompletedLessons(prev => prev + Math.floor(Math.random() * 2));
    }, 5000);

    // Initialize with realistic data
    setActiveStudents(23);
    setCompletedLessons(147);

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

  const realTimeStats = [
    {
      icon: FaUsers,
      label: 'Active Students',
      value: activeStudents,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      change: '+2 since last hour'
    },
    {
      icon: FaBookOpen,
      label: 'Lessons Completed Today',
      value: completedLessons,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      change: '+5 this hour'
    },
    {
      icon: FaAward,
      label: 'Achievements Earned',
      value: 34,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      change: '+3 new badges'
    },
    {
      icon: FaChartLine,
      label: 'Class Average Score',
      value: '87%',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      change: '+2% this week'
    }
  ];

  return (
    <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white py-20 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600"></div>
      
      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-yellow-400/10 rounded-full animate-pulse"></div>
      <div className="absolute top-20 right-20 w-16 h-16 bg-pink-500/10 rounded-full animate-bounce"></div>
      <div className="absolute bottom-10 left-1/4 w-12 h-12 bg-blue-400/10 rounded-full animate-ping"></div>

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
                <FaCalendarAlt className="text-blue-300" />
                <span className="text-blue-200">{formatDate(currentTime)}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-sm">Welcome back!</p>
              <h2 className="text-2xl font-bold text-yellow-400">{getGreeting()}, Educator!</h2>
            </div>
          </div>

          {/* Main Hero Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="flex items-center mb-6">
                <div className="bg-white/20 p-4 rounded-full mr-4">
                  <FaChalkboardTeacher className="text-4xl text-yellow-400" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-2">
                    Educator Dashboard
                  </h1>
                  <p className="text-xl text-blue-200">
                    Empowering minds, one lesson at a time
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                Transform your classroom with interactive learning tools, real-time progress tracking, 
                and engaging content that makes education fun and effective for every student.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-yellow-400 text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-colors flex items-center justify-center space-x-2">
                  <FaPlay />
                  <span>Start Teaching</span>
                </button>
                <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white/10 transition-colors">
                  View Resources
                </button>
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
                    <div className="text-sm text-blue-200">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: '📚', label: 'Create Lesson', action: 'New lesson plan' },
              { icon: '👥', label: 'Manage Classes', action: 'View classrooms' },
              { icon: '📊', label: 'View Reports', action: 'Student progress' },
              { icon: '🎯', label: 'Assessments', action: 'Create quiz' }
            ].map((item, index) => (
              <button
                key={index}
                className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 text-center group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-sm font-semibold text-white">{item.label}</div>
                <div className="text-xs text-blue-200 mt-1">{item.action}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
