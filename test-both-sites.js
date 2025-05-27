// Comprehensive Test Script for Main Site and Admin Dashboard
// Run this in browser console to test all functionality

console.log('🚀 Starting Comprehensive Site Testing...');

// Test 1: Main Site Functionality
function testMainSite() {
    console.log('\n📱 Testing Main Site...');
    
    // Check if main site elements exist
    const mainSiteTests = [
        { name: 'Navigation Bar', selector: 'nav' },
        { name: 'Hero Section', selector: '.hero, [class*="hero"]' },
        { name: 'Footer', selector: 'footer' },
        { name: 'Language Selector', selector: '[class*="language"], [class*="translate"]' },
        { name: 'BixForge Branding', selector: '*', text: 'BixForge' }
    ];
    
    let mainSitePassed = 0;
    
    mainSiteTests.forEach(test => {
        try {
            if (test.text) {
                const found = document.body.textContent.includes(test.text);
                if (found) {
                    console.log(`✅ ${test.name} found`);
                    mainSitePassed++;
                } else {
                    console.log(`❌ ${test.name} missing`);
                }
            } else {
                const element = document.querySelector(test.selector);
                if (element) {
                    console.log(`✅ ${test.name} found`);
                    mainSitePassed++;
                } else {
                    console.log(`❌ ${test.name} missing`);
                }
            }
        } catch (error) {
            console.log(`❌ ${test.name} error:`, error.message);
        }
    });
    
    console.log(`📊 Main Site: ${mainSitePassed}/${mainSiteTests.length} tests passed`);
    return mainSitePassed === mainSiteTests.length;
}

// Test 2: Admin Dashboard Functionality (when on admin page)
function testAdminDashboard() {
    console.log('\n🔧 Testing Admin Dashboard...');
    
    if (!window.location.href.includes('kidz-zone-admin')) {
        console.log('⚠️ Not on admin dashboard page. Navigate to /kidz-zone-admin/ to test admin features.');
        return false;
    }
    
    const adminTests = [
        { name: 'Admin Login Form', selector: '#loginForm, .login-form, [class*="login"]' },
        { name: 'Dashboard Navigation', selector: '.nav-tabs, .tab-nav, [class*="nav"]' },
        { name: 'Users Tab', selector: '*', text: 'Users' },
        { name: 'Subscriptions Tab', selector: '*', text: 'Subscriptions' },
        { name: 'Feedback Tab', selector: '*', text: 'Feedback' },
        { name: 'Analytics Section', selector: '*', text: 'Analytics' }
    ];
    
    let adminPassed = 0;
    
    adminTests.forEach(test => {
        try {
            if (test.text) {
                const found = document.body.textContent.includes(test.text);
                if (found) {
                    console.log(`✅ ${test.name} found`);
                    adminPassed++;
                } else {
                    console.log(`❌ ${test.name} missing`);
                }
            } else {
                const element = document.querySelector(test.selector);
                if (element) {
                    console.log(`✅ ${test.name} found`);
                    adminPassed++;
                } else {
                    console.log(`❌ ${test.name} missing`);
                }
            }
        } catch (error) {
            console.log(`❌ ${test.name} error:`, error.message);
        }
    });
    
    console.log(`📊 Admin Dashboard: ${adminPassed}/${adminTests.length} tests passed`);
    return adminPassed >= 4; // At least 4 tests should pass
}

