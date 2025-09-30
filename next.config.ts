// 파일 경로: next.config.ts
// 설명: Next.js 프로젝트 설정 파일 (GitHub Pages 배포용)

import type { NextConfig } from 'next';

/**
 * GitHub Pages 배포를 위한 Next.js 설정
 * - output: 'export' - 정적 HTML로 내보내기 (GitHub Pages 필수)
 * - basePath: GitHub Pages URL 구조에 맞춤
 * - images.unoptimized: 정적 사이트에서는 Next.js 이미지 최적화 사용 불가
 * 
 * 배포 URL 형식: https://[GitHub사용자명].github.io/[저장소명]/
 */
const nextConfig: NextConfig = {
  // React 엄격 모드 활성화 (개발 시 잠재적 문제 발견)
  reactStrictMode: true,
  
  // 보안: X-Powered-By 헤더 제거
  poweredByHeader: false,
  
  // ⭐ GitHub Pages 배포를 위한 필수 설정
  output: 'export',  // 'standalone'에서 'export'로 변경
  
  /**
   * ⭐ basePath 설정 - 매우 중요!
   * 
   * 아래 '저장소명'을 실제 GitHub 저장소 이름으로 변경하세요
   * 예시:
   * - 저장소명이 'my-portfolio'인 경우: '/my-portfolio'
   * - 저장소명이 'awesome-blog'인 경우: '/awesome-blog'
   * - 특별한 경우: [사용자명].github.io 저장소는 ''로 설정
   */
  basePath: process.env.NODE_ENV === 'production' 
    ? '/저장소명'  // 🔴 여기를 실제 저장소명으로 변경하세요!
    : '',
  
  // ⭐ 이미지 최적화 비활성화 (정적 사이트 필수)
  images: {
    unoptimized: true,
  },
  
  // 추가 최적화 옵션
  trailingSlash: true,  // URL 끝에 슬래시 추가 (GitHub Pages 호환성)
  
  // TypeScript 및 ESLint 설정
  typescript: {
    // 빌드 시 TypeScript 오류 무시 (개발 중인 경우)
    // 프로덕션 배포 전에는 false로 변경 권장
    ignoreBuildErrors: false,
  },
  eslint: {
    // 빌드 시 ESLint 오류 무시 (개발 중인 경우)
    // 프로덕션 배포 전에는 false로 변경 권장
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;