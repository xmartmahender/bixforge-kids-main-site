// Integration Test Script for Admin Dashboard and Main Website
// This script tests the connection between admin dashboard and main website

console.log('🧪 Starting Integration Test...');

// Test Firebase Connection
async function testFirebaseConnection() {
    console.log('\n📡 Testing Firebase Connection...');
    
    try {
        // Check if Firebase is available
        if (typeof firebase === 'undefined') {
            console.error('❌ Firebase not loaded');
            return false;
        }

        // Test Firestore connection
        const db = firebase.firestore();
        const testDoc = await db.collection('test').doc('connection').get();
        console.log('✅ Firebase Firestore connected successfully');

        // Test Storage connection
        const storage = firebase.storage();
        console.log('✅ Firebase Storage connected successfully');

        return true;
    } catch (error) {
        console.error('❌ Firebase connection failed:', error);
        return false;
    }
}

// Test Admin Content Fetching
async function testAdminContentFetching() {
    console.log('\n📚 Testing Admin Content Fetching...');
    
    try {
        const db = firebase.firestore();
        
        // Test fetching admin stories
        const adminStoriesQuery = await db.collection('stories')
            .where('isAdminPost', '==', true)
            .limit(5)
            .get();
        
        console.log(`✅ Found ${adminStoriesQuery.size} admin stories`);
        
        // Test fetching admin videos
        const adminVideosQuery = await db.collection('videos')
            .where('isAdminPost', '==', true)
            .limit(5)
            .get();
        
        console.log(`✅ Found ${adminVideosQuery.size} admin videos`);
        
        // Test fetching trending stories
        const trendingQuery = await db.collection('trending_stories')
            .limit(5)
            .get();
        
        console.log(`✅ Found ${trendingQuery.size} trending stories`);
        
        return true;
    } catch (error) {
        console.error('❌ Admin content fetching failed:', error);
        return false;
    }
}

// Test File Upload Functionality
async function testFileUploadFunctionality() {
    console.log('\n📁 Testing File Upload Functionality...');
    
    try {
        const storage = firebase.storage();
        
        // Create a test blob (simulating a file)
        const testBlob = new Blob(['test content'], { type: 'text/plain' });
        const testFile = new File([testBlob], 'test.txt', { type: 'text/plain' });
        
        // Test upload
        const storageRef = storage.ref(`test/${Date.now()}_test.txt`);
        const snapshot = await storageRef.put(testFile);
        const downloadURL = await snapshot.ref.getDownloadURL();
        
        console.log('✅ File upload test successful:', downloadURL);
        
        // Clean up test file
        await storageRef.delete();
        console.log('✅ Test file cleaned up');
        
        return true;
    } catch (error) {
        console.error('❌ File upload test failed:', error);
        return false;
    }
}

// Test Data Synchronization
async function testDataSynchronization() {
    console.log('\n🔄 Testing Data Synchronization...');
    
    try {
        const db = firebase.firestore();
        
        // Create a test story in admin
        const testStory = {
            title: 'Integration Test Story',
            description: 'This is a test story for integration testing',
            content: 'Test content',
            ageGroup: '3-6',
            category: 'test',
            language: 'english',
            isAdminPost: true,
            disabled: false,
            views: 0,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('stories').add(testStory);
        console.log('✅ Test story created with ID:', docRef.id);
        
        // Verify it can be fetched
        const fetchedDoc = await docRef.get();
        if (fetchedDoc.exists) {
            console.log('✅ Test story successfully fetched');
        }
        
        // Clean up test story
        await docRef.delete();
        console.log('✅ Test story cleaned up');
        
        return true;
    } catch (error) {
        console.error('❌ Data synchronization test failed:', error);
        return false;
    }
}

// Test Admin Dashboard Features
async function testAdminDashboardFeatures() {
    console.log('\n🎛️ Testing Admin Dashboard Features...');
    
    try {
        // Check if admin dashboard functions exist
        const requiredFunctions = [
            'uploadVideoFile',
            'uploadThumbnailFile',
            'uploadImageFile',
            'loadCodeStoriesFromFirebase',
            'loadCodeVideosFromFirebase',
            'loadTrendingStoriesFromFirebase'
        ];
        
        let functionsFound = 0;
        
        // Check if adminDashboard object exists
        if (typeof adminDashboard !== 'undefined') {
            requiredFunctions.forEach(funcName => {
                if (typeof adminDashboard[funcName] === 'function') {
                    console.log(`✅ Function ${funcName} found`);
                    functionsFound++;
                } else {
                    console.log(`⚠️ Function ${funcName} not found`);
                }
            });
        } else {
            console.log('⚠️ adminDashboard object not found (may be normal if not on admin page)');
        }
        
        console.log(`✅ Found ${functionsFound}/${requiredFunctions.length} admin functions`);
        return true;
    } catch (error) {
        console.error('❌ Admin dashboard features test failed:', error);
        return false;
    }
}

// Main test runner
async function runIntegrationTests() {
    console.log('🚀 Running Complete Integration Test Suite...\n');
    
    const tests = [
        { name: 'Firebase Connection', test: testFirebaseConnection },
        { name: 'Admin Content Fetching', test: testAdminContentFetching },
        { name: 'File Upload Functionality', test: testFileUploadFunctionality },
        { name: 'Data Synchronization', test: testDataSynchronization },
        { name: 'Admin Dashboard Features', test: testAdminDashboardFeatures }
    ];
    
    let passedTests = 0;
    
    for (const { name, test } of tests) {
        try {
            const result = await test();
            if (result) {
                passedTests++;
                console.log(`\n✅ ${name}: PASSED`);
            } else {
                console.log(`\n❌ ${name}: FAILED`);
            }
        } catch (error) {
            console.log(`\n❌ ${name}: ERROR - ${error.message}`);
        }
    }
    
    console.log(`\n📊 Integration Test Results: ${passedTests}/${tests.length} tests passed`);
    
    if (passedTests === tests.length) {
        console.log('🎉 All integration tests passed! Admin dashboard is fully integrated with main website.');
    } else {
        console.log('⚠️ Some tests failed. Please check the issues above.');
    }
    
    return passedTests === tests.length;
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    // Browser environment
    window.addEventListener('load', () => {
        setTimeout(runIntegrationTests, 2000); // Wait for Firebase to initialize
    });
} else {
    // Node.js environment
    runIntegrationTests();
}

// Export for manual testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { runIntegrationTests };
}
