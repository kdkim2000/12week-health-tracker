// next.config.js (TypeScript 대신 JavaScript 사용)
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;