// File: C:\Users\PMYLS\Desktop\Mahendar Website\Clone-childrens-website\childrens-clone\src\components\StorySection.tsx
import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import Link from "next/link";

// Define a Story type to improve TypeScript support
interface Story {
  id: string;
  title: string;
  ageGroup: string;
  coverUrl?: string;
  description?: string;
  category?: string[];
  disabled?: boolean;
  createdAt?: { seconds: number };
  language?: string;
}

interface StorySectionProps {
  title: string;
  ageGroup?: string;
}

export function StorySection({ title, ageGroup }: StorySectionProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        console.log(`[StorySection] Fetching stories for age group: ${ageGroup || 'all'}`);
        setLoading(true);

        // Use a simpler query that doesn't require a composite index
        const storiesQuery = query(
          collection(db, "stories"),
          where("ageGroup", "==", ageGroup)
          // Remove the disabled filter from the query
        );

        console.log(`[StorySection] Executing query...`);
        const querySnapshot = await getDocs(storiesQuery);
        console.log(`[StorySection] Query complete. Found ${querySnapshot.size} stories.`);

        const storiesData: Story[] = [];

        querySnapshot.forEach((doc) => {
          const storyData = { id: doc.id, ...doc.data() } as Story;
          // Filter out disabled stories in JavaScript
          if (!storyData.disabled) {
            storiesData.push(storyData);
          }
        });

        console.log(`[StorySection] After filtering disabled: ${storiesData.length} stories`);

        // Sort manually
        storiesData.sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return b.createdAt.seconds - a.createdAt.seconds;
          }
          return 0;
        });

        setStories(storiesData);
      } catch (error) {
        console.error(`[StorySection] Failed to load stories for ${ageGroup || 'all'}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [ageGroup]);

  // This helps troubleshoot why no stories are showing
  if (stories.length === 0 && !loading) {
    return (
      <section className="py-8">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">{title}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-center text-gray-600">
              No stories found for this age group.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Get the color for age group tag
  const getAgeGroupColor = (age: string) => {
    switch(age) {
      case '0-3': return 'bg-blue-100 text-blue-800';
      case '3-6': return 'bg-green-100 text-green-800';
      case '6-9': return 'bg-yellow-100 text-yellow-800';
      case '9-12': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get color classes for categories
  const getCategoryColor = (category: string) => {
    const categories: Record<string, string> = {
      'Adventure': 'bg-indigo-100 text-indigo-800',
      'Fairy Tale': 'bg-pink-100 text-pink-800',
      'Animal': 'bg-green-100 text-green-800',
      'Moral': 'bg-orange-100 text-orange-800',
      'Funny': 'bg-yellow-100 text-yellow-800',
      'Educational': 'bg-blue-100 text-blue-800',
    };
    return categories[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          {title}
        </h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="text-xl text-purple-600">Loading stories...</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {stories.map((story) => (
              <Link href={`/stories/${story.id}`} key={story.id} className="block">
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:-translate-y-1">
                  <div className="h-48 overflow-hidden relative">
                    <img
                      src={story.coverUrl || "https://placehold.co/400x200?text=Story+Cover"}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x200?text=Story+Cover";
                      }}
                    />
                    <div className="absolute bottom-0 left-0 p-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getAgeGroupColor(story.ageGroup)}`}>
                        Ages {story.ageGroup}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow">
                    <h3 className="text-xl font-semibold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                      {story.title}
                    </h3>

                    {story.description && (
                      <p className="text-gray-600 mb-4 text-sm">
                        {story.description.length > 100
                          ? `${story.description.substring(0, 100)}...`
                          : story.description}
                      </p>
                    )}

                    {/* Categories/tags */}
                    {story.category && story.category.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {story.category.map((cat, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(cat)}`}
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-3">
                      <span className="inline-flex items-center text-sm text-purple-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Read Story
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}