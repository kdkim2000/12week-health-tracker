// 파일 경로: next.config.ts
// 설명: Next.js 프로젝트 설정 파일 (GitHub Pages 배포용)

import type { NextConfig } from 'next';

/**
 * GitHub Pages 배포를 위한 Next.js 설정
 * - output: 'export' - 정적 HTML로 내보내기 (GitHub Pages 필수)
 * - basePath: GitHub Pages URL 구조에 맞춤 (프로덕션 환경에서만)
 * - images.unoptimized: 정적 사이트에서는 Next.js 이미지 최적화 사용 불가
 * 
 * 배포 URL 형식: https://[GitHub사용자명].github.io/[저장소명]/
 * 
 * ⭐ 중요: 로컬 개발(npm run dev)과 프로덕션 배포를 구분하여 설정
 */

// 저장소명 설정 (한 곳에서만 변경하면 됨)
const REPO_NAME = '12week-health-tracker';

// 프로덕션 환경 여부 확인
const isProduction = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // React 엄격 모드 활성화 (개발 시 잠재적 문제 발견)
  reactStrictMode: true,
  
  // 보안: X-Powered-By 헤더 제거
  poweredByHeader: false,
  
  // ⭐ GitHub Pages 배포를 위한 필수 설정
  output: 'export',  // 정적 HTML로 내보내기
  
  /**
   * ⭐ basePath 설정 - ✅ 백틱(`)으로 감싸기
   * - 로컬 개발: '' (빈 문자열)
   * - 프로덕션: '/저장소명'
   */
  basePath: isProduction ? `/${REPO_NAME}` : '',
  
  /**
   * ⭐ assetPrefix 설정 - ✅ 백틱(`)으로 감싸기
   * - 로컬 개발: undefined (설정하지 않음)
   * - 프로덕션: '/저장소명'
   */
  assetPrefix: isProduction ? `/${REPO_NAME}` : undefined,
  
  // ⭐ 이미지 최적화 비활성화 (정적 사이트 필수)
  images: {
    unoptimized: true,
  },
  
  // 추가 최적화 옵션
  trailingSlash: true,  // URL 끝에 슬래시 추가 (GitHub Pages 호환성)
  
  // TypeScript 및 ESLint 설정
  typescript: {
    // 빌드 시 TypeScript 오류 무시하지 않음 (권장)
    ignoreBuildErrors: false,
  },
  eslint: {
    // 빌드 시 ESLint 경고는 무시 (개발 편의성)
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;