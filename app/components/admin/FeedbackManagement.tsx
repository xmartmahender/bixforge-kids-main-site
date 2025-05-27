'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  FaComments, FaSearch, FaEye, FaCheck,
  FaTimes, FaClock, FaExclamationTriangle, FaUser, FaStar
} from 'react-icons/fa';
import {
  getFeedback,
  updateFeedbackStatus,
  UserFeedback
} from '../../../lib/subscriptionService';

export default function FeedbackManagement() {
  const [feedback, setFeedback] = useState<UserFeedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedFeedback, setSelectedFeedback] = useState<UserFeedback | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const loadFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const feedbackData = await getFeedback(
        statusFilter === 'all' ? undefined : statusFilter,
        typeFilter === 'all' ? undefined : typeFilter,
        100
      );
      setFeedback(feedbackData);
    } catch (error) {
      console.error('Error loading feedback:', error);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, typeFilter]);

  useEffect(() => {
    loadFeedback();
  }, [loadFeedback]);

  const filteredFeedback = feedback.filter(item => {
    const matchesSearch =
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPriority = priorityFilter === 'all' || item.priority === priorityFilter;

    return matchesSearch && matchesPriority;
  });

  const handleStatusUpdate = async (feedbackId: string, status: UserFeedback['status'], adminNotes?: string) => {
    try {
      await updateFeedbackStatus(feedbackId, status, adminNotes);
      await loadFeedback();
    } catch (error) {
      console.error('Error updating feedback status:', error);
    }
  };

  const handleViewDetails = (feedbackItem: UserFeedback) => {
    setSelectedFeedback(feedbackItem);
    setShowDetailModal(true);
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'urgent': return <FaExclamationTriangle className="text-red-500" />;
      case 'high': return <FaExclamationTriangle className="text-orange-500" />;
      case 'medium': return <FaClock className="text-yellow-500" />;
      case 'low': return <FaClock className="text-green-500" />;
      default: return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'new': { color: 'bg-blue-100 text-blue-800', text: 'New' },
      'in-progress': { color: 'bg-yellow-100 text-yellow-800', text: 'In Progress' },
      'resolved': { color: 'bg-green-100 text-green-800', text: 'Resolved' },
      'closed': { color: 'bg-gray-100 text-gray-800', text: 'Closed' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.new;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'bug': { color: 'bg-red-100 text-red-800', icon: '🐛' },
      'feature': { color: 'bg-purple-100 text-purple-800', icon: '✨' },
      'content': { color: 'bg-blue-100 text-blue-800', icon: '📚' },
      'general': { color: 'bg-gray-100 text-gray-800', icon: '💬' },
      'complaint': { color: 'bg-orange-100 text-orange-800', icon: '😞' },
      'suggestion': { color: 'bg-green-100 text-green-800', icon: '💡' }
    };

    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.general;
    return (
      <span className={`px-2 py-1 rounded-full text-xs ${config.color} flex items-center`}>
        <span className="mr-1">{config.icon}</span>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;

    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? 'text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating}/5)</span>
      </div>
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
          <FaComments className="text-2xl text-blue-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">Feedback Management</h2>
        </div>
        <div className="text-sm text-gray-600">
          Total: {feedback.length} | New: {feedback.filter(f => f.status === 'new').length}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search feedback..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="bug">Bug Report</option>
          <option value="feature">Feature Request</option>
          <option value="content">Content Feedback</option>
          <option value="general">General</option>
          <option value="complaint">Complaint</option>
          <option value="suggestion">Suggestion</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Priorities</option>
          <option value="urgent">Urgent</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Feedback Table */}
      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User & Subject</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Priority</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredFeedback.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.subject}</div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaUser className="mr-1" />
                      {item.userName} ({item.userEmail})
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate max-w-xs">
                      {item.message.substring(0, 100)}...
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="space-y-2">
                    {getTypeBadge(item.type)}
                    <div className="flex items-center">
                      {getPriorityIcon(item.priority)}
                      <span className="ml-1 text-sm capitalize">{item.priority}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-4 py-4">
                  {renderStars(item.rating)}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {item.createdAt.toDate().toLocaleDateString()}
                </td>
                <td className="px-4 py-4">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleViewDetails(item)}
                      className="text-blue-600 hover:text-blue-900"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    {item.status === 'new' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'in-progress')}
                        className="text-yellow-600 hover:text-yellow-900"
                        title="Mark In Progress"
                      >
                        <FaClock />
                      </button>
                    )}
                    {item.status !== 'resolved' && item.status !== 'closed' && (
                      <button
                        onClick={() => handleStatusUpdate(item.id, 'resolved')}
                        className="text-green-600 hover:text-green-900"
                        title="Mark Resolved"
                      >
                        <FaCheck />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredFeedback.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No feedback found matching your criteria.
        </div>
      )}

      {/* Feedback Detail Modal */}
      {showDetailModal && selectedFeedback && (
        <FeedbackDetailModal
          feedback={selectedFeedback}
          onStatusUpdate={handleStatusUpdate}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedFeedback(null);
          }}
        />
      )}
    </div>
  );
}

// Feedback Detail Modal Component
interface FeedbackDetailModalProps {
  feedback: UserFeedback;
  onStatusUpdate: (feedbackId: string, status: UserFeedback['status'], adminNotes?: string) => void;
  onClose: () => void;
}

function FeedbackDetailModal({ feedback, onStatusUpdate, onClose }: FeedbackDetailModalProps) {
  const [adminNotes, setAdminNotes] = useState(feedback.adminNotes || '');
  const [newStatus, setNewStatus] = useState(feedback.status);

  const handleSave = () => {
    onStatusUpdate(feedback.id, newStatus, adminNotes);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-bold text-gray-800">Feedback Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Feedback Info */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">User Information</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p><strong>Name:</strong> {feedback.userName}</p>
                <p><strong>Email:</strong> {feedback.userEmail}</p>
                <p><strong>User ID:</strong> {feedback.userId}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Feedback Details</h4>
              <div className="bg-gray-50 p-3 rounded-lg space-y-2">
                <p><strong>Subject:</strong> {feedback.subject}</p>
                <p><strong>Type:</strong> {feedback.type}</p>
                <p><strong>Priority:</strong> {feedback.priority}</p>
                <p><strong>Status:</strong> {feedback.status}</p>
                {feedback.rating && (
                  <p><strong>Rating:</strong> {feedback.rating}/5 stars</p>
                )}
                <p><strong>Created:</strong> {feedback.createdAt.toDate().toLocaleString()}</p>
                {feedback.resolvedAt && (
                  <p><strong>Resolved:</strong> {feedback.resolvedAt.toDate().toLocaleString()}</p>
                )}
              </div>
            </div>

            {feedback.contentId && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Related Content</h4>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p><strong>Content Type:</strong> {feedback.contentType}</p>
                  <p><strong>Content ID:</strong> {feedback.contentId}</p>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Message and Admin Actions */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Message</h4>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="whitespace-pre-wrap">{feedback.message}</p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Update Status</h4>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as UserFeedback['status'])}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              >
                <option value="new">New</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Admin Notes</h4>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add internal notes about this feedback..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            {feedback.attachments && feedback.attachments.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Attachments</h4>
                <div className="space-y-2">
                  {feedback.attachments.map((attachment, index) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800 underline"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
