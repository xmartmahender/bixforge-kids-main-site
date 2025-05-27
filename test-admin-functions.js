// Simple test script to check admin posts functions
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, getDocs, orderBy } = require('firebase/firestore');

// Firebase configuration (you'll need to replace with your actual config)
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Test function to get admin posts
async function testGetAdminPosts() {
  try {
    console.log('Testing getAdminPosts function...');
    
    // Get all stories first, then filter in memory
    const q = query(
      collection(db, "stories"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const stories = [];
    
    querySnapshot.forEach((doc) => {
      const storyData = { id: doc.id, ...doc.data() };
      
      // Filter for admin posts that are not disabled
      if (storyData.isAdminPost === true && storyData.disabled !== true) {
        stories.push(storyData);
      }
    });
    
    // Sort by creation date (newest first) and limit
    stories.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });
    
    console.log(`Found ${stories.length} admin stories`);
    stories.forEach(story => {
      console.log(`- ${story.title} (${story.ageGroup})`);
    });
    
    return stories.slice(0, 5);
  } catch (error) {
    console.error("Error getting admin posts: ", error);
    throw error;
  }
}

// Test function to get admin video posts
async function testGetAdminVideoPosts() {
  try {
    console.log('Testing getAdminVideoPosts function...');
    
    // Get all videos first, then filter in memory
    const q = query(
      collection(db, "videos"),
      orderBy("createdAt", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    const videos = [];
    
    querySnapshot.forEach((doc) => {
      const videoData = { id: doc.id, ...doc.data() };
      
      // Filter for admin posts that are not disabled
      if (videoData.isAdminPost === true && videoData.disabled !== true) {
        videos.push(videoData);
      }
    });
    
    // Sort by creation date (newest first) and limit
    videos.sort((a, b) => {
      if (a.createdAt && b.createdAt) {
        return b.createdAt.seconds - a.createdAt.seconds;
      }
      return 0;
    });
    
    console.log(`Found ${videos.length} admin videos`);
    videos.forEach(video => {
      console.log(`- ${video.title} (${video.ageGroup})`);
    });
    
    return videos.slice(0, 5);
  } catch (error) {
    console.error("Error getting admin video posts: ", error);
    throw error;
  }
}

// Run tests
async function runTests() {
  try {
    console.log('Starting admin posts tests...\n');
    
    const adminStories = await testGetAdminPosts();
    console.log('\n');
    
    const adminVideos = await testGetAdminVideoPosts();
    console.log('\n');
    
    console.log('Tests completed successfully!');
    console.log(`Total admin stories: ${adminStories.length}`);
    console.log(`Total admin videos: ${adminVideos.length}`);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Export for use in other files
module.exports = {
  testGetAdminPosts,
  testGetAdminVideoPosts,
  runTests
};

// Run tests if this file is executed directly
if (require.main === module) {
  runTests();
}
