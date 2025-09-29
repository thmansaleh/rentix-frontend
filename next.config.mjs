/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for i18n
  experimental: {
    // Enable server components
  },
  
  // Add font optimization
  images: {
    domains: ['fonts.gstatic.com', 'fonts.googleapis.com'],
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
