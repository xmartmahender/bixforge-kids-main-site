'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video } from '../../lib/videoService';
import { db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

interface VideoDetailProps {
  videoId: string;
}

export default function VideoDetail({ videoId }: VideoDetailProps) {
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!videoId) return;

    const fetchVideo = async () => {
      try {
        setLoading(true);
        const videoDoc = await getDoc(doc(db, "videos", videoId));

        if (videoDoc.exists()) {
          setVideo({ id: videoDoc.id, ...videoDoc.data() } as Video);
        } else {
          setError("Video not found");
        }
      } catch (err) {
        console.error("Error loading video", err);
        setError("Failed to load video");
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading video...</div>;
  }

  if (error || !video) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="text-red-500 mb-4">{error || "Video not found"}</div>
        <Link href="/" className="text-pink-500 hover:underline">Return to home</Link>
      </div>
    );
  }

  // Extract YouTube video ID if it's a YouTube URL
  const getYoutubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const embedUrl = getYoutubeEmbedUrl(video.videoUrl);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="inline-flex items-center text-pink-600 hover:text-pink-800 transition-colors group">
            <svg className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Videos
          </Link>

          {/* Share Button */}
          <button className="inline-flex items-center px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            Share
          </button>
        </div>

        {/* Video Player Section */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
          {/* Video Player */}
          <div className="relative bg-black">
            <div className="aspect-w-16 aspect-h-9 relative">
              <iframe
                src={embedUrl}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-96 md:h-[500px] lg:h-[600px]"
              ></iframe>
            </div>

            {/* Video Type Badge */}
            <div className="absolute top-4 left-4">
              <span className="bg-white/90 backdrop-blur-sm text-pink-700 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                {video.isCodeVideo ? '💻 Code Video' : '🎥 Video'}
              </span>
            </div>

            {/* Age Group Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                👶 Ages {video.ageGroup}
              </span>
            </div>
          </div>

          {/* Video Info */}
          <div className="p-6 md:p-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 leading-tight">
              {video.title}
            </h1>

            {/* Video Meta */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                5-10 minutes
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Perfect for ages {video.ageGroup}
              </div>
              {video.programmingLanguage && (
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  {video.programmingLanguage.toUpperCase()}
                </div>
              )}
            </div>

            {/* Video Description */}
            {video.description && (
              <div className="bg-gradient-to-r from-pink-100 to-purple-100 p-6 rounded-xl border-l-4 border-pink-500">
                <h3 className="font-semibold text-gray-800 mb-2">About this video:</h3>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Practice Code Section - Only for Code Videos */}
        {video.isCodeVideo && video.programmingLanguage && (
          <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl shadow-xl p-6 md:p-8 border border-green-200">
            <div className="text-center">
              <div className="text-6xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Ready to Code Along?</h3>
              <p className="text-lg text-gray-600 mb-6">
                Now that you&apos;ve watched this {video.programmingLanguage.toUpperCase()} tutorial,
                practice what you learned in our interactive code editor!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={`/code-playground?language=${video.programmingLanguage}&age=${video.ageGroup}`}
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                  Try {video.programmingLanguage.toUpperCase()} Code
                </Link>
                <Link
                  href="/code-videos"
                  className="inline-flex items-center px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-xl font-semibold hover:bg-green-50 transition-all duration-300"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  More Code Videos
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Related Videos Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">More Videos You Might Like</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Placeholder for related videos */}
            <div className="text-center py-8 text-gray-500">
              <p>Related videos coming soon!</p>
            </div>
          </div>
        </div>

        {/* Video Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Enjoyed this video?</h3>
          <div className="flex flex-wrap gap-4">
            <button className="flex items-center px-6 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Like this video
            </button>
            <button className="flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save for later
            </button>
            <Link href="/code-videos" className="flex items-center px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
              </svg>
              More Code Videos
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}