#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting SAFE Backend Server...\n');

const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found!');
  console.log('Please make sure you are in the correct directory.');
  process.exit(1);
}

const packageJsonPath = path.join(backendPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Backend package.json not found!');
  console.log('Please run "npm install" in the backend directory first.');
  process.exit(1);
}

const nodeModulesPath = path.join(backendPath, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('📦 Installing backend dependencies...');
  const install = spawn('npm', ['install'], { 
    cwd: backendPath, 
    stdio: 'inherit' 
  });
  
  install.on('close', (code) => {
    if (code === 0) {
      startServer();
    } else {
      console.error('❌ Failed to install dependencies');
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log('🔧 Starting backend server...');
  
  const server = spawn('npm', ['run', 'start'], { 
    cwd: backendPath, 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });
  
  server.on('error', (error) => {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  });
  
  server.on('close', (code) => {
    if (code !== 0) {
      console.error(`❌ Server exited with code ${code}`);
      process.exit(code);
    }
  });
  
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGTERM');
  });
} 