'use client';

import React, { useState } from 'react';
import {
  FaComments, FaPaperPlane, FaStar, FaTimes, FaCheck,
  FaBug, FaLightbulb, FaBook, FaExclamationTriangle
} from 'react-icons/fa';
import { submitFeedback } from '../../lib/subscriptionService';

interface FeedbackFormProps {
  isOpen: boolean;
  onClose: () => void;
  contentId?: string;
  contentType?: 'story' | 'video' | 'code-story' | 'code-video' | 'poem';
  contentTitle?: string;
}

export default function FeedbackForm({
  isOpen,
  onClose,
  contentId,
  contentType,
  contentTitle
}: FeedbackFormProps) {
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    type: 'general' as 'bug' | 'feature' | 'content' | 'general' | 'complaint' | 'suggestion',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    subject: '',
    message: '',
    rating: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = [
    { id: 'bug', label: 'Bug Report', icon: FaBug, color: 'text-red-600' },
    { id: 'feature', label: 'Feature Request', icon: FaLightbulb, color: 'text-yellow-600' },
    { id: 'content', label: 'Content Feedback', icon: FaBook, color: 'text-blue-600' },
    { id: 'general', label: 'General Feedback', icon: FaComments, color: 'text-gray-600' },
    { id: 'complaint', label: 'Complaint', icon: FaExclamationTriangle, color: 'text-orange-600' },
    { id: 'suggestion', label: 'Suggestion', icon: FaLightbulb, color: 'text-green-600' }
  ];

  const priorityLevels = [
    { id: 'low', label: 'Low', color: 'bg-green-100 text-green-800' },
    { id: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
    { id: 'urgent', label: 'Urgent', color: 'bg-red-100 text-red-800' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate a user ID (in a real app, this would come from authentication)
      const userId = localStorage.getItem('user_id') || `user_${Date.now()}`;
      if (!localStorage.getItem('user_id')) {
        localStorage.setItem('user_id', userId);
      }

      await submitFeedback({
        userId,
        userEmail: formData.userEmail,
        userName: formData.userName,
        type: formData.type,
        priority: formData.priority,
        subject: formData.subject,
        message: formData.message,
        rating: formData.rating > 0 ? formData.rating : undefined,
        contentId,
        contentType,
        status: 'new'
      });

      setIsSubmitted(true);

      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          userName: '',
          userEmail: '',
          type: 'general',
          priority: 'medium',
          subject: '',
          message: '',
          rating: 0
        });
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setFormData({ ...formData, rating: star })}
            className={`text-2xl transition-colors ${
              star <= formData.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <FaStar />
          </button>
        ))}
        {formData.rating > 0 && (
          <span className="ml-2 text-sm text-gray-600">({formData.rating}/5)</span>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  if (isSubmitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-4">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <FaCheck className="text-3xl text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
            <p className="text-gray-600">
              Your feedback has been submitted successfully. We&apos;ll review it and get back to you soon.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <FaComments className="text-2xl text-blue-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-800">Send Feedback</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {contentTitle && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
            <p className="text-sm text-blue-800">
              <strong>About:</strong> {contentTitle} ({contentType})
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                value={formData.userName}
                onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Email *
              </label>
              <input
                type="email"
                value={formData.userEmail}
                onChange={(e) => setFormData({ ...formData, userEmail: e.target.value })}
                placeholder="Enter your email address"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                required
              />
            </div>
          </div>

          {/* Feedback Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Feedback Type *
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {feedbackTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.id as 'bug' | 'feature' | 'content' | 'general' | 'complaint' | 'suggestion' })}
                    className={`p-3 border rounded-lg text-left transition-all ${
                      formData.type === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`text-lg mb-1 ${type.color}`} />
                    <div className="text-sm font-medium text-gray-800">{type.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority Level
            </label>
            <div className="flex flex-wrap gap-2">
              {priorityLevels.map((priority) => (
                <button
                  key={priority.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, priority: priority.id as 'low' | 'medium' | 'high' | 'urgent' })}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
                    formData.priority === priority.id
                      ? priority.color + ' ring-2 ring-blue-500'
                      : priority.color + ' opacity-60 hover:opacity-100'
                  }`}
                >
                  {priority.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rating (for content feedback) */}
          {(formData.type === 'content' || contentId) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rate this content (optional)
              </label>
              {renderStarRating()}
            </div>
          )}

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Brief description of your feedback"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message *
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Please provide detailed feedback..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              rows={5}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <FaPaperPlane className="mr-2 text-lg" />
                  Send Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Feedback Button Component for easy integration
interface FeedbackButtonProps {
  contentId?: string;
  contentType?: 'story' | 'video' | 'code-story' | 'code-video' | 'poem';
  contentTitle?: string;
  className?: string;
}

export function FeedbackButton({
  contentId,
  contentType,
  contentTitle,
  className = ''
}: FeedbackButtonProps) {
  const [showFeedback, setShowFeedback] = useState(false);

  return (
    <>
      <button
        onClick={() => setShowFeedback(true)}
        className={`flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-xl transform hover:scale-105 ${className}`}
      >
        <FaComments className="mr-2 text-lg" />
        Give Feedback
      </button>

      <FeedbackForm
        isOpen={showFeedback}
        onClose={() => setShowFeedback(false)}
        contentId={contentId}
        contentType={contentType}
        contentTitle={contentTitle}
      />
    </>
  );
}
