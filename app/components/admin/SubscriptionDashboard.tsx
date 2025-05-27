'use client';

import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaComments, FaCrown, FaChartLine, FaDollarSign,
  FaUserCheck, FaExclamationTriangle
} from 'react-icons/fa';
import UserManagement from './UserManagement';
import FeedbackManagement from './FeedbackManagement';
import SubscriptionPackages from './SubscriptionPackages';
import {
  getUsers,
  getFeedback,
  getSubscriptionPackages
} from '../../../lib/subscriptionService';

type TabType = 'overview' | 'users' | 'feedback' | 'packages';

export default function SubscriptionDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalFeedback: 0,
    newFeedback: 0,
    totalPackages: 0,
    totalRevenue: 0,
    expiringSoon: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    try {
      const [users, feedback, packages] = await Promise.all([
        getUsers(1000),
        getFeedback(undefined, undefined, 1000),
        getSubscriptionPackages()
      ]);

      // Calculate stats
      const activeUsers = users.filter(user => user.status === 'active').length;
      const newFeedback = feedback.filter(f => f.status === 'new').length;

      // Calculate revenue (simplified - in real app, you'd have payment records)
      const totalRevenue = users.reduce((sum, user) => {
        if (user.subscriptionPackage && user.subscriptionPackage.price > 0) {
          return sum + user.subscriptionPackage.price;
        }
        return sum;
      }, 0);

      // Calculate expiring subscriptions (within 7 days)
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

      const expiringSoon = users.filter(user => {
        if (user.subscriptionExpiry) {
          const expiryDate = user.subscriptionExpiry.toDate();
          return expiryDate <= sevenDaysFromNow && expiryDate > new Date();
        }
        return false;
      }).length;

      setStats({
        totalUsers: users.length,
        activeUsers,
        totalFeedback: feedback.length,
        newFeedback,
        totalPackages: packages.length,
        totalRevenue,
        expiringSoon
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FaChartLine },
    { id: 'users', label: 'Users', icon: FaUsers },
    { id: 'feedback', label: 'Feedback', icon: FaComments },
    { id: 'packages', label: 'Packages', icon: FaCrown }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab stats={stats} loading={loading} onRefresh={loadDashboardStats} />;
      case 'users':
        return <UserManagement />;
      case 'feedback':
        return <FeedbackManagement />;
      case 'packages':
        return <SubscriptionPackages />;
      default:
        return <OverviewTab stats={stats} loading={loading} onRefresh={loadDashboardStats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <FaCrown className="text-2xl text-yellow-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Subscription Management</h1>
            </div>
            <div className="text-sm text-gray-500">
              BixForge Admin Dashboard
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="mr-2" />
                    {tab.label}
                    {tab.id === 'feedback' && stats.newFeedback > 0 && (
                      <span className="ml-2 bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
                        {stats.newFeedback}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {renderTabContent()}
      </div>
    </div>
  );
}

// Overview Tab Component
interface OverviewTabProps {
  stats: {
    totalUsers: number;
    activeUsers: number;
    totalFeedback: number;
    newFeedback: number;
    totalPackages: number;
    totalRevenue: number;
    expiringSoon: number;
  };
  loading: boolean;
  onRefresh: () => void;
}

function OverviewTab({ stats, loading, onRefresh }: OverviewTabProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: FaUsers,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers,
      icon: FaUserCheck,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'New Feedback',
      value: stats.newFeedback,
      icon: FaComments,
      color: 'bg-yellow-500',
      change: stats.newFeedback > 5 ? 'High' : 'Normal',
      changeType: stats.newFeedback > 5 ? 'warning' : 'neutral'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: FaDollarSign,
      color: 'bg-purple-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      title: 'Expiring Soon',
      value: stats.expiringSoon,
      icon: FaExclamationTriangle,
      color: 'bg-red-500',
      change: 'Next 7 days',
      changeType: 'warning'
    },
    {
      title: 'Subscription Packages',
      value: stats.totalPackages,
      icon: FaCrown,
      color: 'bg-indigo-500',
      change: 'Active',
      changeType: 'neutral'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className={`text-sm ${
                    stat.changeType === 'positive' ? 'text-green-600' :
                    stat.changeType === 'warning' ? 'text-yellow-600' :
                    stat.changeType === 'negative' ? 'text-red-600' :
                    'text-gray-600'
                  }`}>
                    {stat.change}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <Icon className="text-white text-xl" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={onRefresh}
            className="bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <FaChartLine className="mr-2" />
            Refresh Stats
          </button>
          <button
            onClick={() => window.open('/admin/users', '_blank')}
            className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
          >
            <FaUsers className="mr-2" />
            Manage Users
          </button>
          <button
            onClick={() => window.open('/admin/feedback', '_blank')}
            className="bg-yellow-600 text-white px-4 py-3 rounded-lg hover:bg-yellow-700 transition-colors flex items-center justify-center"
          >
            <FaComments className="mr-2" />
            Review Feedback
          </button>
          <button
            onClick={() => window.open('/admin/packages', '_blank')}
            className="bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center"
          >
            <FaCrown className="mr-2" />
            Edit Packages
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent User Activity</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUsers className="text-blue-600 text-sm" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">User {item} registered</p>
                    <p className="text-xs text-gray-500">{item} hours ago</p>
                  </div>
                </div>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                  New
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Feedback</h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <FaComments className="text-yellow-600 text-sm" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Feedback #{item}</p>
                    <p className="text-xs text-gray-500">{item * 2} hours ago</p>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item <= 2 ? 'text-red-600 bg-red-100' : 'text-blue-600 bg-blue-100'
                }`}>
                  {item <= 2 ? 'Urgent' : 'Normal'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
