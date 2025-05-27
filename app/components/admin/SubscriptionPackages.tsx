'use client';

import React, { useState, useEffect } from 'react';
import {
  FaCrown, FaPlus, FaEdit, FaToggleOn, FaToggleOff,
  FaCheck, FaTimes
} from 'react-icons/fa';
import {
  getSubscriptionPackages,
  createDefaultSubscriptionPackages,
  SubscriptionPackage
} from '../../../lib/subscriptionService';

export default function SubscriptionPackages() {
  const [packages, setPackages] = useState<SubscriptionPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<SubscriptionPackage | null>(null);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const packagesData = await getSubscriptionPackages();
      setPackages(packagesData);

      // If no packages exist, create default ones
      if (packagesData.length === 0) {
        await createDefaultSubscriptionPackages();
        const newPackagesData = await getSubscriptionPackages();
        setPackages(newPackagesData);
      }
    } catch (error) {
      console.error('Error loading packages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditPackage = (pkg: SubscriptionPackage) => {
    setSelectedPackage(pkg);
    setShowPackageModal(true);
  };

  const handleCreatePackage = () => {
    setSelectedPackage(null);
    setShowPackageModal(true);
  };

  const getAccessLevelBadge = (level: string) => {
    const levelConfig = {
      'basic': { color: 'bg-gray-200 text-gray-700', icon: '🌱' },
      'premium': { color: 'bg-blue-200 text-blue-700', icon: '⭐' },
      'pro': { color: 'bg-purple-200 text-purple-700', icon: '💎' },
      'unlimited': { color: 'bg-gold-200 text-gold-700', icon: '👑' }
    };

    const config = levelConfig[level as keyof typeof levelConfig] || levelConfig.basic;
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {level.toUpperCase()}
      </span>
    );
  };

  const getContentAccessSummary = (contentAccess: SubscriptionPackage['contentAccess']) => {
    const accessCount = Object.values(contentAccess).filter(Boolean).length;
    const totalCount = Object.keys(contentAccess).length;
    return `${accessCount}/${totalCount} content types`;
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
          <FaCrown className="text-2xl text-yellow-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Subscription Packages</h2>
        </div>
        <button
          onClick={handleCreatePackage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Create Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className={`border rounded-lg p-6 transition-all duration-300 ${
              pkg.isActive
                ? 'border-blue-200 bg-blue-50 hover:shadow-lg'
                : 'border-gray-200 bg-gray-50 opacity-75'
            }`}
          >
            {/* Package Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{pkg.name}</h3>
                <p className="text-gray-600 text-sm mt-1">{pkg.description}</p>
              </div>
              <div className="flex items-center space-x-2">
                {pkg.isActive ? (
                  <FaToggleOn className="text-green-500 text-xl" />
                ) : (
                  <FaToggleOff className="text-gray-400 text-xl" />
                )}
              </div>
            </div>

            {/* Price and Duration */}
            <div className="mb-4">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold text-green-600">
                  ${pkg.price}
                </span>
                <span className="text-gray-500 ml-2">
                  /{pkg.duration} days
                </span>
              </div>
              {pkg.price === 0 && (
                <span className="text-green-600 text-sm font-medium">FREE</span>
              )}
            </div>

            {/* Access Level */}
            <div className="mb-4">
              {getAccessLevelBadge(pkg.accessLevel)}
            </div>

            {/* Content Access Summary */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Content Access:</div>
              <div className="text-sm font-medium text-blue-600">
                {getContentAccessSummary(pkg.contentAccess)}
              </div>
              <div className="text-xs text-gray-500">
                Age Groups: {pkg.ageGroupAccess.join(', ')}
              </div>
            </div>

            {/* Features Preview */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Key Features:</div>
              <ul className="text-xs text-gray-600 space-y-1">
                {pkg.features.slice(0, 3).map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <FaCheck className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
                {pkg.features.length > 3 && (
                  <li className="text-gray-400">+{pkg.features.length - 3} more features</li>
                )}
              </ul>
            </div>

            {/* Limits */}
            <div className="mb-4 text-xs text-gray-500">
              <div>Max Downloads: {pkg.maxDownloads === -1 ? 'Unlimited' : pkg.maxDownloads}</div>
              <div>Support: {pkg.supportLevel}</div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <button
                onClick={() => handleEditPackage(pkg)}
                className="text-blue-600 hover:text-blue-800 flex items-center text-sm"
              >
                <FaEdit className="mr-1" />
                Edit
              </button>
              <div className="text-xs text-gray-400">
                Created: {pkg.createdAt.toDate().toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {packages.length === 0 && (
        <div className="text-center py-12">
          <FaCrown className="text-6xl text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No Subscription Packages</h3>
          <p className="text-gray-500 mb-4">Create your first subscription package to get started.</p>
          <button
            onClick={handleCreatePackage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create First Package
          </button>
        </div>
      )}

      {/* Package Modal */}
      {showPackageModal && (
        <PackageModal
          package={selectedPackage}
          onSave={loadPackages}
          onClose={() => {
            setShowPackageModal(false);
            setSelectedPackage(null);
          }}
        />
      )}
    </div>
  );
}

// Package Modal Component
interface PackageModalProps {
  package: SubscriptionPackage | null;
  onSave: () => void;
  onClose: () => void;
}

function PackageModal({ package: pkg, onSave, onClose }: PackageModalProps) {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    price: pkg?.price || 0,
    duration: pkg?.duration || 30,
    accessLevel: pkg?.accessLevel || 'basic',
    maxDownloads: pkg?.maxDownloads || 10,
    supportLevel: pkg?.supportLevel || 'basic',
    isActive: pkg?.isActive ?? true,
    features: pkg?.features || [''],
    contentAccess: pkg?.contentAccess || {
      stories: false,
      videos: false,
      codeStories: false,
      codeVideos: false,
      poems: false,
      blog: false,
      codePlayground: false
    },
    ageGroupAccess: pkg?.ageGroupAccess || []
  });

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const handleContentAccessChange = (contentType: string, value: boolean) => {
    setFormData({
      ...formData,
      contentAccess: {
        ...formData.contentAccess,
        [contentType]: value
      }
    });
  };

  const handleAgeGroupChange = (ageGroup: string, checked: boolean) => {
    const newAgeGroups = checked
      ? [...formData.ageGroupAccess, ageGroup]
      : formData.ageGroupAccess.filter(ag => ag !== ageGroup);

    setFormData({ ...formData, ageGroupAccess: newAgeGroups });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Here you would implement the save logic
      // For now, we'll just call onSave to refresh the list
      console.log('Saving package:', formData);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving package:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">
            {pkg ? 'Edit Package' : 'Create New Package'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Basic Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (days)</label>
                  <input
                    type="number"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Access Level</label>
                <select
                  value={formData.accessLevel}
                  onChange={(e) => setFormData({ ...formData, accessLevel: e.target.value as 'basic' | 'premium' | 'pro' | 'unlimited' })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="pro">Pro</option>
                  <option value="unlimited">Unlimited</option>
                </select>
              </div>
            </div>

            {/* Content Access */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Content Access</h4>

              <div className="space-y-2">
                {Object.entries(formData.contentAccess).map(([contentType, hasAccess]) => (
                  <label key={contentType} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hasAccess}
                      onChange={(e) => handleContentAccessChange(contentType, e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm capitalize">
                      {contentType.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                  </label>
                ))}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age Group Access</label>
                <div className="space-y-2">
                  {['0-3', '3-6', '6-9', '9-12'].map((ageGroup) => (
                    <label key={ageGroup} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.ageGroupAccess.includes(ageGroup)}
                        onChange={(e) => handleAgeGroupChange(ageGroup, e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm">{ageGroup} years</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Downloads</label>
                  <input
                    type="number"
                    value={formData.maxDownloads === -1 ? '' : formData.maxDownloads}
                    onChange={(e) => setFormData({
                      ...formData,
                      maxDownloads: e.target.value === '' ? -1 : Number(e.target.value)
                    })}
                    placeholder="Unlimited"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support Level</label>
                  <select
                    value={formData.supportLevel}
                    onChange={(e) => setFormData({ ...formData, supportLevel: e.target.value as 'basic' | 'priority' | 'premium' })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="priority">Priority</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">Features</h4>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature description"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
              >
                <FaPlus className="mr-1" />
                Add Feature
              </button>
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm font-medium text-gray-700">Package is active</label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
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
              {pkg ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
