import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https://res.cloudinary.com",
              "font-src 'self'",
              "connect-src 'self' https://api.cloudinary.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },
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
