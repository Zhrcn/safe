(function() {
    const TOKEN_KEY = 'safe_auth_token';
    const USER_KEY = 'safe_user_data';
    const token = localStorage.getItem(TOKEN_KEY);
    const userData = localStorage.getItem(USER_KEY);
    console.log('=== AUTH DEBUG INFO ===');
    console.log('Token exists:', !!token);
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            console.log('Token payload:', decoded);
            const currentTime = Math.floor(Date.now() / 1000);
            if (decoded.exp) {
                console.log('Token expires:', new Date(decoded.exp * 1000).toLocaleString());
                console.log('Token expired:', decoded.exp < currentTime);
                console.log('Time until expiration:', decoded.exp - currentTime, 'seconds');
            }
        } catch (e) {
            console.error('Error decoding token:', e);
        }
    }
    console.log('User data exists:', !!userData);
    if (userData) {
        try {
            const user = JSON.parse(userData);
            console.log('User data:', {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            });
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
    console.log('Auth cookie exists:', document.cookie.includes('safe_auth_token'));
    window.addEventListener('load', function() {
        console.log('Page loaded - auth check complete');
    });
})(); 