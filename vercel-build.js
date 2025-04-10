// Custom build script for Vercel
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a temporary next.config.js that won't have conflicts
const tempConfig = `
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  reactStrictMode: false,
  output: 'standalone'
};

module.exports = nextConfig;
`;

// Backup original config
const configPath = path.resolve(__dirname, 'next.config.js');
let originalConfig = '';

try {
  originalConfig = fs.readFileSync(configPath, 'utf8');
} catch (err) {
  console.error('Error reading original config:', err);
}

// Write temporary config
fs.writeFileSync(configPath, tempConfig, 'utf8');
console.log('Using temporary next.config.js for build');

// Run next build
const buildProcess = spawn('npx', ['next', 'build'], { 
  stdio: 'inherit',
  shell: true
});

buildProcess.on('close', (code) => {
  // Restore original config
  fs.writeFileSync(configPath, originalConfig, 'utf8');
  console.log('Restored original next.config.js');
  
  if (code !== 0) {
    console.error(`Build failed with code ${code}`);
    process.exit(code);
  }
  
  console.log('Build completed successfully');
}); 