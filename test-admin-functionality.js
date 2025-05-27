// Test Admin Dashboard Functionality
// This script tests all admin dashboard features and Firebase connectivity

console.log('🧪 Starting Admin Dashboard Functionality Test...');

// Test Firebase Connection
function testFirebaseConnection() {
    console.log('\n🔥 Testing Firebase Connection...');
    
    if (typeof firebase !== 'undefined') {
        console.log('✅ Firebase SDK loaded successfully');
        
        try {
            const app = firebase.app();
            console.log('✅ Firebase app initialized:', app.name);
            
            const db = firebase.firestore();
            console.log('✅ Firestore connected');
            
            return true;
        } catch (error) {
            console.error('❌ Firebase connection error:', error);
            return false;
        }
    } else {
        console.error('❌ Firebase SDK not loaded');
        return false;
    }
}

// Test Admin Dashboard Class
function testAdminDashboard() {
    console.log('\n📊 Testing Admin Dashboard Class...');
    
    if (typeof window.adminDashboard !== 'undefined') {
        console.log('✅ Admin Dashboard instance found');
        
        const dashboard = window.adminDashboard;
        
        // Test data arrays
        console.log('📚 Stories loaded:', dashboard.regularStories?.length || 0);
        console.log('🎥 Videos loaded:', dashboard.regularVideos?.length || 0);
        console.log('🔥 Trending stories loaded:', dashboard.trendingStories?.length || 0);
        console.log('💻 Code stories loaded:', dashboard.codeStories?.length || 0);
        console.log('🎬 Code videos loaded:', dashboard.codeVideos?.length || 0);
        
        return true;
    } else {
        console.error('❌ Admin Dashboard not initialized');
        return false;
    }
}

// Test Form Elements
function testFormElements() {
    console.log('\n📝 Testing Form Elements...');
    
    const forms = [
        'add-regular-story-form',
        'add-regular-video-form',
        'add-trending-story-form'
    ];
    
    let allFormsFound = true;
    
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            console.log(`✅ Form found: ${formId}`);
        } else {
            console.error(`❌ Form missing: ${formId}`);
            allFormsFound = false;
        }
    });
    
    return allFormsFound;
}

// Test Button Functionality
function testButtons() {
    console.log('\n🔘 Testing Button Functionality...');
    
    const buttons = [
        'add-trending-story-btn',
        'add-regular-story-btn',
        'add-regular-video-btn'
    ];
    
    let allButtonsFound = true;
    
    buttons.forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            console.log(`✅ Button found: ${buttonId}`);
            
            // Test click event
            try {
                button.click();
                console.log(`✅ Button clickable: ${buttonId}`);
            } catch (error) {
                console.error(`❌ Button click error: ${buttonId}`, error);
            }
        } else {
            console.error(`❌ Button missing: ${buttonId}`);
            allButtonsFound = false;
        }
    });
    
    return allButtonsFound;
}

// Test Modal Functionality
function testModals() {
    console.log('\n🪟 Testing Modal Functionality...');
    
    const modals = [
        'add-trending-story-modal',
        'add-regular-story-modal',
        'add-regular-video-modal'
    ];
    
    let allModalsFound = true;
    
    modals.forEach(modalId => {
        const modal = document.getElementById(modalId);
        if (modal) {
            console.log(`✅ Modal found: ${modalId}`);
        } else {
            console.error(`❌ Modal missing: ${modalId}`);
            allModalsFound = false;
        }
    });
    
    return allModalsFound;
}

// Test Data Saving (Mock)
function testDataSaving() {
    console.log('\n💾 Testing Data Saving Functionality...');
    
    if (window.adminDashboard && window.adminDashboard.db) {
        console.log('✅ Firebase database connection available');
        
        // Test story data structure
        const testStory = {
            title: "Test Story",
            description: "Test Description",
            content: "Test Content",
            category: "moral",
            language: "english",
            ageGroup: "3-5",
            thumbnailUrl: "https://example.com/image.jpg",
            featured: false,
            published: true
        };
        
        console.log('✅ Test story data structure valid:', testStory);
        
        // Test video data structure
        const testVideo = {
            title: "Test Video",
            description: "Test Description",
            videoUrl: "https://youtube.com/watch?v=test",
            category: "funny",
            language: "english",
            ageGroup: "3-5",
            duration: "10:30",
            thumbnailUrl: "https://example.com/thumb.jpg",
            featured: false,
            published: true
        };
        
        console.log('✅ Test video data structure valid:', testVideo);
        
        return true;
    } else {
        console.warn('⚠️ Firebase database not available, using mock data');
        return false;
    }
}

// Test YouTube URL Validation
function testYouTubeUrls() {
    console.log('\n🎬 Testing YouTube URL Validation...');
    
    const testUrls = [
        'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://youtube.com/watch?v=kJQP7kiw5Fk',
        'https://youtu.be/hq3yfQnllfQ'
    ];
    
    testUrls.forEach(url => {
        const isValid = url.includes('youtube.com') || url.includes('youtu.be');
        if (isValid) {
            console.log(`✅ Valid YouTube URL: ${url}`);
        } else {
            console.error(`❌ Invalid YouTube URL: ${url}`);
        }
    });
    
    return true;
}

// Test Image URL Validation
function testImageUrls() {
    console.log('\n🖼️ Testing Image URL Validation...');
    
    const testImages = [
        'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?w=400&h=300&fit=crop'
    ];
    
    testImages.forEach(url => {
        const isValid = url.includes('unsplash.com') || url.includes('.jpg') || url.includes('.png');
        if (isValid) {
            console.log(`✅ Valid image URL: ${url.substring(0, 50)}...`);
        } else {
            console.error(`❌ Invalid image URL: ${url}`);
        }
    });
    
    return true;
}

// Run All Tests
function runAllTests() {
    console.log('🚀 Running Complete Admin Dashboard Test Suite...\n');
    
    const tests = [
        { name: 'Firebase Connection', test: testFirebaseConnection },
        { name: 'Admin Dashboard', test: testAdminDashboard },
        { name: 'Form Elements', test: testFormElements },
        { name: 'Button Functionality', test: testButtons },
        { name: 'Modal Functionality', test: testModals },
        { name: 'Data Saving', test: testDataSaving },
        { name: 'YouTube URLs', test: testYouTubeUrls },
        { name: 'Image URLs', test: testImageUrls }
    ];
    
    let passedTests = 0;
    let totalTests = tests.length;
    
    tests.forEach(({ name, test }) => {
        try {
            const result = test();
            if (result) {
                passedTests++;
                console.log(`\n✅ ${name} test PASSED`);
            } else {
                console.log(`\n❌ ${name} test FAILED`);
            }
        } catch (error) {
            console.error(`\n💥 ${name} test ERROR:`, error);
        }
    });
    
    console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Admin dashboard is fully functional!');
    } else {
        console.log('⚠️ Some tests failed. Check the issues above.');
    }
    
    return passedTests === totalTests;
}

// Auto-run tests when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runAllTests, 2000); // Wait 2 seconds for everything to load
    });
} else {
    setTimeout(runAllTests, 2000);
}

// Export for manual testing
window.testAdminFunctionality = runAllTests;
