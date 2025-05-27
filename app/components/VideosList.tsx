'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Video, getVideos } from '../../lib/videoService';

interface VideosListProps {
  selectedAgeGroup?: string;
  showAdminContent?: boolean;
}

export default function VideosList({ selectedAgeGroup = '', showAdminContent = false }: VideosListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);

        // Use the updated videoService that includes admin content
        const videosData = await getVideos(selectedAgeGroup, 50, 'english'); // Get all videos including admin content
        setVideos(videosData);

        console.log(`🎥 Loaded ${videosData.length} videos (including admin content)`);
        setError('');
      } catch (err) {
        console.error('Error fetching videos:', err);
        setError('Failed to load videos. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [selectedAgeGroup, showAdminContent]);

  if (loading) {
    return <div className="p-4 text-center">Loading videos...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  if (videos.length === 0) {
    return <div className="p-4 text-center">
      {showAdminContent
        ? 'No videos have been added by the admin yet. Check back later!'
        : selectedAgeGroup
          ? `No videos found for age group ${selectedAgeGroup}.`
          : 'No videos found.'
      }
    </div>;
  }

  // Function to extract YouTube video ID
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Group videos by age group
  const videosByAgeGroup = videos.reduce((acc, video) => {
    const ageGroup = video.ageGroup || 'Other';
    if (!acc[ageGroup]) {
      acc[ageGroup] = [];
    }
    acc[ageGroup].push(video);
    return acc;
  }, {} as Record<string, Video[]>);

  // Sort age groups in a specific order
  const ageGroupOrder = ['0-3', '3-6', '6-9', '9-12', 'Other'];
  const sortedAgeGroups = Object.keys(videosByAgeGroup).sort(
    (a, b) => ageGroupOrder.indexOf(a) - ageGroupOrder.indexOf(b)
  );

  return (
    <div className="p-4 bg-pink-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-pink-800">Videos</h2>

      {sortedAgeGroups.map(ageGroup => (
        <div key={ageGroup} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Ages {ageGroup}
            </div>
            <div className="h-px bg-gray-200 flex-1"></div>
            <span className="text-sm text-gray-500">{videosByAgeGroup[ageGroup].length} videos</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videosByAgeGroup[ageGroup].map(video => {
              const videoId = getYouTubeVideoId(video.videoUrl);

              return (
                <Link href={`/videos/${video.id}`} key={video.id}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                    <div className="relative h-48 w-full">
                      <img
                        src={video.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` || 'https://placehold.co/400x300/png?text=Video'}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black bg-opacity-50 rounded-full p-3">
                          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-2 text-pink-700">{video.title}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
