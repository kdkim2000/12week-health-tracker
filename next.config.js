/** @type {import('next').NextConfig} */
const nextConfig = {
  // 정적 export 설정 - 가장 중요!
  output: 'export',
  
  // 출력 디렉토리
  distDir: 'out',
  
  // GitHub Pages용 설정
  basePath: process.env.NODE_ENV === 'production' ? '/12week-health-tracker' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/12week-health-tracker' : '',
  
  // 정적 배포 설정
  trailingSlash: true,
  
  // 이미지 설정 (experimental이 아닌 최상위)
  images: {
    unoptimized: true,
  },
  
  // TypeScript 및 ESLint 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true, // ESLint 오류로 인한 빌드 실패 방지
  },
};

module.exports = nextConfig;