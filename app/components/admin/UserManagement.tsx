'use client';

import React, { useState, useEffect } from 'react';
import {
  FaUsers, FaEdit, FaPlus, FaSearch, FaFilter,
  FaUserCheck, FaUserTimes, FaUserClock, FaCrown, FaEye
} from 'react-icons/fa';
import {
  getUsers,
  createOrUpdateUser,
  assignSubscriptionToUser,
  getSubscriptionPackages,
  UserAccount,
  SubscriptionPackage
} from '../../../lib/subscriptionService';

export default function UserManagement() {
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [subscriptionPackages, setSubscriptionPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserAccount | null>(null);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [usersData, packagesData] = await Promise.all([
        getUsers(100),
        getSubscriptionPackages()
      ]);
      setUsers(usersData);
      setSubscriptionPackages(packagesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEditUser = (user: UserAccount) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleAssignSubscription = (user: UserAccount) => {
    setSelectedUser(user);
    setShowSubscriptionModal(true);
  };

  const handleSaveUser = async (userData: Partial<UserAccount>) => {
    try {
      await createOrUpdateUser(userData);
      await loadData();
      setShowUserModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleAssignPackage = async (packageId: string) => {
    if (!selectedUser) return;

    try {
      await assignSubscriptionToUser(selectedUser.id, packageId);
      await loadData();
      setShowSubscriptionModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Error assigning subscription:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <FaUserCheck className="text-green-500" />;
      case 'inactive': return <FaUserTimes className="text-gray-500" />;
      case 'suspended': return <FaUserTimes className="text-red-500" />;
      case 'pending': return <FaUserClock className="text-yellow-500" />;
      default: return <FaUsers className="text-gray-500" />;
    }
  };

  const getSubscriptionBadge = (user: UserAccount) => {
    if (!user.subscriptionPackage) {
      return <span className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-xs">No Subscription</span>;
    }

    const isExpired = user.subscriptionExpiry && user.subscriptionExpiry.toDate() < new Date();
    const badgeColor = isExpired ? 'bg-red-200 text-red-700' : 'bg-green-200 text-green-700';

    return (
      <span className={`px-2 py-1 rounded-full text-xs ${badgeColor}`}>
        {user.subscriptionPackage.name}
        {isExpired && ' (Expired)'}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaUsers className="text-2xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        </div>
        <button
          onClick={() => {
            setSelectedUser(null);
            setShowUserModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add User
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="relative">
          <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscription</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Group</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                    {user.profile.childName && (
                      <div className="text-xs text-gray-400">Child: {user.profile.childName}</div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getStatusIcon(user.status)}
                    <span className="ml-2 text-sm capitalize">{user.status}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getSubscriptionBadge(user)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {user.profile.ageGroup}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div>Stories: {user.usage.storiesRead}</div>
                  <div>Videos: {user.usage.videosWatched}</div>
                  <div>Time: {Math.round(user.usage.timeSpent / 60)}h</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-blue-600 hover:text-blue-900"
                      title="Edit User"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleAssignSubscription(user)}
                      className="text-green-600 hover:text-green-900"
                      title="Assign Subscription"
                    >
                      <FaCrown />
                    </button>
                    <button
                      className="text-gray-600 hover:text-gray-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found matching your criteria.
        </div>
      )}

      {/* User Modal */}
      {showUserModal && (
        <UserModal
          user={selectedUser}
          onSave={handleSaveUser}
          onClose={() => {
            setShowUserModal(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Subscription Assignment Modal */}
      {showSubscriptionModal && selectedUser && (
        <SubscriptionModal
          user={selectedUser}
          packages={subscriptionPackages}
          onAssign={handleAssignPackage}
          onClose={() => {
            setShowSubscriptionModal(false);
            setSelectedUser(null);
          }}
        />
      )}
    </div>
  );
}

// User Modal Component
interface UserModalProps {
  user: UserAccount | null;
  onSave: (userData: Partial<UserAccount>) => void;
  onClose: () => void;
}

function UserModal({ user, onSave, onClose }: UserModalProps) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    status: user?.status || 'active',
    childName: user?.profile.childName || '',
    childAge: user?.profile.childAge || '',
    parentName: user?.profile.parentName || '',
    ageGroup: user?.profile.ageGroup || '6-9',
    preferredLanguage: user?.profile.preferredLanguage || 'en'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const userData: Partial<UserAccount> = {
      ...(user?.id && { id: user.id }),
      name: formData.name,
      email: formData.email,
      status: formData.status as UserAccount['status'],
      profile: {
        childName: formData.childName,
        childAge: formData.childAge ? Number(formData.childAge) : undefined,
        parentName: formData.parentName,
        ageGroup: formData.ageGroup as UserAccount['profile']['ageGroup'],
        preferredLanguage: formData.preferredLanguage,
        interests: user?.profile.interests || []
      },
      usage: user?.usage || {
        storiesRead: 0,
        videosWatched: 0,
        codeStoriesCompleted: 0,
        timeSpent: 0,
        lastActive: new Date() as unknown as import('firebase/firestore').Timestamp,
        downloadsUsed: 0
      }
    };

    onSave(userData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          {user ? 'Edit User' : 'Add New User'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'suspended' | 'pending' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child Name</label>
            <input
              type="text"
              value={formData.childName}
              onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Child Age</label>
            <input
              type="number"
              value={formData.childAge}
              onChange={(e) => setFormData({ ...formData, childAge: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              min="0"
              max="18"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
            <select
              value={formData.ageGroup}
              onChange={(e) => setFormData({ ...formData, ageGroup: e.target.value as '0-3' | '3-6' | '6-9' | '9-12' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="0-3">0-3 years</option>
              <option value="3-6">3-6 years</option>
              <option value="6-9">6-9 years</option>
              <option value="9-12">9-12 years</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {user ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Subscription Assignment Modal
interface SubscriptionModalProps {
  user: UserAccount;
  packages: SubscriptionPackage[];
  onAssign: (packageId: string) => void;
  onClose: () => void;
}

function SubscriptionModal({ user, packages, onAssign, onClose }: SubscriptionModalProps) {
  const [selectedPackage, setSelectedPackage] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-lg font-bold mb-4">
          Assign Subscription to {user.name}
        </h3>

        <div className="space-y-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedPackage === pkg.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">{pkg.name}</h4>
                  <p className="text-gray-600 text-sm">{pkg.description}</p>
                  <div className="mt-2">
                    <span className="text-2xl font-bold text-green-600">
                      ${pkg.price}
                    </span>
                    <span className="text-gray-500">/{pkg.duration} days</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    pkg.accessLevel === 'basic' ? 'bg-gray-200 text-gray-700' :
                    pkg.accessLevel === 'premium' ? 'bg-blue-200 text-blue-700' :
                    pkg.accessLevel === 'pro' ? 'bg-purple-200 text-purple-700' :
                    'bg-gold-200 text-gold-700'
                  }`}>
                    {pkg.accessLevel.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="mt-3">
                <h5 className="font-medium text-sm mb-1">Features:</h5>
                <ul className="text-xs text-gray-600 space-y-1">
                  {pkg.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                  {pkg.features.length > 3 && (
                    <li>• +{pkg.features.length - 3} more features</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => selectedPackage && onAssign(selectedPackage)}
            disabled={!selectedPackage}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Assign Subscription
          </button>
        </div>
      </div>
    </div>
  );
}
