// File: C:\Users\PMYLS\Desktop\Mahendar Website\Mahendar Website\src\components\StoryCard.tsx
import React, { useState, useEffect } from 'react';

// Update the interface to include code story properties
interface StoryProps {
  id: string;       // Add this line to define the id prop
  title: string;
  link: string;
  ageGroup: string;
  coverUrl: string;
  description?: string;
  content?: string;
  category?: string[];
  illustrations?: string[];
  audioUrl?: string;
  language?: string;
  isCodeStory?: boolean;
  codeSnippet?: string;
  programmingLanguage?: string;
}

export function StoryCard({
  title,
  link,
  ageGroup,
  coverUrl,
  description,
  content,
  category,
  illustrations,
  audioUrl,
  language = "English",
  isCodeStory,
  codeSnippet,
  programmingLanguage
}: StoryProps) {
  const [imageError, setImageError] = useState(false);
  const [validLink, setValidLink] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(language);

  // Available languages
  const languages = ["English", "Urdu", "Hindi", "Sindhi"];

  // Pre-validate the image
  useEffect(() => {
    // Check if the URL is valid before even trying to load it
    if (!coverUrl || coverUrl === "") {
      setImageError(true);
      return;
    }

    // For Firebase storage URLs that might have CORS issues, we'll pre-validate
    if (coverUrl.includes("firebasestorage.googleapis.com")) {
      const img = new Image();
      img.onload = () => setImageError(false);
      img.onerror = () => setImageError(true);
      img.src = coverUrl;
    }
  }, [coverUrl]);

  // Pre-validate the link
  useEffect(() => {
    if (!link || link === "" || !link.startsWith("http")) {
      setValidLink(false);
    }
  }, [link]);

  // Check if story is in favorites on load
  useEffect(() => {
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteStories') || '[]');
      const isInFavorites = favorites.some((fav: { title: string }) => fav.title === title);
      setIsFavorite(isInFavorites);
    } catch (error) {
      console.error('Error checking favorites:', error);
    }
  }, [title]);

  // Handle the card click to toggle content view
  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowContent(!showContent);
  };

  // Handle the external link click
  const handleExternalLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!validLink) {
      e.preventDefault();
      alert("Sorry, this story link is not available.");
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);

    // Save to localStorage for persistence
    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteStories') || '[]');
      if (isFavorite) {
        // Remove from favorites
        const newFavorites = favorites.filter((fav: { title: string }) => fav.title !== title);
        localStorage.setItem('favoriteStories', JSON.stringify(newFavorites));
      } else {
        // Add to favorites
        favorites.push({ title, coverUrl, ageGroup });
        localStorage.setItem('favoriteStories', JSON.stringify(favorites));
      }
    } catch (error) {
      console.error('Error saving favorite:', error);
    }
  };

  // Get category color classes
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

  // Function to format content with emphasis on emotions/sound effects
  const formatStoryContent = (text: string) => {
    if (!text) return null;

    // Replace patterns with styled versions
    const formattedParts = text.split('\n').map((paragraph, i) => {
      // Process sound effects (all caps with exclamation)
      let processed = paragraph.replace(/\b([A-Z]{2,}!+)\b/g,
        '<span class="text-xl font-bold text-red-500">$1</span>'
      );

      // Process emphasized text
      processed = processed.replace(/\*([^*]+)\*/g,
        '<span class="text-purple-600 font-semibold">$1</span>'
      );

      // Process dialogue
      processed = processed.replace(/"([^"]+)"/g,
        '<span class="text-blue-600">"$1"</span>'
      );

      return <p
        key={i}
        className="mb-4 text-lg"
        dangerouslySetInnerHTML={{ __html: processed }}
      />;
    });

    return <div>{formattedParts}</div>;
  };

  return (
    <div
      className="story-card"
      onClick={handleCardClick}
      style={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        transform: showContent ? 'scale(1.02)' : 'scale(1)',
        maxWidth: '100%',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: showContent ? '0 10px 25px rgba(0,0,0,0.15)' : '0 4px 15px rgba(0,0,0,0.08)',
        backgroundColor: 'white'
      }}
    >
      {!showContent ? (
        // Card view (collapsed)
        <>
          <div className="relative">
            {/* Code story tag */}
            {isCodeStory && (
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-2 py-1 text-xs rounded-bl z-10">
                Code Tutorial
              </div>
            )}

            {/* Favorite button */}
            <button
              onClick={toggleFavorite}
              className="absolute top-2 left-2 z-10 bg-white bg-opacity-70 rounded-full p-1"
            >
              {isFavorite ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              )}
            </button>

            {/* Cover image */}
            <img
              src={imageError ? "https://placehold.co/400x300/eee/999?text=Story+Cover" : coverUrl}
              alt={title}
              onError={() => setImageError(true)}
              loading="lazy"
              className="w-full h-52 object-cover"
            />

            {/* Age group badge */}
            <div className="absolute bottom-2 left-2 bg-white bg-opacity-80 px-2 py-1 rounded-full text-xs font-medium text-purple-800">
              Ages {ageGroup}
            </div>
          </div>

          <div className="p-4">
            {/* Title with colorful gradient */}
            <h3 className="text-lg font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {title}
            </h3>

            {/* Description */}
            {description && (
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {description}
              </p>
            )}

            {/* Categories */}
            {category && category.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {category.map((cat, idx) => (
                  <span
                    key={idx}
                    className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(cat)}`}>
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Audio indicator if available */}
            {audioUrl && (
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                </svg>
                Audio Available
              </div>
            )}

            {/* Programming language if it's a code story */}
            {isCodeStory && programmingLanguage && (
              <div className="text-sm mb-3">
                <span className="font-medium">Language:</span> {programmingLanguage}
              </div>
            )}

            <div className="flex justify-center mt-3">
              <button
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                {isCodeStory ? "Open Tutorial" : "Read Story"}
              </button>
            </div>
          </div>
        </>
      ) : (
        // Expanded view (story content)
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              {title}
            </h2>

            <div className="flex gap-2">
              {/* Favorite button */}
              <button
                onClick={toggleFavorite}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                {isFavorite ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-red-500">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                  </svg>
                )}
              </button>

              {/* Close button */}
              <button
                onClick={() => setShowContent(false)}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Meta information */}
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              Ages {ageGroup}
            </span>

            {category && category.map((cat, idx) => (
              <span
                key={idx}
                className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(cat)}`}>
                {cat}
              </span>
            ))}
          </div>

          {/* Language selector */}
          <div className="mb-4 flex items-center">
            <label className="text-sm font-medium text-gray-700 mr-2">Language:</label>
            <select
              value={currentLanguage}
              onChange={(e) => setCurrentLanguage(e.target.value)}
              className="border rounded p-1 text-sm"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>

          {/* Main cover image */}
          <div className="rounded-lg overflow-hidden mb-6">
            <img
              src={imageError ? "https://placehold.co/800x400/eee/999?text=Story+Cover" : coverUrl}
              alt={title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Description */}
          {description && (
            <div className="bg-purple-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 italic">{description}</p>
            </div>
          )}

          {/* Audio player if available */}
          {audioUrl && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Listen to the Story</h3>
              <audio controls className="w-full">
                <source src={audioUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          )}

          {/* Story content or code snippet */}
          {isCodeStory ? (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Code Tutorial</h3>
              <div className="bg-gray-800 text-gray-100 p-4 rounded-lg overflow-x-auto">
                <pre className="font-mono text-sm">
                  {codeSnippet || "No code snippet available"}
                </pre>
              </div>
            </div>
          ) : (
            <div className="story-content mb-6">
              <h3 className="text-lg font-semibold mb-2">Story</h3>
              {content ? (
                formatStoryContent(content)
              ) : (
                <p className="text-gray-500">Full story available via the link below.</p>
              )}
            </div>
          )}

          {/* Additional illustrations */}
          {illustrations && illustrations.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Illustrations</h3>
              <div className="grid grid-cols-2 gap-4">
                {illustrations.map((img, idx) => (
                  <div key={idx} className="rounded overflow-hidden">
                    <img
                      src={img}
                      alt={`Illustration ${idx + 1}`}
                      className="w-full h-auto"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x300/eee/999?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quiz or moral question */}
          <div className="bg-yellow-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-semibold mb-2">Think About It</h3>
            <p className="text-gray-700">
              What did you learn from this {isCodeStory ? 'tutorial' : 'story'}?
            </p>
          </div>

          {/* External link button */}
          {validLink && (
            <div className="flex justify-center">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleExternalLinkClick}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-200"
              >
                {isCodeStory ? "Open Full Tutorial" : "Open Full Story"}
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// New component for displaying a grid of story cards
export function StoryCardGrid({
  stories,
  filterCodeStories = false,
  programmingLanguage = undefined
}: {
  stories: StoryProps[],
  filterCodeStories?: boolean,
  programmingLanguage?: string
}) {
  // Apply filtering based on props
  const filteredStories = stories.filter(story => {
    // If we're filtering code stories
    if (filterCodeStories) {
      // Show only code stories
      if (!story.isCodeStory) return false;

      // If programming language is specified, filter by it
      if (programmingLanguage && programmingLanguage !== 'all') {
        return story.programmingLanguage?.toLowerCase() === programmingLanguage.toLowerCase();
      }

      return true;
    } else {
      // Show only non-code stories
      return !story.isCodeStory;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStories.map(story => (
        <StoryCard
          key={story.id}
          id={story.id}
          title={story.title}
          link={story.link || '#'}
          ageGroup={story.ageGroup || ''}
          coverUrl={story.coverUrl || ''}
          isCodeStory={story.isCodeStory}
          programmingLanguage={story.programmingLanguage}
        />
      ))}
    </div>
  );
}