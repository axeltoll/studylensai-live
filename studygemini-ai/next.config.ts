import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ['storage.googleapis.com', 'lh3.googleusercontent.com'],
  },
  reactStrictMode: false,
  serverExternalPackages: ['lucide-react'],
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
