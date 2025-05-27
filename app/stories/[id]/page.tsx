'use client';

import React from 'react';
import Header from '../../components/header';
import Footer from '../../components/footer';
import StoryDetail from '../../components/StoryDetail';
import UserTracker from '../../components/UserTracker';

export default function StoryPage({ params }: { params: Promise<{ id: string }> }) {
  const [storyId, setStoryId] = React.useState<string>('');

  React.useEffect(() => {
    params.then((resolvedParams) => {
      setStoryId(resolvedParams.id);
    });
  }, [params]);

  if (!storyId) {
    return (
      <div>
        <Header />
        <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading story...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div>
      <UserTracker contentType="story" contentId={storyId} />
      <Header />
      <div className="pt-20"> {/* Add padding for fixed header */}
        <StoryDetail storyId={storyId} />
      </div>
      <Footer />
    </div>
  );
}
