/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  reactStrictMode: false,
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

module.exports = nextConfig; 