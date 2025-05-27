'use client';

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';

interface UserActivity {
  id: string;
  timestamp: Date;
  ageGroup: string;
  contentType: string;
  page: string;
  sessionId: string;
}

interface AnalyticsData {
  totalUsers: number;
  activeUsers: number;
  usersByAge: { [key: string]: number };
  usersByContent: { [key: string]: number };
  recentActivity: UserActivity[];
  hourlyData: { hour: string; users: number }[];
}

export default function UserAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalUsers: 0,
    activeUsers: 0,
    usersByAge: {},
    usersByContent: {},
    recentActivity: [],
    hourlyData: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for user activity
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    // Listen to recent activity from main clone (last hour)
    const recentActivityQuery = query(
      collection(db, 'userActivity'),
      where('timestamp', '>=', oneHourAgo),
      where('page', 'in', ['/', '/home', 'main']), // Track main clone activity
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(recentActivityQuery, (snapshot) => {
      const activities: UserActivity[] = [];
      const activeSessionIds = new Set<string>();
      const ageGroups: { [key: string]: number } = {};
      const contentTypes: { [key: string]: number } = {};

      snapshot.forEach((doc) => {
        const data = doc.data();
        const activity: UserActivity = {
          id: doc.id,
          timestamp: data.timestamp.toDate(),
          ageGroup: data.ageGroup || 'Unknown',
          contentType: data.contentType || 'general',
          page: data.page || 'Unknown',
          sessionId: data.sessionId
        };

        activities.push(activity);
        activeSessionIds.add(activity.sessionId);

        // Count by age group
        ageGroups[activity.ageGroup] = (ageGroups[activity.ageGroup] || 0) + 1;

        // Count by content type
        contentTypes[activity.contentType] = (contentTypes[activity.contentType] || 0) + 1;
      });

      // Generate hourly data for the last 24 hours
      const hourlyData = generateHourlyData(activities);

      setAnalytics({
        totalUsers: snapshot.size,
        activeUsers: activeSessionIds.size,
        usersByAge: ageGroups,
        usersByContent: contentTypes,
        recentActivity: activities.slice(0, 10), // Show last 10 activities
        hourlyData
      });

      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const generateHourlyData = (activities: UserActivity[]) => {
    const hourlyData: { hour: string; users: number }[] = [];
    const now = new Date();

    for (let i = 23; i >= 0; i--) {
      const hour = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hourStart = new Date(hour.getFullYear(), hour.getMonth(), hour.getDate(), hour.getHours());
      const hourEnd = new Date(hourStart.getTime() + 60 * 60 * 1000);

      const usersInHour = activities.filter(activity =>
        activity.timestamp >= hourStart && activity.timestamp < hourEnd
      ).length;

      hourlyData.push({
        hour: hour.getHours().toString().padStart(2, '0') + ':00',
        users: usersInHour
      });
    }

    return hourlyData;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const getMaxUsers = () => {
    return Math.max(...analytics.hourlyData.map(d => d.users), 1);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Real-time Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Active Users</p>
              <p className="text-2xl font-bold">{analytics.activeUsers}</p>
            </div>
            <div className="bg-blue-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-blue-100 text-xs">🟢 Live</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Sessions</p>
              <p className="text-2xl font-bold">{analytics.totalUsers}</p>
            </div>
            <div className="bg-green-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-green-100 text-xs">Last hour</span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Most Active Age</p>
              <p className="text-2xl font-bold">
                {Object.entries(analytics.usersByAge).sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'}
              </p>
            </div>
            <div className="bg-purple-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-purple-100 text-xs">
              {Object.entries(analytics.usersByAge).sort(([,a], [,b]) => b - a)[0]?.[1] || 0} users
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Current Time</p>
              <p className="text-2xl font-bold">{formatTime(new Date())}</p>
            </div>
            <div className="bg-orange-400 rounded-full p-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-orange-100 text-xs">Real-time</span>
          </div>
        </div>
      </div>

      {/* Hourly Activity Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">24-Hour User Activity</h3>
        <div className="flex items-end space-x-1 h-32">
          {analytics.hourlyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                style={{
                  height: `${(data.users / getMaxUsers()) * 100}%`,
                  minHeight: data.users > 0 ? '4px' : '2px'
                }}
                title={`${data.hour}: ${data.users} users`}
              ></div>
              <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                {data.hour}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {analytics.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-800">
                  User on <span className="font-medium">Main Clone</span> viewing <span className="font-medium">{activity.contentType}</span> content
                </p>
                <p className="text-xs text-gray-500">
                  Age: {activity.ageGroup} • Page: {activity.page} • {formatTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {analytics.recentActivity.length === 0 && (
            <p className="text-gray-500 text-center py-4">No recent activity</p>
          )}
        </div>
      </div>
    </div>
  );
}
