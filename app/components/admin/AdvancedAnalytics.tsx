'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FaUsers,
  FaBook,
  FaVideo,
  FaChartLine,
  FaChartBar,
  FaChartPie,
  FaEye,
  FaClock,
  FaDownload,
  FaSync
} from 'react-icons/fa';
// Charts will be added after recharts installation
import { db } from '../../../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

interface AnalyticsData {
  connectedUsers: Array<{
    id: string;
    ageGroup?: string;
    contentType?: string;
    lastActive?: Date;
    [key: string]: unknown;
  }>;
  storyViews: Record<string, unknown>[];
  videoViews: Record<string, unknown>[];
  ageGroupData: Array<{
    ageGroup: string;
    users: number;
    totalViews: number;
    engagement: number;
    stories?: number;
    videos?: number;
    [key: string]: unknown;
  }>;
  timeSeriesData: Array<{
    time: string;
    users: number;
    storyViews: number;
    videoViews?: number;
    [key: string]: unknown;
  }>;
  individualStories: Array<{
    id: string;
    title?: string;
    views?: number;
    engagement?: number;
    thumbnail?: string;
    imageUrl?: string;
    ageGroup?: string;
    avgReadTime?: number;
    [key: string]: unknown;
  }>;
  individualVideos: Array<{
    id: string;
    title?: string;
    views?: number;
    engagement?: number;
    thumbnail?: string;
    imageUrl?: string;
    thumbnailUrl?: string;
    ageGroup?: string;
    avgReadTime?: number;
    avgWatchTime?: number;
    isCodeVideo?: boolean;
    viewsToday?: number;
    likesCount?: number;
    [key: string]: unknown;
  }>;
}

