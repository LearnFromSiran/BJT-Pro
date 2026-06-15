/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Allow larger image uploads to API routes (base64 photos of letters).
    serverActions: {
      bodySizeLimit: '15mb',
    },
  },
};

module.exports = nextConfig;
