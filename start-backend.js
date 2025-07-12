#!/usr/bin/env node

import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 Starting SAFE Backend Server...\n');

// Check if backend directory exists
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found!');
  console.log('Please make sure you are in the correct directory.');
  process.exit(1);
}

// Check if package.json exists in backend
const packageJsonPath = path.join(backendPath, 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ Backend package.json not found!');
  console.log('Please run "npm install" in the backend directory first.');
  process.exit(1);
}

// Check if node_modules exists
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
  
  // Handle process termination
  process.on('SIGINT', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGINT');
  });
  
  process.on('SIGTERM', () => {
    console.log('\n🛑 Stopping server...');
    server.kill('SIGTERM');
  });
} 