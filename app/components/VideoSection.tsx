// File: C:\Users\PMYLS\Desktop\Mahendar Website\Clone-childrens-website\childrens-clone\src\components\VideoSection.tsx
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, orderBy, limit, where } from "firebase/firestore";
import Link from "next/link";

interface VideoSectionProps {
  title: string;
  ageGroup?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  ageGroup: string;
}

export function VideoSection({ title, ageGroup }: VideoSectionProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log("Fetching videos...", ageGroup ? `for age group ${ageGroup}` : "all videos");
        setLoading(true);

        // Build query based on whether we have an age group filter
        let q;
        if (ageGroup) {
          q = query(
            collection(db, "videos"),
            where("ageGroup", "==", ageGroup),
            orderBy("createdAt", "desc"),
            limit(6)
          );
        } else {
          q = query(
            collection(db, "videos"),
            orderBy("createdAt", "desc"),
            limit(6)
          );
        }

        const querySnapshot = await getDocs(q);
        const videosData: Video[] = [];

        querySnapshot.forEach((doc) => {
          videosData.push({ id: doc.id, ...doc.data() } as Video);
        });

        setVideos(videosData);
        console.log("Fetched videos data:", videosData.length, "videos");
      } catch (error) {
        console.error(`Failed to load videos for ${ageGroup || "all ages"}`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [ageGroup]);

  // Don't return the section if no videos and not loading
  if (videos.length === 0 && !loading) {
    return null;
  }

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-xl text-purple-600">Loading videos...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="h-48 overflow-hidden relative">
                  <img
                    src={video.thumbnailUrl || "https://via.placeholder.com/400x300?text=Video"}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" fillRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold mb-2 text-purple-900">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <Link
                    href={`/videos/${video.id}`}
                    className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors"
                  >
                    Watch Video
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}