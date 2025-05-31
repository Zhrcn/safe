const fs = require('fs');
const path = require('path');

// Colors for avatars
const colors = [
  { bg: '#3B82F6', text: '#FFFFFF' }, // blue
  { bg: '#10B981', text: '#FFFFFF' }, // green
  { bg: '#F59E0B', text: '#FFFFFF' }, // amber
  { bg: '#EF4444', text: '#FFFFFF' }, // red
  { bg: '#8B5CF6', text: '#FFFFFF' }, // purple
];

// Initials for avatars
const initials = ['SJ', 'JD', 'MP', 'AK', 'RW'];

// Generate avatar SVGs
function generateAvatars() {
  const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
  
  // Make sure directory exists
  if (!fs.existsSync(avatarsDir)) {
    fs.mkdirSync(avatarsDir, { recursive: true });
  }
  
  // Generate avatar SVGs
  for (let i = 1; i <= 5; i++) {
    const color = colors[(i - 1) % colors.length];
    const initial = initials[(i - 1) % initials.length];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
  <rect width="200" height="200" fill="${color.bg}" rx="100" ry="100" />
  <text x="100" y="115" font-family="Arial" font-size="70" font-weight="bold" fill="${color.text}" text-anchor="middle">${initial}</text>
</svg>`;
    
    fs.writeFileSync(path.join(avatarsDir, `avatar-${i}.svg`), svg);
    console.log(`Generated avatar-${i}.svg`);
  }
  
  // Create a favicon
  const favicon = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#3B82F6" rx="16" ry="16" />
  <text x="32" y="42" font-family="Arial" font-size="32" font-weight="bold" fill="#FFFFFF" text-anchor="middle">S</text>
</svg>`;
  
  fs.writeFileSync(path.join(process.cwd(), 'public', 'favicon.svg'), favicon);
  console.log('Generated favicon.svg');
}

generateAvatars(); 