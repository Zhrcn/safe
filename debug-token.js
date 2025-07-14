// Run this in the browser console to debug the current token
(function() {
  console.log('=== Token Debug ===');
  
  // Check localStorage
  const token = localStorage.getItem('safe_auth_token');
  console.log('Token in localStorage:', token ? 'Present' : 'Missing');
  
  if (token) {
    try {
      // Decode token
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const decoded = JSON.parse(jsonPayload);
      
      console.log('Token payload:', decoded);
      console.log('Token expires:', new Date(decoded.exp * 1000).toLocaleString());
      console.log('Current time:', new Date().toLocaleString());
      console.log('Token expired:', decoded.exp * 1000 < Date.now());
      
      // Test token with backend
      fetch('/api/auth/debug-token', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Backend token test response:', data);
      })
      .catch(error => {
        console.error('Backend token test failed:', error);
      });
      
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  // Check Redux state
  if (window.__REDUX_DEVTOOLS_EXTENSION__) {
    console.log('Redux DevTools available');
  }
  
  // Check if user is authenticated
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  console.log('User in localStorage:', user);
  
})(); 