// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = '12week-health-tracker';

const nextConfig: NextConfig = {
  // Static Export 설정 (GitHub Pages 배포용)
  output: 'export',
  
  // 빌드 출력 디렉토리 설정
  distDir: 'out',
  
  // GitHub Pages 배포를 위한 base path 설정
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}` : '', // 끝에 슬래시 제거
  
  // 정적 배포를 위한 trailing slash 설정
  trailingSlash: true,
  
  // 이미지 최적화 비활성화 (GitHub Pages에서 필요)
  images: {
    unoptimized: true,
    // 외부 이미지 도메인 설정 (필요한 경우)
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // 모든 HTTPS 도메인 허용
      },
    ],
  },
  
  // ESLint 설정 (초보자 친화적)
  eslint: {
    ignoreDuringBuilds: false, // 빌드 시 ESLint 검사 수행
  },
  
  // TypeScript 설정
  typescript: {
    ignoreBuildErrors: false, // 타입 에러 시 빌드 실패
  },
  
  // 실험적 기능 (성능 최적화)
  experimental: {
    // MUI 등 큰 라이브러리의 import 최적화
    optimizePackageImports: ['@mui/material', '@mui/icons-material'],
  },
  
  // 환경 변수 설정 (클라이언트에서 사용 가능)
  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repoName}` : '',
  },
  
  // Firebase 환경 변수를 빌드 시 포함
  // GitHub Secrets에서 주입된 값들이 클라이언트 코드에서 사용 가능해짐
  // env: {
  //   NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
  //   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  //   NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
  //   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  //   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  //   NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  //   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
  // },
};

export default nextConfig;