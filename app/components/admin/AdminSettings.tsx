'use client';

import React, { useState, useEffect } from 'react';
import {
  FaCog,
  FaKey,
  FaShieldAlt,
  FaHistory,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaCheck,
  FaExclamationTriangle,
  FaTrash,
  FaDownload
} from 'react-icons/fa';

export default function AdminSettings() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');
  const [passwordHistory, setPasswordHistory] = useState<{
    password?: string;
    changedAt: string;
    length: number;
    action?: string;
  }[]>([]);

  useEffect(() => {
    // Load current password and history
    const savedPassword = localStorage.getItem('adminPassword') || 'admin123';
    setCurrentPassword(savedPassword);

    const history = JSON.parse(localStorage.getItem('adminPasswordHistory') || '[]');
    setPasswordHistory(history);
  }, []);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validate current password
    const storedPassword = localStorage.getItem('adminPassword') || 'admin123';
    if (currentPassword !== storedPassword) {
      setMessage('Current password is incorrect');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Validate new password
    if (newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('New passwords do not match');
      setMessageType('error');
      setLoading(false);
      return;
    }

    if (newPassword === currentPassword) {
      setMessage('New password must be different from current password');
      setMessageType('error');
      setLoading(false);
      return;
    }

    // Simulate password change delay
    setTimeout(() => {
      // Save new password
      localStorage.setItem('adminPassword', newPassword);

      // Update password history
      const history = JSON.parse(localStorage.getItem('adminPasswordHistory') || '[]');
      const newHistory = [
        {
          password: currentPassword,
          changedAt: new Date().toISOString(),
          length: currentPassword.length
        },
        ...history.slice(0, 4) // Keep last 5 passwords
      ];
      localStorage.setItem('adminPasswordHistory', JSON.stringify(newHistory));

      setMessage('Password changed successfully!');
      setMessageType('success');
      setCurrentPassword(newPassword);
      setNewPassword('');
      setConfirmPassword('');
      setPasswordHistory(newHistory);
      setLoading(false);
    }, 1500);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset to the default password (admin123)?')) {
      const currentPass = localStorage.getItem('adminPassword') || 'admin123';

      // Update history
      const history = JSON.parse(localStorage.getItem('adminPasswordHistory') || '[]');
      const newHistory = [
        {
          password: currentPass,
          changedAt: new Date().toISOString(),
          length: currentPass.length,
          action: 'Reset to default'
        },
        ...history.slice(0, 4)
      ];

      localStorage.setItem('adminPassword', 'admin123');
      localStorage.setItem('adminPasswordHistory', JSON.stringify(newHistory));

      setCurrentPassword('admin123');
      setPasswordHistory(newHistory);
      setMessage('Password reset to default successfully!');
      setMessageType('success');
    }
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear the password history?')) {
      localStorage.removeItem('adminPasswordHistory');
      setPasswordHistory([]);
      setMessage('Password history cleared successfully!');
      setMessageType('success');
    }
  };

  const exportSettings = () => {
    const settings = {
      currentPasswordLength: currentPassword.length,
      isDefaultPassword: currentPassword === 'admin123',
      passwordHistory: passwordHistory.map(p => ({
        length: p.length,
        changedAt: p.changedAt,
        action: p.action || 'Password change'
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `admin-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setMessage('Settings exported successfully!');
    setMessageType('success');
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-gradient-to-br from-purple-500 to-blue-600 p-3 rounded-xl">
            <FaCog className="text-white text-xl" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Admin Settings</h2>
            <p className="text-gray-600">Manage your admin account and security settings</p>
          </div>
        </div>

        <button
          onClick={exportSettings}
          className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
        >
          <FaDownload className="text-sm" />
          <span>Export Settings</span>
        </button>
      </div>

      {/* Current Password Info */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FaShieldAlt className="text-blue-500 text-xl" />
          <h3 className="text-lg font-bold text-gray-800">Current Password Status</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-600 font-bold text-lg">
              {currentPassword === 'admin123' ? 'Default' : 'Custom'}
            </div>
            <div className="text-blue-500 text-sm">Password Type</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-600 font-bold text-lg">{currentPassword.length} chars</div>
            <div className="text-green-500 text-sm">Password Length</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-purple-600 font-bold text-lg">{passwordHistory.length}</div>
            <div className="text-purple-500 text-sm">History Records</div>
          </div>
        </div>
      </div>

      {/* Change Password Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <FaKey className="text-orange-500 text-xl" />
          <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
        </div>

        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Current Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Confirm new password"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Password Strength */}
          {newPassword && (
            <div className="space-y-2">
              <div className="text-sm text-gray-600">Password Strength:</div>
              <div className="flex space-x-1">
                <div className={`h-2 flex-1 rounded ${newPassword.length >= 6 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${/[A-Z]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${/[0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                <div className={`h-2 flex-1 rounded ${/[^A-Za-z0-9]/.test(newPassword) ? 'bg-green-500' : 'bg-gray-200'}`}></div>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`flex items-center space-x-2 p-3 rounded-lg ${
              messageType === 'success' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
            }`}>
              {messageType === 'success' ? <FaCheck /> : <FaExclamationTriangle />}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword}
              className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl hover:from-blue-600 hover:to-green-600 transition-all disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <FaSave />
                  <span>Change Password</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center space-x-2 px-6 py-3 border border-orange-300 text-orange-600 rounded-xl hover:bg-orange-50 transition-all"
            >
              <FaShieldAlt />
              <span>Reset to Default</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <FaHistory className="text-purple-500 text-xl" />
            <h3 className="text-lg font-bold text-gray-800">Password History</h3>
          </div>

          {passwordHistory.length > 0 && (
            <button
              onClick={handleClearHistory}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-all"
            >
              <FaTrash className="text-sm" />
              <span>Clear History</span>
            </button>
          )}
        </div>

        {passwordHistory.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FaHistory className="text-4xl mx-auto mb-3 opacity-50" />
            <p>No password history available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {passwordHistory.map((entry, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <FaKey className="text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {entry.action || 'Password changed'}
                    </div>
                    <div className="text-sm text-gray-500">
                      Length: {entry.length} characters
                    </div>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(entry.changedAt).toLocaleDateString()} {new Date(entry.changedAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