export default function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    connectedUsers: [],
    storyViews: [],
    videoViews: [],
    ageGroupData: [],
    timeSeriesData: [],
    individualStories: [],
    individualVideos: []
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('24h'); // 24h, 7d, 30d

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch connected users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const connectedUsers = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        lastActive: doc.data().lastActive?.seconds ? new Date(doc.data().lastActive.seconds * 1000) : new Date()
      }));

      // Fetch stories with view data
      const storiesSnapshot = await getDocs(collection(db, 'stories'));
      const stories = storiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        views: Math.floor(Math.random() * 1000) + 50, // Simulated view data
        createdAt: doc.data().createdAt?.seconds ? new Date(doc.data().createdAt.seconds * 1000) : new Date()
      }));

      // Fetch videos with view data
      const videosSnapshot = await getDocs(collection(db, 'videos'));
      const videos = videosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        views: Math.floor(Math.random() * 800) + 30, // Simulated view data
        createdAt: doc.data().createdAt?.seconds ? new Date(doc.data().createdAt.seconds * 1000) : new Date()
      }));

      // Process age group data
      const ageGroups = ['0-3', '3-6', '6-9', '9-12'];
      const ageGroupData = ageGroups.map(ageGroup => {
        const userCount = Math.floor(Math.random() * 20) + 5; // Mock data since users don't have ageGroup
        const storyCount = Math.floor(Math.random() * 10) + 2; // Mock data since stories don't have ageGroup
        const videoCount = Math.floor(Math.random() * 8) + 1; // Mock data since videos don't have ageGroup
        const totalViews = Math.floor(Math.random() * 1000) + 100; // Mock data

        return {
          ageGroup,
          users: userCount,
          stories: storyCount,
          videos: videoCount,
          totalViews,
          engagement: Math.floor((totalViews / Math.max(userCount, 1)) * 10) / 10
        };
      });

      // Generate time series data for the last 24 hours
      const timeSeriesData = generateTimeSeriesData();

      // Process individual story analytics
      const individualStories = stories
        .slice(0, 10)
        .map(story => ({
          ...story,
          viewsToday: Math.floor((story.views || 0) * 0.3),
          likesCount: Math.floor((story.views || 0) * 0.1),
          avgReadTime: Math.floor(Math.random() * 5) + 2
        }));

      // Process individual video analytics
      const individualVideos = videos
        .slice(0, 10)
        .map(video => ({
          ...video,
          viewsToday: Math.floor((video.views || 0) * 0.25),
          likesCount: Math.floor((video.views || 0) * 0.08),
          avgWatchTime: Math.floor(Math.random() * 8) + 3
        }));

      setAnalyticsData({
        connectedUsers,
        storyViews: stories,
        videoViews: videos,
        ageGroupData,
        timeSeriesData,
        individualStories,
        individualVideos
      });

    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchAnalyticsData, 30000);
    return () => clearInterval(interval);
  }, [fetchAnalyticsData]);

  const generateTimeSeriesData = () => {
    const now = new Date();
    const data = [];

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStr = hour.getHours().toString().padStart(2, '0') + ':00';

      // Simulate realistic data patterns
      const baseUsers = 10 + Math.floor(Math.random() * 20);
      const timeMultiplier = hour.getHours() >= 9 && hour.getHours() <= 21 ? 1.5 : 0.7;

      data.push({
        time: hourStr,
        users: Math.floor(baseUsers * timeMultiplier),
        storyViews: Math.floor((15 + Math.random() * 25) * timeMultiplier),
        videoViews: Math.floor((8 + Math.random() * 15) * timeMultiplier),
        totalEngagement: Math.floor((30 + Math.random() * 40) * timeMultiplier)
      });
    }

    return data;
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <FaChartLine className="text-4xl text-blue-500 mx-auto mb-4 animate-pulse" />
            <p className="text-gray-600">Loading advanced analytics...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl">
            <FaChartLine className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Advanced Analytics Dashboard</h2>
            <p className="text-gray-600">Real-time insights and detailed breakdowns</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>

          <button
            onClick={fetchAnalyticsData}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            <FaSync className="text-sm" />
            <span>Refresh</span>
          </button>

          <button className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            <FaDownload className="text-sm" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex space-x-1 p-1">
          {[
            { id: 'overview', label: '📊 Overview', icon: FaChartBar },
            { id: 'users', label: '👥 User Analytics', icon: FaUsers },
            { id: 'stories', label: '📚 Story Analytics', icon: FaBook },
            { id: 'videos', label: '🎥 Video Analytics', icon: FaVideo },
            { id: 'demographics', label: '🎯 Demographics', icon: FaChartPie }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="text-sm" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Real-time Activity */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Real-time Activity (24h)</h3>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center">
                <FaChartLine className="text-4xl text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Real-time Activity Chart</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-blue-600 font-bold text-xl">{analyticsData.connectedUsers.length}</div>
                    <div className="text-gray-600">Connected Users</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-green-600 font-bold text-xl">{analyticsData.timeSeriesData.reduce((sum, item: Record<string, unknown>) => sum + ((item.storyViews as number) || 0), 0)}</div>
                    <div className="text-gray-600">Story Views (24h)</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-yellow-600 font-bold text-xl">{analyticsData.timeSeriesData.reduce((sum, item: Record<string, unknown>) => sum + ((item.videoViews as number) || 0), 0)}</div>
                    <div className="text-gray-600">Video Views (24h)</div>
                  </div>
                </div>
                <p className="text-gray-500 mt-4">📊 Interactive charts will be available after recharts installation</p>
              </div>
            </div>
          </div>

          {/* Age Group Distribution */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Age Group Distribution</h3>
            <div className="h-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-200">
              <div className="text-center">
                <FaChartPie className="text-4xl text-purple-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Age Group Distribution</h4>
                <div className="grid grid-cols-2 gap-3">
                  {analyticsData.ageGroupData.map((group, groupIndex) => (
                    <div key={group.ageGroup} className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{group.ageGroup} years</span>
                        <span className="text-lg font-bold" style={{ color: COLORS[groupIndex % COLORS.length] }}>
                          {group.users}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${(group.users / Math.max(...analyticsData.ageGroupData.map(g => g.users))) * 100}%`,
                            backgroundColor: COLORS[groupIndex % COLORS.length]
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Engagement Overview */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Engagement by Age Group</h3>
            <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center w-full px-6">
                <FaChartBar className="text-4xl text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Engagement by Age Group</h4>
                <div className="space-y-3">
                  {analyticsData.ageGroupData.map((group) => (
                    <div key={group.ageGroup} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{group.ageGroup} years</span>
                        <div className="flex space-x-4 text-sm">
                          <span className="text-blue-600">Views: {group.totalViews.toLocaleString()}</span>
                          <span className="text-green-600">Engagement: {group.engagement}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (group.totalViews / Math.max(...analyticsData.ageGroupData.map(g => g.totalViews))) * 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, group.engagement * 10)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Current Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Current Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <FaUsers className="text-2xl text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{analyticsData.connectedUsers.length}</div>
                <div className="text-sm text-gray-600">Connected Users</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <FaBook className="text-2xl text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{analyticsData.storyViews.length}</div>
                <div className="text-sm text-gray-600">Total Stories</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <FaVideo className="text-2xl text-purple-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-purple-600">{analyticsData.videoViews.length}</div>
                <div className="text-sm text-gray-600">Total Videos</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <FaEye className="text-2xl text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-600">
                  {analyticsData.ageGroupData.reduce((sum, group) => sum + group.totalViews, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total Views</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* User Connection Timeline */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">User Connections Over Time</h3>
            <div className="h-96 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center w-full px-6">
                <FaUsers className="text-4xl text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">User Connections Timeline (24h)</h4>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {analyticsData.timeSeriesData.slice(-12).map((item, index) => (
                    <div key={index} className="bg-white p-2 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500">{item.time}</div>
                      <div className="text-lg font-bold text-blue-600">{item.users}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-blue-500 h-1 rounded-full"
                          style={{ width: `${(item.users / Math.max(...analyticsData.timeSeriesData.map(d => d.users))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-blue-600 font-bold text-xl">{Math.max(...analyticsData.timeSeriesData.map(d => d.users))}</div>
                      <div className="text-gray-600">Peak Users</div>
                    </div>
                    <div>
                      <div className="text-green-600 font-bold text-xl">{Math.round(analyticsData.timeSeriesData.reduce((sum, d) => sum + d.users, 0) / analyticsData.timeSeriesData.length)}</div>
                      <div className="text-gray-600">Avg Users</div>
                    </div>
                    <div>
                      <div className="text-purple-600 font-bold text-xl">{analyticsData.connectedUsers.length}</div>
                      <div className="text-gray-600">Current Users</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Users List */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Currently Connected Users</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Content Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.connectedUsers.slice(0, 10).map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.ageGroup || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.contentType || 'General'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <FaClock className="mr-1" />
                          {user.lastActive ? user.lastActive.toLocaleTimeString() : 'Unknown'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                          Online
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Stories Tab */}
      {activeTab === 'stories' && (
        <div className="space-y-6">
          {/* Story Views Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Story Views Over Time</h3>
            <div className="h-96 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
              <div className="text-center w-full px-6">
                <FaBook className="text-4xl text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Story Views Timeline (24h)</h4>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {analyticsData.timeSeriesData.slice(-12).map((item, index) => (
                    <div key={index} className="bg-white p-2 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500">{item.time}</div>
                      <div className="text-lg font-bold text-green-600">{item.storyViews}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${(item.storyViews / Math.max(...analyticsData.timeSeriesData.map(d => d.storyViews))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-green-600 font-bold text-xl">{analyticsData.timeSeriesData.reduce((sum, d) => sum + d.storyViews, 0)}</div>
                      <div className="text-gray-600">Total Views (24h)</div>
                    </div>
                    <div>
                      <div className="text-blue-600 font-bold text-xl">{Math.max(...analyticsData.timeSeriesData.map(d => d.storyViews))}</div>
                      <div className="text-gray-600">Peak Hour</div>
                    </div>
                    <div>
                      <div className="text-purple-600 font-bold text-xl">{analyticsData.individualStories.length}</div>
                      <div className="text-gray-600">Active Stories</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Story Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Performing Stories</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Story</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Today&apos;s Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Read Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.individualStories.map((story, index) => (
                    <tr key={story.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {story.imageUrl ? (
                              <img className="h-10 w-10 rounded-lg object-cover" src={story.imageUrl} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <FaBook className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {story.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {story.isCodeStory ? '💻 Code Story' : '📖 Regular Story'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {story.ageGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {(story.views || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaEye className="mr-1 text-green-500" />
                          {story.viewsToday?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          ❤️ {story.likesCount?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaClock className="mr-1 text-blue-500" />
                          {story.avgReadTime || 0} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (story.views || 0) / 10)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Story Categories Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Story Performance by Age Group</h3>
            <div className="h-80 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
              <div className="text-center w-full px-6">
                <FaChartBar className="text-4xl text-blue-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Story Performance by Age Group</h4>
                <div className="grid grid-cols-2 gap-4">
                  {analyticsData.ageGroupData.map((group) => (
                    <div key={group.ageGroup} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-center mb-3">
                        <span className="font-bold text-lg">{group.ageGroup} years</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Stories:</span>
                          <span className="font-bold text-blue-600">{group.stories}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${((group.stories || 0) / Math.max(...analyticsData.ageGroupData.map(g => g.stories || 0))) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Views:</span>
                          <span className="font-bold text-green-600">{group.totalViews.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{ width: `${(group.totalViews / Math.max(...analyticsData.ageGroupData.map(g => g.totalViews))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Videos Tab */}
      {activeTab === 'videos' && (
        <div className="space-y-6">
          {/* Video Views Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Video Views Over Time</h3>
            <div className="h-96 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg flex items-center justify-center border-2 border-dashed border-yellow-200">
              <div className="text-center w-full px-6">
                <FaVideo className="text-4xl text-yellow-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Video Views Timeline (24h)</h4>
                <div className="grid grid-cols-6 gap-2 mb-4">
                  {analyticsData.timeSeriesData.slice(-12).map((item, index) => (
                    <div key={index} className="bg-white p-2 rounded shadow-sm text-center">
                      <div className="text-xs text-gray-500">{item.time}</div>
                      <div className="text-lg font-bold text-yellow-600">{item.videoViews || 0}</div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                        <div
                          className="bg-yellow-500 h-1 rounded-full"
                          style={{ width: `${((item.videoViews || 0) / Math.max(...analyticsData.timeSeriesData.map(d => d.videoViews || 0))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-yellow-600 font-bold text-xl">{analyticsData.timeSeriesData.reduce((sum, d) => sum + (d.videoViews || 0), 0)}</div>
                      <div className="text-gray-600">Total Views (24h)</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-bold text-xl">{Math.max(...analyticsData.timeSeriesData.map(d => d.videoViews || 0))}</div>
                      <div className="text-gray-600">Peak Hour</div>
                    </div>
                    <div>
                      <div className="text-purple-600 font-bold text-xl">{analyticsData.individualVideos.length}</div>
                      <div className="text-gray-600">Active Videos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Individual Video Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Top Performing Videos</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Video</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Today&apos;s Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Likes</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg Watch Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.individualVideos.map((video, index) => (
                    <tr key={video.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {video.thumbnailUrl ? (
                              <img className="h-10 w-10 rounded-lg object-cover" src={video.thumbnailUrl} alt="" />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-200 flex items-center justify-center">
                                <FaVideo className="text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                              {video.title}
                            </div>
                            <div className="text-sm text-gray-500">
                              {video.isCodeVideo ? '💻 Code Video' : '🎥 Regular Video'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {video.ageGroup}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {(video.views || 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaEye className="mr-1 text-green-500" />
                          {video.viewsToday?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          ❤️ {video.likesCount?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FaClock className="mr-1 text-blue-500" />
                          {video.avgWatchTime || 0} min
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, (video.views || 0) / 8)}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">#{index + 1}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Video Categories Performance */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Video Performance by Age Group</h3>
            <div className="h-80 bg-gradient-to-br from-yellow-50 to-red-50 rounded-lg flex items-center justify-center border-2 border-dashed border-yellow-200">
              <div className="text-center w-full px-6">
                <FaChartBar className="text-4xl text-yellow-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Video Performance by Age Group</h4>
                <div className="grid grid-cols-2 gap-4">
                  {analyticsData.ageGroupData.map((group) => (
                    <div key={group.ageGroup} className="bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-center mb-3">
                        <span className="font-bold text-lg">{group.ageGroup} years</span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Videos:</span>
                          <span className="font-bold text-yellow-600">{group.videos || 0}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${((group.videos || 0) / Math.max(...analyticsData.ageGroupData.map(g => g.videos || 0))) * 100}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Views:</span>
                          <span className="font-bold text-red-600">{group.totalViews.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full"
                            style={{ width: `${(group.totalViews / Math.max(...analyticsData.ageGroupData.map(g => g.totalViews))) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Demographics Tab */}
      {activeTab === 'demographics' && (
        <div className="space-y-6">
          {/* Age Group Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">User Distribution by Age</h3>
              <div className="h-80 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg flex items-center justify-center border-2 border-dashed border-purple-200">
                <div className="text-center w-full px-6">
                  <FaChartPie className="text-4xl text-purple-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">User Distribution by Age</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {analyticsData.ageGroupData.map((group, groupIndex) => (
                      <div key={group.ageGroup} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{group.ageGroup} years</span>
                          <span className="text-lg font-bold" style={{ color: COLORS[groupIndex % COLORS.length] }}>
                            {group.users}
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 mb-2">
                          {((group.users / Math.max(analyticsData.connectedUsers.length, 1)) * 100).toFixed(1)}% of total
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="h-3 rounded-full"
                            style={{
                              width: `${(group.users / Math.max(...analyticsData.ageGroupData.map(g => g.users))) * 100}%`,
                              backgroundColor: COLORS[groupIndex % COLORS.length]
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Content Engagement by Age</h3>
              <div className="h-80 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg flex items-center justify-center border-2 border-dashed border-green-200">
                <div className="text-center w-full px-6">
                  <FaChartBar className="text-4xl text-green-400 mx-auto mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-4">Content Engagement by Age</h4>
                  <div className="space-y-4">
                    {analyticsData.ageGroupData.map((group) => (
                      <div key={group.ageGroup} className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{group.ageGroup} years</span>
                          <span className="text-lg font-bold text-green-600">{group.engagement}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className="bg-green-500 h-3 rounded-full"
                            style={{ width: `${Math.min(100, group.engagement * 10)}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Engagement Score: {group.engagement}/10
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Demographics Table */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Detailed Demographics Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Stories</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Videos</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Engagement Rate</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.ageGroupData.map((group, groupIndex) => (
                    <tr key={group.ageGroup} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: COLORS[groupIndex % COLORS.length] }}
                          ></div>
                          <span className="text-sm font-medium text-gray-900">{group.ageGroup} years</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {group.users}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {group.stories || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {group.videos || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {group.totalViews.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${Math.min(100, group.engagement * 10)}%` }}
                            ></div>
                          </div>
                          <span>{group.engagement}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          group.engagement > 5 ? 'bg-green-100 text-green-800' :
                          group.engagement > 3 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {group.engagement > 5 ? '📈 Growing' :
                           group.engagement > 3 ? '📊 Stable' :
                           '📉 Declining'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
