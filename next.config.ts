import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Quality levels for Image component optimization
    // 75: default, 90: hero images, 95: lightbox/full-screen
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Allow local network access for mobile testing during development
  // Replace IP with your local network IP (find with: hostname -I)
  ...(process.env.NODE_ENV === 'development' && {
    allowedDevOrigins: [
      'http://192.168.1.117:3000', // Example - update with your IP
    ],
  }),
};

export default nextConfig;
