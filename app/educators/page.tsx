'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import UserTracker from '../components/UserTracker';
import EducatorsHero from '../components/EducatorsHero';
import Link from 'next/link';
import {
  FaUsers,
  FaChartLine,
  FaBookOpen,
  FaClipboardList,
  FaClock,
  FaAward,
  FaDownload,
  FaShare,
  FaPlay,
  FaUserGraduate,
  FaCalendarAlt,
  FaBullhorn
} from 'react-icons/fa';

export default function EducatorsPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mounted, setMounted] = useState(false);
  const [, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    activeStudents: 67,
    completedAssignments: 23,
    avgClassScore: 87,
    newMessages: 5
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
        activeStudents: Math.max(50, prev.activeStudents + Math.floor(Math.random() * 5) - 2),
        completedAssignments: prev.completedAssignments + Math.floor(Math.random() * 2),
        avgClassScore: Math.min(100, Math.max(75, prev.avgClassScore + Math.floor(Math.random() * 3) - 1)),
        newMessages: prev.newMessages + Math.floor(Math.random() * 2)
      }));
    }, 10000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(statsInterval);
    };
  }, []);

  // Prevent hydration mismatch by not rendering dynamic content until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserTracker ageGroup="6-9" contentType="general" />
        <Header />
        <div className="pt-20">
          <EducatorsHero />
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">Loading...</div>
          </div>
          <Footer />
        </div>
      </div>
    );
  }

  const classrooms = [
    {
      id: 1,
      name: 'Grade 2A - Morning Class',
      students: 25,
      activeReaders: 18,
      lastActivity: '5 min ago',
      currentLesson: 'Reading Comprehension',
      status: 'active'
    },
    {
      id: 2,
      name: 'Grade 3B - Afternoon Class',
      students: 22,
      activeReaders: 20,
      lastActivity: '12 min ago',
      currentLesson: 'Creative Writing',
      status: 'active'
    },
    {
      id: 3,
      name: 'Grade 1C - Early Birds',
      students: 20,
      activeReaders: 15,
      lastActivity: '2 hours ago',
      currentLesson: 'Phonics Practice',
      status: 'completed'
    }
  ];

  const lessonPlans = [
    {
      id: 1,
      title: 'Introduction to Coding',
      grade: '2-3',
      duration: '45 min',
      status: 'ready',
      studentsCompleted: 18,
      totalStudents: 25,
      lastUsed: '2 days ago'
    },
    {
      id: 2,
      title: 'Story Writing Workshop',
      grade: '1-2',
      duration: '30 min',
      status: 'draft',
      studentsCompleted: 0,
      totalStudents: 20,
      lastUsed: 'Never'
    },
    {
      id: 3,
      title: 'Math Through Stories',
      grade: '3-4',
      duration: '60 min',
      status: 'ready',
      studentsCompleted: 22,
      totalStudents: 22,
      lastUsed: 'Today'
    }
  ];

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: FaChartLine },
    { id: 'classrooms', label: 'Classrooms', icon: FaUsers },
    { id: 'lessons', label: 'Lesson Plans', icon: FaClipboardList },
    { id: 'resources', label: 'Resources', icon: FaBookOpen },
    { id: 'assessments', label: 'Assessments', icon: FaAward }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <UserTracker ageGroup="6-9" contentType="general" />
      <Header />

      <div className="pt-20">
        {/* Hero Section */}
        <EducatorsHero />

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
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-gray-600 hover:text-blue-600'
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
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              {/* Real-time Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Active Students</p>
                      <p className="text-3xl font-bold text-blue-600">{liveStats.activeStudents}</p>
                      <p className="text-xs text-green-600 mt-1">
                        +2 since last hour
                      </p>
                    </div>
                    <FaUserGraduate className="text-3xl text-blue-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Assignments Completed</p>
                      <p className="text-3xl font-bold text-green-600">{liveStats.completedAssignments}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        3 pending review
                      </p>
                    </div>
                    <FaBookOpen className="text-3xl text-green-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">Class Average</p>
                      <p className="text-3xl font-bold text-purple-600">{liveStats.avgClassScore}%</p>
                      <p className="text-xs text-green-600 mt-1">
                        +2% this week
                      </p>
                    </div>
                    <FaClipboardList className="text-3xl text-purple-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm">New Messages</p>
                      <p className="text-3xl font-bold text-orange-600">{liveStats.newMessages}</p>
                      <p className="text-xs text-blue-600 mt-1">
                        2 from parents
                      </p>
                    </div>
                    <FaAward className="text-3xl text-orange-500" />
                  </div>
                  <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <FaUsers className="text-2xl text-blue-600 mb-2" />
                    <span className="text-sm font-medium">Add Students</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                    <FaClipboardList className="text-2xl text-green-600 mb-2" />
                    <span className="text-sm font-medium">Create Lesson</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                    <FaChartLine className="text-2xl text-purple-600 mb-2" />
                    <span className="text-sm font-medium">View Reports</span>
                  </button>
                  <button className="flex flex-col items-center p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors">
                    <FaAward className="text-2xl text-orange-600 mb-2" />
                    <span className="text-sm font-medium">Assessments</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <FaBookOpen className="text-blue-500" />
                    <div className="flex-1">
                      <p className="font-medium">New story completed by Grade 2A</p>
                      <p className="text-sm text-gray-600">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <FaAward className="text-green-500" />
                    <div className="flex-1">
                      <p className="font-medium">Assessment submitted by 15 students</p>
                      <p className="text-sm text-gray-600">4 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <FaClipboardList className="text-purple-500" />
                    <div className="flex-1">
                      <p className="font-medium">Lesson plan &quot;Math Stories&quot; created</p>
                      <p className="text-sm text-gray-600">1 day ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Classrooms Tab */}
          {activeTab === 'classrooms' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">My Classrooms</h2>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Create New Classroom
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classrooms.map((classroom) => (
                  <div key={classroom.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow relative">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{classroom.name}</h3>
                      <div className="flex items-center space-x-2">
                        <span className={`w-2 h-2 rounded-full ${
                          classroom.status === 'active' ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                        }`}></span>
                        <FaUsers className="text-blue-500 text-xl" />
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Students:</span>
                        <span className="font-semibold">{classroom.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Readers:</span>
                        <span className="font-semibold text-green-600">{classroom.activeReaders}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Lesson:</span>
                        <span className="font-semibold text-purple-600 text-sm">{classroom.currentLesson}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Activity:</span>
                        <span className="text-sm text-gray-500">{classroom.lastActivity}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        {classroom.status === 'active' ? 'Join Class' : 'Manage'}
                      </button>
                      <button className="flex-1 border border-blue-600 text-blue-600 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                        Reports
                      </button>
                    </div>
                    {classroom.status === 'active' && (
                      <div className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Live
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Plans Tab */}
          {activeTab === 'lessons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Lesson Plans</h2>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Create New Lesson
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {lessonPlans.map((lesson) => (
                  <div key={lesson.id} className="bg-white p-6 rounded-xl shadow-sm border">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold mb-2">{lesson.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <FaUserGraduate className="mr-1" />
                            Grade {lesson.grade}
                          </span>
                          <span className="flex items-center">
                            <FaClock className="mr-1" />
                            {lesson.duration}
                          </span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        lesson.status === 'ready'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {lesson.status}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        <FaPlay className="text-sm" />
                        <span>Start Lesson</span>
                      </button>
                      <button className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaDownload className="text-sm" />
                        <span>Download</span>
                      </button>
                      <button className="flex items-center space-x-1 border border-gray-300 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <FaShare className="text-sm" />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Educational Resources</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaBookOpen className="text-2xl text-blue-500 mr-3" />
                    <h3 className="text-xl font-bold">Story Library</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Access thousands of age-appropriate stories and books for your classroom.</p>
                  <Link href="/code-stories" className="text-blue-600 hover:text-blue-700 font-medium">
                    Browse Stories →
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaPlay className="text-2xl text-green-500 mr-3" />
                    <h3 className="text-xl font-bold">Video Lessons</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Interactive video content covering coding, math, science, and more.</p>
                  <Link href="/code-videos" className="text-green-600 hover:text-green-700 font-medium">
                    Watch Videos →
                  </Link>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaClipboardList className="text-2xl text-purple-500 mr-3" />
                    <h3 className="text-xl font-bold">Worksheets</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Printable worksheets and activities to complement your lessons.</p>
                  <button className="text-purple-600 hover:text-purple-700 font-medium">
                    Download Worksheets →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaCalendarAlt className="text-2xl text-orange-500 mr-3" />
                    <h3 className="text-xl font-bold">Curriculum Guides</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Structured curriculum guides aligned with educational standards.</p>
                  <button className="text-orange-600 hover:text-orange-700 font-medium">
                    View Guides →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaBullhorn className="text-2xl text-red-500 mr-3" />
                    <h3 className="text-xl font-bold">Parent Communication</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Templates and tools for communicating with parents about student progress.</p>
                  <button className="text-red-600 hover:text-red-700 font-medium">
                    Get Templates →
                  </button>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <div className="flex items-center mb-4">
                    <FaAward className="text-2xl text-indigo-500 mr-3" />
                    <h3 className="text-xl font-bold">Achievement Badges</h3>
                  </div>
                  <p className="text-gray-600 mb-4">Digital badges and certificates to motivate and reward students.</p>
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Create Badges →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Assessments Tab */}
          {activeTab === 'assessments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Assessments & Progress</h2>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Create Assessment
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-xl font-bold mb-4">Reading Comprehension Quiz</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade Level:</span>
                      <span className="font-semibold">2-3</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Questions:</span>
                      <span className="font-semibold">10</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold text-green-600">18/25 students</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      View Results
                    </button>
                    <button className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                      Edit Quiz
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border">
                  <h3 className="text-xl font-bold mb-4">Coding Skills Assessment</h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Grade Level:</span>
                      <span className="font-semibold">3-4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tasks:</span>
                      <span className="font-semibold">5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completed:</span>
                      <span className="font-semibold text-green-600">12/22 students</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
                      View Results
                    </button>
                    <button className="flex-1 border border-purple-600 text-purple-600 py-2 rounded-lg hover:bg-purple-50 transition-colors">
                      Edit Assessment
                    </button>
                  </div>
                </div>
              </div>

              {/* Progress Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-4">Class Progress Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">85%</div>
                    <div className="text-gray-600">Reading Proficiency</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">72%</div>
                    <div className="text-gray-600">Math Skills</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">68%</div>
                    <div className="text-gray-600">Coding Basics</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </div>
    </div>
  );
}
