// lib/videoService.ts
import { db } from "./firebase";
import {
  collection, getDocs, getDoc, doc, query,
  orderBy, Timestamp, addDoc, updateDoc, deleteDoc
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "./firebase";
import { getAdminVideos, convertAdminVideoToRegular } from "./simpleAdminConnection";

export type Video = {
  id?: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  ageGroup: string;
  isCodeVideo?: boolean;
  programmingLanguage?: string;
  disabled?: boolean;
  isAdminPost?: boolean;
  featured?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const getVideos = async (ageGroup?: string, limitCount = 10, language: string = 'english') => {
  try {
    // Get regular videos and admin videos
    const [regularVideosSnapshot, adminVideos] = await Promise.all([
      getDocs(query(collection(db, "videos"), orderBy("createdAt", "desc"))),
      getAdminVideos(language)
    ]);

    const videos: Video[] = [];

    // Process regular videos (including admin posts)
    regularVideosSnapshot.forEach((doc) => {
      const videoData = { id: doc.id, ...doc.data() } as Video;

      // Filter out code videos and disabled videos, but INCLUDE admin posts
      const isCodeVideo = videoData.isCodeVideo === true;
      const isDisabled = videoData.disabled === true;
      const matchesAgeGroup = !ageGroup || ageGroup === '' || videoData.ageGroup === ageGroup;

      if (!isCodeVideo && !isDisabled && matchesAgeGroup) {
        videos.push(videoData);
      }
    });

    // Add admin videos
    adminVideos.forEach((adminVideo) => {
      const matchesAgeGroup = !ageGroup || ageGroup === '' || adminVideo.ageGroup === ageGroup;

      if (matchesAgeGroup) {
        const convertedVideo = convertAdminVideoToRegular(adminVideo);
        videos.push(convertedVideo);
      }
    });

    // Sort by featured first, then by creation date
    videos.sort((a, b) => {
      // Featured videos first
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;

      // Then by creation date (newest first)
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });

    console.log(`🎥 Combined ${videos.length} videos (including kidz-zone-admin content)`);
    return videos.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting videos: ", error);
    throw error;
  }
};

export const getVideoById = async (id: string) => {
  try {
    const videoDoc = await getDoc(doc(db, "videos", id));

    if (videoDoc.exists()) {
      return { id: videoDoc.id, ...videoDoc.data() } as Video;
    } else {
      throw new Error("Video not found");
    }
  } catch (error) {
    console.error("Error getting video: ", error);
    throw error;
  }
};

export const getAdminVideoPosts = async (limitCount = 5) => {
  try {
    console.log('getAdminVideoPosts: Starting to fetch admin video posts...');

    // Get all videos first, then filter in memory to avoid complex Firebase queries
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc")
    );

    console.log('getAdminVideoPosts: Executing Firebase query...');
    const querySnapshot = await getDocs(q);
    console.log('getAdminVideoPosts: Query completed, total documents:', querySnapshot.size);

    const videos: Video[] = [];
    let totalVideos = 0;
    let adminVideos = 0;

    querySnapshot.forEach((doc) => {
      totalVideos++;
      const videoData = { id: doc.id, ...doc.data() } as Video;

      console.log(`getAdminVideoPosts: Video ${totalVideos}: ${videoData.title}, isAdminPost: ${videoData.isAdminPost}, disabled: ${videoData.disabled}`);

      // Filter for admin posts that are not disabled
      if (videoData.isAdminPost === true && videoData.disabled !== true) {
        adminVideos++;
        videos.push(videoData);
        console.log(`getAdminVideoPosts: Added admin video: ${videoData.title}`);
      }
    });

    console.log(`getAdminVideoPosts: Found ${adminVideos} admin videos out of ${totalVideos} total videos`);

    // Sort by creation date (newest first) and limit
    videos.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });

    const result = videos.slice(0, limitCount);
    console.log(`getAdminVideoPosts: Returning ${result.length} videos`);
    return result;
  } catch (error) {
    console.error("Error getting admin video posts: ", error);
    throw error;
  }
};

