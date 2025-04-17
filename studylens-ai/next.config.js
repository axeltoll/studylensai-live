/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  reactStrictMode: false,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react']
  },
  // Improve path aliasing configuration
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': 'src/app/components',
      '@/app': 'src/app',
      '@/lib': 'src/lib'
    };
    return config;
  }
};

module.exports = nextConfig;
