import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  images:{
    remotePatterns:[
      {
        hostname: 'images.squarespace-cdn.com',
        protocol: 'https',
        port: ''
      },
      {
        hostname: 'kindly-horse-150.convex.cloud',
        protocol: 'https',
        port: ''
      }
    ]
  }
};

export default nextConfig;
