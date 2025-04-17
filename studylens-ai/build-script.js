const { execSync } = require('child_process');
const path = require('path');

console.log('Starting build process...');

try {
  // Get the path to the local Next.js package
  const nextPath = path.resolve(__dirname, 'node_modules', '.bin', 'next');
  console.log(`Next.js path: ${nextPath}`);
  
  // Run the build command
  console.log('Running next build...');
  execSync(`"${nextPath}" build`, { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
} 