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
};

module.exports = nextConfig;
