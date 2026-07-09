import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/products/:path+',
        destination: '/product-assets/:path+',
      },
    ];
  },
};

export default nextConfig;
