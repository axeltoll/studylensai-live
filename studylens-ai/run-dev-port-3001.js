// Direct Next.js runner with custom port
const path = require('path');
const { spawn } = require('child_process');

// Log the current directory
console.log('Current directory:', process.cwd());

// We need to use npx instead of trying to find the Next.js executable
console.log('Starting Next.js development server on port 3001 using npx...');

try {
  // Use npx to run next directly with port 3001
  const nextProcess = spawn('npx', ['next', 'dev', '-p', '3001'], {
    stdio: 'inherit',
    shell: true,
    windowsVerbatimArguments: true
  });
  
  nextProcess.on('error', (err) => {
    console.error('Failed to start Next.js:', err);
  });
  
} catch (error) {
  console.error('Error:', error.message);
} 