export const getCodeVideos = async (ageGroup?: string, programmingLanguage?: string, limitCount = 10) => {
  try {
    // Get all videos first
    const allVideosQuery = query(collection(db, "videos"));
    const allVideosSnapshot = await getDocs(allVideosQuery);
    const codeVideos: Video[] = [];

    allVideosSnapshot.forEach((doc) => {
      const videoData = { id: doc.id, ...doc.data() } as Video;

      // Check if it's a code video or has programming language tags
      const isCodeRelated =
        videoData.isCodeVideo === true ||
        !!videoData.programmingLanguage ||
        (videoData.title && videoData.title.toLowerCase().includes('cod')) ||
        (videoData.description && videoData.description.toLowerCase().includes('cod'));

      // Check if it matches the age group filter
      const matchesAgeGroup =
        !ageGroup || ageGroup === '' ||
        videoData.ageGroup === ageGroup;

      // Check if it matches the programming language filter
      const matchesLanguage =
        !programmingLanguage || programmingLanguage === '' || programmingLanguage === 'all' ||
        (videoData.programmingLanguage && videoData.programmingLanguage.toLowerCase() === programmingLanguage.toLowerCase());

      if (isCodeRelated && matchesAgeGroup && matchesLanguage) {
        codeVideos.push(videoData);
      }
    });

    // Sort by creation date (newest first)
    codeVideos.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });

    // Apply limit
    return codeVideos.slice(0, limitCount);
  } catch (error) {
    console.error("Error getting code videos: ", error);
    throw error;
  }
};



// Function to extract YouTube video ID
export const getYouTubeVideoId = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

export const addVideo = async (video: Omit<Video, 'id' | 'createdAt' | 'updatedAt'>, thumbnailFile?: File) => {
  try {
    // Handle thumbnail upload if provided
    let thumbnailUrl = video.thumbnailUrl || '';

    if (thumbnailFile) {
      const fileName = `${Date.now()}_${thumbnailFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `thumbnails/${fileName}`);

      await uploadBytes(storageRef, thumbnailFile);
      thumbnailUrl = await getDownloadURL(storageRef);
    } else if (!thumbnailUrl) {
      // Try to get YouTube thumbnail automatically
      const youtubeId = getYouTubeVideoId(video.videoUrl);
      if (youtubeId) {
        thumbnailUrl = `https://i3.ytimg.com/vi/${youtubeId}/maxresdefault.jpg`;
      } else {
        thumbnailUrl = "https://via.placeholder.com/640x360?text=Video+Thumbnail";
      }
    }

    const videoData = {
      ...video,
      thumbnailUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, "videos"), videoData);
    return { id: docRef.id, ...videoData };
  } catch (error) {
    console.error("Error adding video: ", error);
    throw error;
  }
};

export const updateVideo = async (id: string, video: Partial<Video>, thumbnailFile?: File) => {
  try {
    // Handle thumbnail upload if provided
    let thumbnailUrl = video.thumbnailUrl;

    if (thumbnailFile) {
      const fileName = `${Date.now()}_${thumbnailFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, `thumbnails/${fileName}`);

      await uploadBytes(storageRef, thumbnailFile);
      thumbnailUrl = await getDownloadURL(storageRef);
    }

    const videoData = {
      ...video,
      ...(thumbnailUrl && { thumbnailUrl }),
      updatedAt: Timestamp.now()
    };

    await updateDoc(doc(db, "videos", id), videoData);
    return { id, ...videoData };
  } catch (error) {
    console.error("Error updating video: ", error);
    throw error;
  }
};

export const deleteVideo = async (id: string, thumbnailUrl?: string) => {
  try {
    // Delete thumbnail from storage if it's a Firebase URL
    if (thumbnailUrl && thumbnailUrl.includes("firebasestorage")) {
      try {
        const imageRef = ref(storage, thumbnailUrl);
        await deleteObject(imageRef);
      } catch (err) {
        console.error("Error deleting thumbnail image", err);
      }
    }

    // Delete video document
    await deleteDoc(doc(db, "videos", id));
    return true;
  } catch (error) {
    console.error("Error deleting video: ", error);
    throw error;
  }
};