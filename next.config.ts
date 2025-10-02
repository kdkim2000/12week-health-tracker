// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = '12week-health-tracker';

const nextConfig: NextConfig = {
  // Static Export 설정
  output: 'export',
  
  // GitHub Pages 배포를 위한 base path 설정
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  
  // 이미지 최적화 비활성화 (GitHub Pages에서 필요)
  images: {
    unoptimized: true,
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
  
  // ESLint 경고를 에러로 처리하지 않음 (초보자 친화적)
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // TypeScript 타입 에러를 빌드 실패로 처리
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
