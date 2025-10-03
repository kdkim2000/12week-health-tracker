// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = '12week-health-tracker';

const nextConfig: NextConfig = {
  // 정적 export 설정 - 가장 중요!
  output: 'export',
  
  // 빌드 출력 디렉토리
  distDir: 'out',
  
  // GitHub Pages 경로 설정
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}` : '',
  
  // 정적 배포를 위한 설정
  trailingSlash: true,
  
  // 이미지 설정 (experimental이 아닌 최상위 설정)
  images: {
    unoptimized: true,
  },
  
  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint 설정
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // experimental 섹션에서 images 제거하고 필요한 것만 유지
  experimental: {
    // 패키지 import 최적화만 유지
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
};

export default nextConfig;