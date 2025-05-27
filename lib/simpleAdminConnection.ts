// lib/simpleAdminConnection.ts
// Simple connection to the specific admin dashboard at kidz-zone-admin/index.html

import { db } from "./firebase";
import {
  collection, getDocs, query, orderBy, where, Timestamp
} from "firebase/firestore";

// Simple types for admin content
export interface SimpleAdminStory {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  language: string;
  ageGroup: string;
  thumbnailUrl?: string;
  featured: boolean;
  disabled: boolean;
  views: number;
  isAdminPost: boolean;
  createdAt: Timestamp;
}

export interface SimpleAdminVideo {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  category: string;
  language: string;
  ageGroup: string;
  thumbnailUrl?: string;
  featured: boolean;
  disabled: boolean;
  views: number;
  isAdminPost: boolean;
  createdAt: Timestamp;
}

export interface SimpleAdminTrendingStory {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  ageGroup: string;
  category: string;
  views: number;
  likes: number;
  priority: number;
  isActive: boolean;
  createdAt: Timestamp;
}

// Get admin stories from the specific admin dashboard
export const getAdminStories = async (language: string = 'english'): Promise<SimpleAdminStory[]> => {
  try {
    const q = query(
      collection(db, "stories"),
      where("isAdminPost", "==", true),
      where("disabled", "==", false),
      where("language", "==", language),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const stories: SimpleAdminStory[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        content: data.content || '',
        category: data.category || '',
        language: data.language || 'english',
        ageGroup: data.ageGroup || '',
        thumbnailUrl: data.thumbnailUrl || '',
        featured: data.featured || false,
        disabled: data.disabled || false,
        views: data.views || 0,
        isAdminPost: true,
        createdAt: data.createdAt || Timestamp.now()
      });
    });

    console.log(`📚 Fetched ${stories.length} admin stories from kidz-zone-admin dashboard`);
    return stories;
  } catch (error) {
    console.error("Error fetching admin stories:", error);
    return [];
  }
};

// Get admin videos from the specific admin dashboard
export const getAdminVideos = async (language: string = 'english'): Promise<SimpleAdminVideo[]> => {
  try {
    const q = query(
      collection(db, "videos"),
      where("isAdminPost", "==", true),
      where("disabled", "==", false),
      where("language", "==", language),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    const videos: SimpleAdminVideo[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      videos.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        videoUrl: data.videoUrl || '',
        category: data.category || '',
        language: data.language || 'english',
        ageGroup: data.ageGroup || '',
        thumbnailUrl: data.thumbnailUrl || '',
        featured: data.featured || false,
        disabled: data.disabled || false,
        views: data.views || 0,
        isAdminPost: true,
        createdAt: data.createdAt || Timestamp.now()
      });
    });

    console.log(`🎥 Fetched ${videos.length} admin videos from kidz-zone-admin dashboard`);
    return videos;
  } catch (error) {
    console.error("Error fetching admin videos:", error);
    return [];
  }
};

// Get admin trending stories from the specific admin dashboard
export const getAdminTrendingStories = async (language: string = 'english'): Promise<SimpleAdminTrendingStory[]> => {
  try {
    const q = query(
      collection(db, "trending_stories"),
      where("isActive", "==", true),
      where("language", "==", language),
      orderBy("priority", "desc")
    );

    const querySnapshot = await getDocs(q);
    const stories: SimpleAdminTrendingStory[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      stories.push({
        id: doc.id,
        title: data.title || '',
        description: data.description || '',
        imageUrl: data.imageUrl || data.thumbnailUrl || '',
        ageGroup: data.ageGroup || '',
        category: data.category || '',
        views: data.views || 0,
        likes: data.likes || 0,
        priority: data.priority || 1,
        isActive: data.isActive || true,
        createdAt: data.createdAt || Timestamp.now()
      });
    });

    console.log(`🔥 Fetched ${stories.length} admin trending stories from kidz-zone-admin dashboard`);
    return stories;
  } catch (error) {
    console.error("Error fetching admin trending stories:", error);
    return [];
  }
};

// Get all admin content for display on main website
export const getAllAdminContent = async (language: string = 'english') => {
  try {
    const [stories, videos, trendingStories] = await Promise.all([
      getAdminStories(language),
      getAdminVideos(language),
      getAdminTrendingStories(language)
    ]);

    return {
      stories,
      videos,
      trendingStories,
      totalContent: stories.length + videos.length + trendingStories.length
    };
  } catch (error) {
    console.error("Error fetching all admin content:", error);
    return {
      stories: [],
      videos: [],
      trendingStories: [],
      totalContent: 0
    };
  }
};

// Convert admin story to regular story format for main website display
export const convertAdminStoryToRegular = (adminStory: SimpleAdminStory) => {
  return {
    id: adminStory.id,
    title: adminStory.title,
    description: adminStory.description,
    content: adminStory.content,
    category: adminStory.category,
    language: adminStory.language,
    ageGroup: adminStory.ageGroup,
    imageUrl: adminStory.thumbnailUrl || '',
    featured: adminStory.featured,
    views: adminStory.views,
    likes: 0, // Default for admin stories
    createdAt: adminStory.createdAt,
    updatedAt: adminStory.createdAt,
    isAdminPost: true
  };
};

// Convert admin video to regular video format for main website display
export const convertAdminVideoToRegular = (adminVideo: SimpleAdminVideo) => {
  return {
    id: adminVideo.id,
    title: adminVideo.title,
    description: adminVideo.description,
    videoUrl: adminVideo.videoUrl,
    thumbnailUrl: adminVideo.thumbnailUrl || '',
    ageGroup: adminVideo.ageGroup,
    featured: adminVideo.featured,
    views: adminVideo.views,
    createdAt: adminVideo.createdAt,
    updatedAt: adminVideo.createdAt,
    isAdminPost: true
  };
};

// Convert admin trending story to regular trending story format
export const convertAdminTrendingToRegular = (adminTrending: SimpleAdminTrendingStory) => {
  return {
    id: adminTrending.id,
    title: adminTrending.title,
    description: adminTrending.description,
    imageUrl: adminTrending.imageUrl,
    ageGroup: adminTrending.ageGroup,
    category: adminTrending.category,
    views: adminTrending.views,
    likes: adminTrending.likes,
    priority: adminTrending.priority,
    isActive: adminTrending.isActive,
    createdAt: adminTrending.createdAt,
    updatedAt: adminTrending.createdAt,
    isAdminPost: true
  };
};

// Check if admin dashboard is connected and working
export const checkAdminConnection = async (): Promise<boolean> => {
  try {
    const adminContent = await getAllAdminContent();
    console.log(`🔗 Admin dashboard connection check: ${adminContent.totalContent} items found`);
    return true;
  } catch (error) {
    console.error("❌ Admin dashboard connection failed:", error);
    return false;
  }
};

// Get admin dashboard URL
export const getAdminDashboardUrl = (): string => {
  // Return the specific admin dashboard URL
  return "file:///C:/Users/HP/Downloads/childrens-website-main/childrens-website-main/kidz-zone-admin/index.html";
};

// Open admin dashboard in new window/tab
export const openAdminDashboard = (): void => {
  const adminUrl = getAdminDashboardUrl();
  if (typeof window !== 'undefined') {
    window.open(adminUrl, '_blank');
    console.log('🚀 Opening admin dashboard:', adminUrl);
  }
};
