// Simple script to check Node.js environment
console.log('Node.js version:', process.version);
console.log('PATH:', process.env.PATH);
console.log('Current directory:', process.cwd());
console.log('Next.js path check:');
try {
  const nextPath = require.resolve('next');
  console.log('Next.js found at:', nextPath);
} catch (error) {
  console.error('Next.js not found:', error.message);
} 