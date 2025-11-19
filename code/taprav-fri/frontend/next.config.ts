import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['test-matejbokal.si'],
  },
  async rewrites() {
    return [
      {
        source: '/taprav-fri/api/:path*',
        destination: 'http://localhost:80/taprav-fri/api/:path*',
      },
    ];
  },
};

export default nextConfig;