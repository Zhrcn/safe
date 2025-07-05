const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting unified deployment...');

try {
  // Step 1: Install dependencies
  console.log('📦 Installing frontend dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('📦 Installing backend dependencies...');
  execSync('cd backend && npm install', { stdio: 'inherit' });
  
  // Step 2: Build the frontend with production environment
  console.log('🔨 Building frontend...');
  execSync('NODE_ENV=production npm run build', { stdio: 'inherit' });
  
  // Step 3: Start the unified server
  console.log('🚀 Starting unified server...');
  execSync('cd backend && NODE_ENV=production npm run start', { stdio: 'inherit' });
  
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
} 