/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for i18n
  experimental: {
    // Enable server components
  },
  
  // Add font optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fonts.gstatic.com',
      },
      {
        protocol: 'https',
        hostname: 'fonts.googleapis.com',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
  
  // Add headers for language detection
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'x-locale',
            value: 'ar', // Default locale
          },
        ],
      },
    ];
  },
};

export default nextConfig;
