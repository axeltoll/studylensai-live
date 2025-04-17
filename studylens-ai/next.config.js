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
  // Ensure both @/app/components and @/components paths work
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/components': 'src/app/components'
    };
    return config;
  }
};

module.exports = nextConfig;
