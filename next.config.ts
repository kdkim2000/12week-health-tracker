// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = '12week-health-tracker';

const nextConfig: NextConfig = {
  // ✅ 정적 export 설정 - 반드시 필요!
  output: 'export',
  
  // ✅ 빌드 출력 디렉토리
  distDir: 'out',
  
  // ✅ GitHub Pages 경로 설정
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}` : '',
  
  // ✅ 정적 배포 설정
  trailingSlash: true,
  
  // ✅ 이미지 설정 (experimental 아님!)
  images: {
    unoptimized: true,
  },
  
  // ✅ TypeScript 및 ESLint 설정
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;