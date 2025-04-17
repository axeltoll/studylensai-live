const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting NPM environment reset...');

try {
  // Clean node_modules
  console.log('Removing node_modules directory...');
  const nodeModulesPath = path.join(__dirname, 'node_modules');
  if (fs.existsSync(nodeModulesPath)) {
    execSync('rmdir /s /q node_modules', { stdio: 'inherit' });
  }
  
  // Clean package-lock.json
  console.log('Removing package-lock.json...');
  const packageLockPath = path.join(__dirname, 'package-lock.json');
  if (fs.existsSync(packageLockPath)) {
    fs.unlinkSync(packageLockPath);
  }
  
  // Clean .next directory
  console.log('Removing .next directory...');
  const nextDirPath = path.join(__dirname, '.next');
  if (fs.existsSync(nextDirPath)) {
    execSync('rmdir /s /q .next', { stdio: 'inherit' });
  }
  
  // Install dependencies
  console.log('Installing dependencies...');
  execSync('npm install', { stdio: 'inherit' });
  
  console.log('Environment reset completed successfully!');
} catch (error) {
  console.error('Environment reset failed:', error.message);
  process.exit(1);
} 