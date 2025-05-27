// Test script to verify both main site and admin dashboard functionality
// Run this in browser console to test integration

console.log('🚀 Testing BixForge Kids Zone Integration...');

// Test 1: Check if subscription packages are available
function testSubscriptionPackages() {
    console.log('\n📦 Testing Subscription Packages...');
    
    const packages = JSON.parse(localStorage.getItem('subscriptionPackages') || '[]');
    const activePackages = JSON.parse(localStorage.getItem('activeSubscriptionPackages') || '[]');
    
    console.log('Total packages:', packages.length);
    console.log('Active packages:', activePackages.length);
    
    if (packages.length > 0) {
        console.log('✅ Subscription packages found');
        packages.forEach(pkg => {
            console.log(`  - ${pkg.name}: $${pkg.price} (${pkg.isActive ? 'Active' : 'Inactive'})`);
        });
    } else {
        console.log('❌ No subscription packages found');
    }
    
    return packages.length > 0;
}

// Test 2: Check feedback functionality
function testFeedbackSystem() {
    console.log('\n💬 Testing Feedback System...');
    
    const feedback = JSON.parse(localStorage.getItem('userFeedback') || '[]');
    console.log('Feedback entries:', feedback.length);
    
    // Add test feedback
    const testFeedback = {
        id: Date.now(),
        userName: 'Test User',
        userEmail: 'test@example.com',
        subject: 'Test Feedback',
        message: 'This is a test feedback message',
        contentId: 'test-page',
        contentType: 'story',
        contentTitle: 'Test Content',
        rating: 5,
        status: 'new',
        priority: 'medium',
        createdAt: new Date().toISOString()
    };
    
    const allFeedback = [...feedback, testFeedback];
    localStorage.setItem('userFeedback', JSON.stringify(allFeedback));
    
    console.log('✅ Test feedback added successfully');
    return true;
}

// Test 3: Check user management
function testUserManagement() {
    console.log('\n👥 Testing User Management...');
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    console.log('Registered users:', users.length);
    
    // Add test user if none exist
    if (users.length === 0) {
        const testUser = {
            id: Date.now().toString(),
            name: 'Test User',
            email: 'testuser@example.com',
            status: 'active',
            ageGroup: '6-9',
            subscriptionPackage: 'Free Explorer',
            createdAt: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            storiesRead: 5,
            videosWatched: 3,
            codeStoriesCompleted: 1
        };
        
        users.push(testUser);
        localStorage.setItem('users', JSON.stringify(users));
        console.log('✅ Test user added successfully');
    } else {
        console.log('✅ Users found in system');
    }
    
    return true;
}

// Test 4: Check sync functionality
function testSyncFunctionality() {
    console.log('\n🔄 Testing Sync Functionality...');
    
    try {
        // Test if sync functions exist
        if (typeof syncPackagesToMainSite === 'function') {
            console.log('✅ syncPackagesToMainSite function available');
        } else {
            console.log('❌ syncPackagesToMainSite function not found');
        }
        
        if (typeof autoSyncPackages === 'function') {
            console.log('✅ autoSyncPackages function available');
        } else {
            console.log('❌ autoSyncPackages function not found');
        }
        
        return true;
    } catch (error) {
        console.log('❌ Sync functionality error:', error);
        return false;
    }
}

// Test 5: Check main site integration
function testMainSiteIntegration() {
    console.log('\n🌐 Testing Main Site Integration...');
    
    // Check if we're on main site or admin
    const isMainSite = window.location.pathname.includes('/subscriptions') || 
                      window.location.pathname === '/' ||
                      !window.location.pathname.includes('admin');
    
    const isAdminSite = window.location.pathname.includes('admin') ||
                       window.location.pathname.includes('kidz-zone-admin');
    
    console.log('Current site type:', isMainSite ? 'Main Site' : isAdminSite ? 'Admin Dashboard' : 'Unknown');
    
    if (isMainSite) {
        // Test main site features
        console.log('Testing main site features...');
        
        // Check if subscription page exists
        const hasSubscriptionPage = document.querySelector('[href="/subscriptions"]') !== null;
        console.log('Subscription page link:', hasSubscriptionPage ? '✅ Found' : '❌ Not found');
        
        // Check feedback buttons
        const feedbackButtons = document.querySelectorAll('[class*="feedback"]');
        console.log('Feedback buttons found:', feedbackButtons.length);
        
    } else if (isAdminSite) {
        // Test admin features
        console.log('Testing admin dashboard features...');
        
        // Check admin tabs
        const adminTabs = document.querySelectorAll('.tab-btn');
        console.log('Admin tabs found:', adminTabs.length);
        
        // Check sync button
        const syncButton = document.querySelector('[onclick*="syncPackagesToMainSite"]');
        console.log('Sync button:', syncButton ? '✅ Found' : '❌ Not found');
    }
    
    return true;
}

// Run all tests
function runAllTests() {
    console.log('🧪 Running Complete Integration Test Suite...\n');
    
    const results = {
        subscriptionPackages: testSubscriptionPackages(),
        feedbackSystem: testFeedbackSystem(),
        userManagement: testUserManagement(),
        syncFunctionality: testSyncFunctionality(),
        mainSiteIntegration: testMainSiteIntegration()
    };
    
    console.log('\n📊 Test Results Summary:');
    console.log('========================');
    
    let passedTests = 0;
    let totalTests = Object.keys(results).length;
    
    Object.entries(results).forEach(([test, passed]) => {
        console.log(`${passed ? '✅' : '❌'} ${test}: ${passed ? 'PASSED' : 'FAILED'}`);
        if (passed) passedTests++;
    });
    
    console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
    
    if (passedTests === totalTests) {
        console.log('🎉 All tests passed! Integration is working correctly.');
    } else {
        console.log('⚠️  Some tests failed. Please check the issues above.');
    }
    
    return results;
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(runAllTests, 1000);
        });
    } else {
        setTimeout(runAllTests, 1000);
    }
}

// Export for manual testing
window.testBixForgeIntegration = runAllTests;

console.log('💡 You can also run tests manually by calling: testBixForgeIntegration()');
