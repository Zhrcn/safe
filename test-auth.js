const axios = require('axios');

// Test authentication flow
async function testAuth() {
  try {
    console.log('=== Testing Authentication ===');
    
    // Test 1: Try to login
    console.log('\n1. Testing login...');
    const loginResponse = await axios.post('http://localhost:5001/api/v1/auth/login', {
      email: 'test@example.com',
      password: 'testpass123'
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', loginResponse.data);
    
    if (loginResponse.data.success && loginResponse.data.data.token) {
      const token = loginResponse.data.data.token;
      console.log('Token received:', token ? 'Yes' : 'No');
      
      // Test 2: Try to access protected endpoint
      console.log('\n2. Testing protected endpoint...');
      const protectedResponse = await axios.get('http://localhost:5001/api/v1/auth/debug-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Protected endpoint response status:', protectedResponse.status);
      console.log('Protected endpoint response data:', protectedResponse.data);
      
      // Test 3: Try to access notifications
      console.log('\n3. Testing notifications endpoint...');
      const notificationsResponse = await axios.get('http://localhost:5001/api/v1/notifications?limit=20', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Notifications response status:', notificationsResponse.status);
      console.log('Notifications response data:', notificationsResponse.data);
      
    } else {
      console.log('Login failed, cannot test protected endpoints');
    }
    
  } catch (error) {
    console.error('Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test
testAuth(); 