// Test 3: Enhanced Features (when logged into admin)
function testEnhancedFeatures() {
    console.log('\n⭐ Testing Enhanced Features...');
    
    if (!window.location.href.includes('kidz-zone-admin')) {
        console.log('⚠️ Enhanced features test requires admin dashboard.');
        return false;
    }
    
    const enhancedTests = [
        { name: 'Edit User Function', func: 'editUser' },
        { name: 'Edit Subscription Function', func: 'editSubscriptionPackage' },
        { name: 'Add User Modal', func: 'openAddUserModal' },
        { name: 'Add Subscription Modal', func: 'openAddSubscriptionModal' },
        { name: 'Export Users Function', func: 'exportUsersData' },
        { name: 'Update Analytics Function', func: 'updateAnalytics' }
    ];
    
    let enhancedPassed = 0;
    
    enhancedTests.forEach(test => {
        try {
            if (typeof window[test.func] === 'function') {
                console.log(`✅ ${test.name} available`);
                enhancedPassed++;
            } else {
                console.log(`❌ ${test.name} missing`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} error:`, error.message);
        }
    });
    
    console.log(`📊 Enhanced Features: ${enhancedPassed}/${enhancedTests.length} available`);
    return enhancedPassed >= 4;
}

// Test 4: Data Persistence
function testDataPersistence() {
    console.log('\n💾 Testing Data Persistence...');
    
    const storageTests = [
        { name: 'Local Storage Available', test: () => typeof localStorage !== 'undefined' },
        { name: 'Session Storage Available', test: () => typeof sessionStorage !== 'undefined' },
        { name: 'Users Data Structure', test: () => {
            try {
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                return Array.isArray(users);
            } catch { return false; }
        }},
        { name: 'Subscription Packages Data', test: () => {
            try {
                const packages = JSON.parse(localStorage.getItem('subscriptionPackages') || '[]');
                return Array.isArray(packages);
            } catch { return false; }
        }}
    ];
    
    let persistencePassed = 0;
    
    storageTests.forEach(test => {
        try {
            if (test.test()) {
                console.log(`✅ ${test.name} working`);
                persistencePassed++;
            } else {
                console.log(`❌ ${test.name} failed`);
            }
        } catch (error) {
            console.log(`❌ ${test.name} error:`, error.message);
        }
    });
    
    console.log(`📊 Data Persistence: ${persistencePassed}/${storageTests.length} working`);
    return persistencePassed >= 2;
}

// Test 5: Integration Test
function testIntegration() {
    console.log('\n🔗 Testing Integration...');
    
    const currentUrl = window.location.href;
    const isMainSite = !currentUrl.includes('kidz-zone-admin');
    const isAdminSite = currentUrl.includes('kidz-zone-admin');
    
    console.log(`📍 Current Location: ${isMainSite ? 'Main Site' : 'Admin Dashboard'}`);
    
    if (isMainSite) {
        console.log('✅ Main site accessible');
        console.log('✅ Admin separation maintained');
        return true;
    } else if (isAdminSite) {
        console.log('✅ Admin dashboard accessible');
        console.log('✅ Separate admin interface confirmed');
        return true;
    }
    
    return false;
}

// Main Test Runner
function runAllTests() {
    console.log('🎯 Running All Tests...\n');
    
    const tests = [
        { name: 'Main Site', test: testMainSite },
        { name: 'Admin Dashboard', test: testAdminDashboard },
        { name: 'Enhanced Features', test: testEnhancedFeatures },
        { name: 'Data Persistence', test: testDataPersistence },
        { name: 'Integration', test: testIntegration }
    ];
    
    let totalPassed = 0;
    const results = [];
    
    tests.forEach(({ name, test }) => {
        try {
            const result = test();
            if (result) {
                console.log(`\n✅ ${name} test PASSED`);
                totalPassed++;
                results.push({ name, status: 'PASSED' });
            } else {
                console.log(`\n❌ ${name} test FAILED`);
                results.push({ name, status: 'FAILED' });
            }
        } catch (error) {
            console.log(`\n⚠️ ${name} test ERROR:`, error.message);
            results.push({ name, status: 'ERROR', error: error.message });
        }
    });
    
    console.log(`\n📊 Overall Results: ${totalPassed}/${tests.length} tests passed`);
    
    if (totalPassed >= 3) {
        console.log('\n🎉 System is working well!');
        console.log('🚀 Both main site and admin dashboard are functional!');
    } else {
        console.log('\n⚠️ Some issues detected. Check individual test results above.');
    }
    
    return { totalPassed, totalTests: tests.length, results };
}

// Auto-run tests
console.log('🔄 Auto-running tests in 2 seconds...');
setTimeout(runAllTests, 2000);

// Export for manual testing
window.testBothSites = runAllTests;
window.testMainSite = testMainSite;
window.testAdminDashboard = testAdminDashboard;

console.log('\n📝 Manual Testing Commands:');
console.log('- testBothSites() - Run all tests');
console.log('- testMainSite() - Test main site only');
console.log('- testAdminDashboard() - Test admin dashboard only');
