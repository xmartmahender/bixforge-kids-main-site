'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

type CodeStory = {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  programmingLanguage: string;
  ageGroup: string;
  difficulty: string;
  featured: boolean;
  disabled: boolean;
  views: number;
  createdAt: { seconds: number; nanoseconds: number } | null;
};

type CodeVideo = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  programmingLanguage: string;
  ageGroup: string;
  difficulty: string;
  featured: boolean;
  disabled: boolean;
  views: number;
  createdAt: { seconds: number; nanoseconds: number } | null;
};

interface FeaturedCodeStoriesProps {
  selectedAgeGroup?: string;
}

export default function FeaturedCodeStories({ selectedAgeGroup }: FeaturedCodeStoriesProps) {
  const [codeStories, setCodeStories] = useState<CodeStory[]>([]);
  const [codeVideos, setCodeVideos] = useState<CodeVideo[]>([]);
  const [loading, setLoading] = useState(true);

  const getLanguageIcon = (language: string) => {
    const icons: { [key: string]: string } = {
      'html': '🌐',
      'css': '🎨',
      'python': '🐍',
      'javascript': '⚡',
      'scratch': '🧩',
      'java': '☕',
      'cpp': '⚙️'
    };
    return icons[language] || '💻';
  };

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      'html': 'bg-red-100 text-red-800',
      'css': 'bg-blue-100 text-blue-800',
      'python': 'bg-green-100 text-green-800',
      'javascript': 'bg-yellow-100 text-yellow-800',
      'scratch': 'bg-orange-100 text-orange-800',
      'java': 'bg-red-100 text-red-800',
      'cpp': 'bg-gray-100 text-gray-800'
    };
    return colors[language] || 'bg-purple-100 text-purple-800';
  };

  useEffect(() => {
    const fetchCodeContent = async () => {
      try {
        setLoading(true);

        // Build queries for code stories
        let storiesQuery = query(
          collection(db, "stories"),
          where("isCodeStory", "==", true),
          where("isAdminPost", "==", true),
          where("disabled", "==", false),
          orderBy("featured", "desc"),
          orderBy("createdAt", "desc"),
          limit(4)
        );

        // Build queries for code videos
        let videosQuery = query(
          collection(db, "videos"),
          where("isCodeVideo", "==", true),
          where("isAdminPost", "==", true),
          where("disabled", "==", false),
          orderBy("featured", "desc"),
          orderBy("createdAt", "desc"),
          limit(4)
        );

        // If age group is selected, add age filter
        if (selectedAgeGroup && selectedAgeGroup !== '') {
          storiesQuery = query(
            collection(db, "stories"),
            where("isCodeStory", "==", true),
            where("isAdminPost", "==", true),
            where("disabled", "==", false),
            where("ageGroup", "==", selectedAgeGroup),
            orderBy("featured", "desc"),
            orderBy("createdAt", "desc"),
            limit(4)
          );

          videosQuery = query(
            collection(db, "videos"),
            where("isCodeVideo", "==", true),
            where("isAdminPost", "==", true),
            where("disabled", "==", false),
            where("ageGroup", "==", selectedAgeGroup),
            orderBy("featured", "desc"),
            orderBy("createdAt", "desc"),
            limit(4)
          );
        }

        const [storiesSnapshot, videosSnapshot] = await Promise.all([
          getDocs(storiesQuery),
          getDocs(videosQuery)
        ]);

        const stories: CodeStory[] = [];
        const videos: CodeVideo[] = [];

        storiesSnapshot.forEach((doc) => {
          stories.push({ id: doc.id, ...doc.data() } as CodeStory);
        });

        videosSnapshot.forEach((doc) => {
          videos.push({ id: doc.id, ...doc.data() } as CodeVideo);
        });

        setCodeStories(stories);
        setCodeVideos(videos);

        console.log(`🚀 Loaded ${stories.length} featured code stories and ${videos.length} featured code videos`);
      } catch (error) {
        console.error("Error fetching code content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCodeContent();
  }, [selectedAgeGroup]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <div className="text-xl text-purple-600">Loading coding adventures...</div>
        </div>
      </div>
    );
  }

  if (codeStories.length === 0 && codeVideos.length === 0) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-4">
            💻 Code Stories & Programming Adventures
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            No coding content available yet. Check back soon for exciting programming adventures!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/code-stories"
              className="inline-block bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              Browse Code Stories →
            </Link>
            <Link
              href="/code-videos"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Watch Code Videos →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-8 shadow-lg">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-purple-800 mb-4">
          💻 Featured Code Stories & Programming Adventures
        </h2>
        <p className="text-gray-600 text-lg">
          Learn programming through fun, interactive stories and videos designed for young coders!
        </p>
      </div>

      {/* Featured Code Stories */}
      {codeStories.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-purple-700">📚 Interactive Code Stories</h3>
            <Link
              href="/code-stories"
              className="text-purple-600 hover:text-purple-800 font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {codeStories.map((story) => (
              <Link href={`/stories/${story.id}`} key={story.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-40">
                    <img
                      src={story.imageUrl || 'https://placehold.co/300x200/png?text=Code+Story'}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(story.programmingLanguage)}`}>
                        {getLanguageIcon(story.programmingLanguage)} {story.programmingLanguage.toUpperCase()}
                      </span>
                    </div>
                    {story.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{story.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{story.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ages {story.ageGroup}</span>
                      <span>{story.difficulty}</span>
                      <span>{story.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Featured Code Videos */}
      {codeVideos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-blue-700">🎥 Programming Video Tutorials</h3>
            <Link
              href="/code-videos"
              className="text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {codeVideos.map((video) => (
              <Link href={`/videos/${video.id}`} key={video.id}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                  <div className="relative h-40">
                    <img
                      src={video.thumbnailUrl || `https://i3.ytimg.com/vi/${video.videoUrl.split('v=')[1]?.split('&')[0]}/maxresdefault.jpg` || 'https://placehold.co/300x200/png?text=Code+Video'}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLanguageColor(video.programmingLanguage)}`}>
                        {getLanguageIcon(video.programmingLanguage)} {video.programmingLanguage.toUpperCase()}
                      </span>
                    </div>
                    {video.featured && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold">
                          ⭐ Featured
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l8-5-8-5z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-gray-900 mb-2 line-clamp-2">{video.title}</h4>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Ages {video.ageGroup}</span>
                      <span>{video.difficulty}</span>
                      <span>{video.views || 0} views</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
