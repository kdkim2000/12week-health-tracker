/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'out',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // 프로덕션에서만 basePath 적용
  ...(process.env.NODE_ENV === 'production' && {
    basePath: '/12week-health-tracker',
    assetPrefix: '/12week-health-tracker',
  }),
};

module.exports = nextConfig;