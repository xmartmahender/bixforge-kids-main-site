'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import VideoDetail from '../../components/VideoDetail';
import UserTracker from '../../components/UserTracker';

export default function VideoPage({ params }: { params: Promise<{ id: string }> }) {
  const [videoId, setVideoId] = React.useState<string>('');

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setVideoId(resolvedParams.id);
    });
  }, [params]);

  if (!videoId) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading video...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <UserTracker contentType="video" contentId={videoId} />
      <Header />
      <div className="pt-20"> {/* Add padding for fixed header */}
        <VideoDetail videoId={videoId} />
      </div>
      <Footer />
    </div>
  );
}
