/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'res.cloudinary.com',
      'lh3.googleusercontent.com',
      'avatars.githubusercontent.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  // Enable static exports for Vercel
  output: 'export',
  // Disable the static directory in favor of the public directory
  distDir: 'out',
  // Disable the default static file handling
  generateBuildId: () => 'build',
  // Disable the default static optimization
  trailingSlash: true,
  // Disable the default image optimization
  images: {
    unoptimized: true,
  },
  // Disable the default static optimization
  swcMinify: true,
  // Disable the default static optimization
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
