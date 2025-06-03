// Simple API test script
const axios = require('axios');

const API_BASE = 'http://localhost:5001/api';

async function testAPI() {
  console.log('🧪 Testing MERN Shop App API...\n');

  try {
    // Test 1: Health Check
    console.log('1. Testing health endpoint...');
    const health = await axios.get(`${API_BASE}/health`);
    console.log('✅ Health check:', health.data.message);

    // Test 2: Signup
    console.log('\n2. Testing signup...');
    const signupData = {
      username: 'testuser' + Date.now(),
      password: 'Test123!',
      shopNames: ['testshop1', 'testshop2', 'testshop3']
    };

    const signup = await axios.post(`${API_BASE}/auth/signup`, signupData);
    console.log('✅ Signup successful:', signup.data.user.username);

    // Test 3: Signin
    console.log('\n3. Testing signin...');
    const signin = await axios.post(`${API_BASE}/auth/signin`, {
      username: signupData.username,
      password: signupData.password,
      rememberMe: false
    }, { withCredentials: true });
    console.log('✅ Signin successful:', signin.data.user.username);

    // Test 4: Profile
    console.log('\n4. Testing profile...');
    const profile = await axios.get(`${API_BASE}/user/profile`, {
      headers: { Authorization: `Bearer ${signin.data.accessToken}` }
    });
    console.log('✅ Profile retrieved:', profile.data.user.shopNames);

    // Test 5: Shop verification
    console.log('\n5. Testing shop verification...');
    const shopVerify = await axios.get(`${API_BASE}/user/verify-shop/${signupData.shopNames[0]}`, {
      headers: { Authorization: `Bearer ${signin.data.accessToken}` }
    });
    console.log('✅ Shop verification:', shopVerify.data.shop.name);

    console.log('\n🎉 All tests passed! API is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data?.message || error.message);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testAPI();
}

module.exports = testAPI;
