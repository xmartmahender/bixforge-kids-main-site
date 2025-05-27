'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import Link from 'next/link';
import UserTracker from '../components/UserTracker';
import { Video, getYouTubeVideoId } from '../../lib/videoService';
import { db } from '../../lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

// Programming Languages with age recommendations for videos
const PROGRAMMING_LANGUAGES = {
  'html': {
    name: 'HTML',
    icon: '🌐',
    color: 'bg-red-500',
    description: 'Learn to create web pages with video tutorials',
    ageGroups: {
      '0-3': {
        title: 'HTML Videos for Little Ones',
        description: 'Watch and learn about colors, text, and simple web elements',
        difficulty: 'Beginner',
        concepts: ['Colors', 'Text', 'Images', 'Simple Tags', 'Visual Learning']
      },
      '3-6': {
        title: 'HTML Video Tutorials',
        description: 'Build your first real web pages with step-by-step videos',
        difficulty: 'Easy',
        concepts: ['HTML Tags', 'Headings', 'Paragraphs', 'Links', 'Images', 'Hands-on Practice']
      },
      '6-9': {
        title: 'Web Development Videos',
        description: 'Create interactive web pages with detailed video guides',
        difficulty: 'Intermediate',
        concepts: ['Forms', 'Lists', 'Tables', 'Divs', 'Page Structure', 'Projects']
      },
      '9-12': {
        title: 'Advanced HTML Videos',
        description: 'Master HTML with comprehensive video tutorials',
        difficulty: 'Advanced',
        concepts: ['Semantic HTML', 'Accessibility', 'Meta Tags', 'Advanced Forms', 'Best Practices']
      }
    }
  },
  'python': {
    name: 'Python',
    icon: '🐍',
    color: 'bg-green-500',
    description: 'Learn Python programming with interactive videos',
    ageGroups: {
      '3-6': {
        title: 'Python Videos for Kids',
        description: 'Fun Python videos with colors, shapes, and simple commands',
        difficulty: 'Beginner',
        concepts: ['Print Commands', 'Colors', 'Simple Math', 'Drawing', 'Fun Projects']
      },
      '6-9': {
        title: 'Python Adventure Videos',
        description: 'Learn variables, loops, and create simple games with videos',
        difficulty: 'Easy',
        concepts: ['Variables', 'Input/Output', 'Simple Loops', 'Basic Games', 'Interactive Learning']
      },
      '9-12': {
        title: 'Python Programming Videos',
        description: 'Master functions, lists, and build real projects with video guides',
        difficulty: 'Intermediate',
        concepts: ['Functions', 'Lists', 'Loops', 'Conditionals', 'Real Projects', 'Problem Solving']
      }
    }
  },
  'javascript': {
    name: 'JavaScript',
    icon: '⚡',
    color: 'bg-yellow-500',
    description: 'Make websites interactive with JavaScript video tutorials',
    ageGroups: {
      '6-9': {
        title: 'JavaScript Videos for Kids',
        description: 'Add fun interactions to web pages with easy video tutorials',
        difficulty: 'Easy',
        concepts: ['Alerts', 'Button Clicks', 'Simple Animations', 'Basic Events', 'Interactive Elements']
      },
      '9-12': {
        title: 'Interactive Web Videos',
        description: 'Create games and interactive websites with step-by-step videos',
        difficulty: 'Intermediate',
        concepts: ['DOM Manipulation', 'Events', 'Simple Games', 'Animations', 'User Interaction']
      }
    }
  },
  'css': {
    name: 'CSS',
    icon: '🎨',
    color: 'bg-blue-500',
    description: 'Style and design websites with CSS video tutorials',
    ageGroups: {
      '3-6': {
        title: 'CSS Videos for Beginners',
        description: 'Make web pages colorful and beautiful with easy videos',
        difficulty: 'Beginner',
        concepts: ['Colors', 'Fonts', 'Sizes', 'Basic Styling', 'Visual Design']
      },
      '6-9': {
        title: 'CSS Design Videos',
        description: 'Learn layout and design with comprehensive video tutorials',
        difficulty: 'Easy',
        concepts: ['Layout', 'Positioning', 'Borders', 'Backgrounds', 'Spacing', 'Design Principles']
      },
      '9-12': {
        title: 'Advanced CSS Videos',
        description: 'Master responsive design and animations with video guides',
        difficulty: 'Intermediate',
        concepts: ['Flexbox', 'Grid', 'Animations', 'Responsive Design', 'Media Queries', 'Modern CSS']
      }
    }
  },
  'scratch': {
    name: 'Scratch',
    icon: '🧩',
    color: 'bg-orange-500',
    description: 'Visual programming with Scratch video tutorials',
    ageGroups: {
      '0-3': {
        title: 'Scratch Jr Videos',
        description: 'Drag and drop programming videos for little ones',
        difficulty: 'Beginner',
        concepts: ['Drag & Drop', 'Characters', 'Movement', 'Sounds', 'Stories', 'Visual Learning']
      },
      '3-6': {
        title: 'Scratch Basics Videos',
        description: 'Create animations and simple games with video tutorials',
        difficulty: 'Easy',
        concepts: ['Sprites', 'Costumes', 'Sounds', 'Basic Scripts', 'Animations', 'Creative Projects']
      },
      '6-9': {
        title: 'Scratch Game Videos',
        description: 'Build interactive games and stories with detailed video guides',
        difficulty: 'Intermediate',
        concepts: ['Game Logic', 'Variables', 'Loops', 'Conditionals', 'Interactive Stories', 'Advanced Projects']
      }
    }
  }
};

