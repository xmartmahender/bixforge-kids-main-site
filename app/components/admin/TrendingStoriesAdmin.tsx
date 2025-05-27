'use client';

import React, { useState, useEffect } from 'react';
import {
  getAllTrendingStories,
  addTrendingStory,
  updateTrendingStory,
  deleteTrendingStory,
  toggleTrendingStoryStatus,
  TrendingStory
} from '../../../lib/storyService';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaFire,
  FaHeart,
  FaSave,
  FaTimes,
  FaStar
} from 'react-icons/fa';

export default function TrendingStoriesAdmin() {
  const [trendingStories, setTrendingStories] = useState<TrendingStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingStory, setEditingStory] = useState<TrendingStory | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    ageGroup: '3-6',
    category: '',
    views: 0,
    likes: 0,
    priority: 1,
    isActive: true,
    storyId: ''
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchTrendingStories();
  }, []);

  const fetchTrendingStories = async () => {
    try {
      setLoading(true);
      const stories = await getAllTrendingStories();
      setTrendingStories(stories);
      setError('');
    } catch (err) {
      console.error('Error fetching trending stories:', err);
      setError('Failed to load trending stories');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      ageGroup: '3-6',
      category: '',
      views: 0,
      likes: 0,
      priority: 1,
      isActive: true,
      storyId: ''
    });
    setCoverFile(null);
    setEditingStory(null);
    setShowAddForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Handle category - convert string to array if needed
      let categoryArray: string[] = [];
      if (typeof formData.category === 'string') {
        categoryArray = formData.category.split(',').map(cat => cat.trim()).filter(cat => cat);
      } else if (Array.isArray(formData.category)) {
        categoryArray = formData.category;
      }

      const storyData = {
        ...formData,
        category: categoryArray
      };

      if (editingStory) {
        await updateTrendingStory(editingStory.id!, storyData, coverFile || undefined);
      } else {
        await addTrendingStory(storyData, coverFile || undefined);
      }

      await fetchTrendingStories();
      resetForm();
    } catch (err) {
      console.error('Error saving trending story:', err);
      setError('Failed to save trending story');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (story: TrendingStory) => {
    // Handle category - convert to string for form
    let categoryString = '';
    if (Array.isArray(story.category)) {
      categoryString = story.category.join(', ');
    } else if (typeof story.category === 'string') {
      categoryString = story.category;
    }

    setFormData({
      title: story.title,
      description: story.description,
      imageUrl: story.imageUrl,
      ageGroup: story.ageGroup,
      category: categoryString,
      views: story.views,
      likes: story.likes,
      priority: story.priority,
      isActive: story.isActive,
      storyId: story.storyId || ''
    });
    setEditingStory(story);
    setShowAddForm(true);
  };

  const handleDelete = async (story: TrendingStory) => {
    if (window.confirm(`Are you sure you want to delete "${story.title}"?`)) {
      try {
        await deleteTrendingStory(story.id!, story.imageUrl);
        await fetchTrendingStories();
      } catch (err) {
        console.error('Error deleting trending story:', err);
        setError('Failed to delete trending story');
      }
    }
  };

  const handleToggleStatus = async (story: TrendingStory) => {
    try {
      await toggleTrendingStoryStatus(story.id!, !story.isActive);
      await fetchTrendingStories();
    } catch (err) {
      console.error('Error toggling story status:', err);
      setError('Failed to update story status');
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center mb-6">
          <FaFire className="text-2xl text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold">Trending Stories Management</h2>
        </div>
        <div className="text-center py-8">Loading trending stories...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <FaFire className="text-2xl text-orange-500 mr-3" />
          <h2 className="text-2xl font-bold">Trending Stories Management</h2>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <FaPlus className="mr-2" />
          Add Trending Story
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white border rounded-lg p-6 mb-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">
              {editingStory ? 'Edit Trending Story' : 'Add New Trending Story'}
            </h3>
            <button
              onClick={resetForm}
              className="text-gray-500 hover:text-gray-700"
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age Group *
                </label>
                <select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleInputChange}
                  required
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="0-3">0-3 years</option>
                  <option value="3-6">3-6 years</option>
                  <option value="6-9">6-9 years</option>
                  <option value="9-12">9-12 years</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Views
                </label>
                <input
                  type="number"
                  name="views"
                  value={formData.views}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Likes
                </label>
                <input
                  type="number"
                  name="likes"
                  value={formData.likes}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority (1-10)
                </label>
                <input
                  type="number"
                  name="priority"
                  value={formData.priority}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  placeholder="adventure, fantasy, educational"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Story ID (optional)
                </label>
                <input
                  type="text"
                  name="storyId"
                  value={formData.storyId}
                  onChange={handleInputChange}
                  placeholder="Link to existing story"
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
              {formData.imageUrl && (
                <div className="mt-2">
                  <img src={formData.imageUrl} alt="Current cover" className="w-20 h-20 object-cover rounded" />
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="mr-2"
              />
              <label className="text-sm font-medium text-gray-700">
                Active (visible on main site)
              </label>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={submitting}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center disabled:opacity-50"
              >
                <FaSave className="mr-2" />
                {submitting ? 'Saving...' : (editingStory ? 'Update' : 'Add')} Story
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stories List */}
      <div className="bg-white border rounded-lg overflow-hidden shadow-md">
        <div className="p-4 bg-gray-50 border-b">
          <h3 className="font-bold text-lg">Trending Stories ({trendingStories.length})</h3>
        </div>

        {trendingStories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaFire className="text-4xl mx-auto mb-4 text-gray-300" />
            <p>No trending stories yet. Add your first trending story!</p>
          </div>
        ) : (
          <div className="divide-y">
            {trendingStories.map((story) => (
              <div key={story.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h4 className="font-bold text-lg mr-3">{story.title}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        story.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {story.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {story.priority > 5 && (
                        <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center">
                          <FaStar className="mr-1" />
                          High Priority
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-2">{story.description}</p>

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {story.ageGroup} years
                      </span>
                      <span className="flex items-center">
                        <FaEye className="mr-1" />
                        {story.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center">
                        <FaHeart className="mr-1 text-red-500" />
                        {story.likes.toLocaleString()} likes
                      </span>
                      <span>Priority: {story.priority}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    {story.imageUrl && (
                      <img src={story.imageUrl} alt={story.title} className="w-16 h-16 object-cover rounded" />
                    )}

                    <div className="flex flex-col space-y-1">
                      <button
                        onClick={() => handleToggleStatus(story)}
                        className={`p-2 rounded ${
                          story.isActive ? 'bg-red-100 text-red-600 hover:bg-red-200' : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                        title={story.isActive ? 'Disable' : 'Enable'}
                      >
                        {story.isActive ? <FaEyeSlash /> : <FaEye />}
                      </button>

                      <button
                        onClick={() => handleEdit(story)}
                        className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>

                      <button
                        onClick={() => handleDelete(story)}
                        className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
