/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  reactStrictMode: false,
  experimental: {
    esmExternals: 'loose', // This helps with esm modules
  },
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    
    // Add rule for handling mjs files
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: 'javascript/auto',
    });
    
    return config;
  },
};

module.exports = nextConfig;