export default function CodeVideosPage() {
  const [codeVideos, setCodeVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step-by-step selection
  const [step, setStep] = useState(1); // 1: Select Language, 2: Select Age, 3: View Videos
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedAgeGroup, setSelectedAgeGroup] = useState('');
  const [currentCurriculum, setCurrentCurriculum] = useState<{
    title: string;
    description: string;
    difficulty: string;
    concepts: string[];
  } | null>(null);

  const fetchCodeVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      // Query videos with specific language and age group
      const videosQuery = query(
        collection(db, "videos"),
        where("programmingLanguage", "==", selectedLanguage),
        where("ageGroup", "==", selectedAgeGroup)
      );

      const videosSnapshot = await getDocs(videosQuery);
      const videos: Video[] = [];

      videosSnapshot.forEach((doc) => {
        const videoData = { id: doc.id, ...doc.data() } as Video;
        // Only include published videos that are coding-related
        if (!videoData.disabled && (videoData.isCodeVideo || videoData.programmingLanguage)) {
          videos.push(videoData);
        }
      });

      // Sort by creation date (newest first)
      videos.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return b.createdAt.seconds - a.createdAt.seconds;
        }
        return 0;
      });

      setCodeVideos(videos);
    } catch (err) {
      console.error('Error fetching code videos:', err);
      setError('Failed to load code videos. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedLanguage, selectedAgeGroup]);

  // Fetch code videos when language and age are selected
  useEffect(() => {
    if (step === 3 && selectedLanguage && selectedAgeGroup) {
      fetchCodeVideos();
    }
  }, [step, selectedLanguage, selectedAgeGroup, fetchCodeVideos]);

  // Handle language selection
  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    setStep(2);
  };

  // Handle age selection
  const handleAgeSelect = (ageGroup: string) => {
    setSelectedAgeGroup(ageGroup);
    const langData = PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES];
    const curriculum = langData?.ageGroups[ageGroup as keyof typeof langData.ageGroups];
    setCurrentCurriculum(curriculum);
    setStep(3);
  };

  // Reset to start
  const resetSelection = () => {
    setStep(1);
    setSelectedLanguage('');
    setSelectedAgeGroup('');
    setCurrentCurriculum(null);
    setCodeVideos([]);
    setError('');
  };

  return (
    <div>
      <UserTracker contentType="video" contentId={`${selectedLanguage}-${selectedAgeGroup}`} />
      <Header />
      <div className="pt-20 min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center mb-4">
              <span className="text-4xl mr-3">🎥</span>
              <h1 className="text-4xl md:text-5xl font-bold">Code Videos</h1>
            </div>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Learn programming with step-by-step video tutorials designed for your age!
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Video tutorials</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Step-by-step learning</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">✅</span>
                <span>Age-appropriate content</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-16">
          {/* Progress Steps */}
          <div className="flex justify-center items-center space-x-4 mb-12">
            <div className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${step >= 1 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white text-gray-500 shadow-md'}`}>
              <span className="font-bold">1</span>
              <span>Choose Language</span>
            </div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${step >= 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white text-gray-500 shadow-md'}`}>
              <span className="font-bold">2</span>
              <span>Select Age</span>
            </div>
            <div className="w-8 h-1 bg-gray-300 rounded"></div>
            <div className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${step >= 3 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' : 'bg-white text-gray-500 shadow-md'}`}>
              <span className="font-bold">3</span>
              <span>Watch & Learn</span>
            </div>
          </div>

        {/* Step 1: Choose Programming Language */}
        {step === 1 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
              🎯 Choose Your Programming Language
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Pick a programming language you want to learn with videos!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Object.entries(PROGRAMMING_LANGUAGES).map(([key, lang]) => (
                <div
                  key={key}
                  onClick={() => handleLanguageSelect(key)}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 border-2 border-gray-200 hover:border-purple-300"
                >
                  <div className="p-8">
                    <div className="text-center mb-6">
                      <div className="text-4xl mb-3">{lang.icon}</div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{lang.name}</h3>
                      <p className="text-gray-600 text-sm mb-4">{lang.description}</p>

                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${lang.color.replace('bg-', 'bg-').replace('-500', '-100')} ${lang.color.replace('bg-', 'text-').replace('-500', '-600')}`}>
                        Video Tutorials
                      </div>
                    </div>

                    <button className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center space-x-2">
                      <span>🎥</span>
                      <span>Watch Videos</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Choose Age Group */}
        {step === 2 && selectedLanguage && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-red-600 hover:text-red-800 mb-4 inline-flex items-center"
              >
                ← Change Language
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                👶 Select Your Age Group
              </h2>
              <p className="text-gray-600 mb-2">
                Learning <span className="font-bold text-red-600">
                  {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.name}
                </span> with videos
              </p>
              <p className="text-gray-500 text-sm">
                Choose your age to get the perfect video tutorials!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.ageGroups || {}).map(([ageGroup, curriculum]) => (
                <div
                  key={ageGroup}
                  onClick={() => handleAgeSelect(ageGroup)}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 border-2 border-transparent hover:border-green-300"
                >
                  <div className="p-6">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Ages {ageGroup}
                      </h3>
                      <h4 className="text-lg font-semibold text-red-600 mb-2">
                        {curriculum.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-3">
                        {curriculum.description}
                      </p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                        curriculum.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                        curriculum.difficulty === 'Easy' ? 'bg-blue-100 text-blue-800' :
                        curriculum.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {curriculum.difficulty}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h5 className="font-semibold text-gray-700 mb-2">Video Topics:</h5>
                      <div className="flex flex-wrap gap-1">
                        {curriculum.concepts.map((concept: string, index: number) => (
                          <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-center">
                      <span className="inline-block bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
                        🎥 Watch Videos!
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: View Code Videos */}
        {step === 3 && selectedLanguage && selectedAgeGroup && (
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <div className="flex justify-center space-x-4 mb-4">
                <button
                  onClick={() => setStep(1)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ← Change Language
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  ← Change Age
                </button>
                <button
                  onClick={resetSelection}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  🔄 Start Over
                </button>
              </div>

              <div className="bg-gradient-to-r from-red-100 to-purple-100 rounded-xl p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  🎥 Perfect! Here&apos;s Your Video Learning Path
                </h2>
                <div className="flex justify-center items-center space-x-4 mb-4">
                  <span className={`${PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.color} text-white px-4 py-2 rounded-full font-bold`}>
                    {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.icon} {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.name}
                  </span>
                  <span className="text-gray-500">for</span>
                  <span className="bg-green-500 text-white px-4 py-2 rounded-full font-bold">
                    👶 Ages {selectedAgeGroup}
                  </span>
                </div>

                {currentCurriculum && (
                  <div className="bg-white rounded-lg p-4 mt-4">
                    <h3 className="font-bold text-lg text-red-600 mb-2">{currentCurriculum.title}</h3>
                    <p className="text-gray-600 mb-3">{currentCurriculum.description}</p>
                    <div className="flex flex-wrap justify-center gap-2">
                      {currentCurriculum.concepts.map((concept: string, index: number) => (
                        <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {concept}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Loading and Error States */}
            {loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⏳</div>
                <p className="text-lg text-gray-600">Loading your coding videos...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">😞</div>
                <p className="text-lg text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchCodeVideos}
                  className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* No Videos Found */}
            {!loading && !error && codeVideos.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🎥</div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No Videos Yet!</h3>
                <p className="text-gray-600 mb-6">
                  We&apos;re still creating {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.name} videos for ages {selectedAgeGroup}.
                  <br />
                  Check back soon or try a different age group!
                </p>
                <div className="space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Try Different Age
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Try Different Language
                  </button>
                </div>
              </div>
            )}

            {/* Videos Grid */}
            {!loading && !error && codeVideos.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-center mb-6 text-gray-800">
                  🎥 Your Video Learning Journey ({codeVideos.length} videos)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {codeVideos.map(video => {
                    const videoId = getYouTubeVideoId(video.videoUrl);

                    return (
                      <Link href={`/videos/${video.id}`} key={video.id}>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 h-full flex flex-col transform hover:scale-105">
                          <div className="relative h-48 w-full">
                            <img
                              src={video.thumbnailUrl || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` || 'https://placehold.co/400x300/png?text=Code+Video'}
                              alt={video.title}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="bg-black bg-opacity-50 rounded-full p-4 hover:bg-black/70 transition-all">
                                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8 5v14l11-7z" />
                                </svg>
                              </div>
                            </div>
                            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs rounded-lg font-bold">
                              Ages {video.ageGroup}
                            </div>
                            <div className={`absolute bottom-2 left-2 text-white px-2 py-1 text-xs rounded-lg font-bold ${PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.color}`}>
                              {PROGRAMMING_LANGUAGES[selectedLanguage as keyof typeof PROGRAMMING_LANGUAGES]?.icon} {video.programmingLanguage || selectedLanguage}
                            </div>
                          </div>
                          <div className="p-4 flex-grow">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">{video.title}</h3>
                            <p className="text-gray-600 text-sm line-clamp-3">{video.description}</p>
                          </div>
                          <div className="px-4 pb-4">
                            <span className="inline-block bg-gradient-to-r from-red-500 to-purple-500 text-white text-sm px-4 py-2 rounded-full font-medium w-full text-center">
                              🎥 Watch Now!
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
