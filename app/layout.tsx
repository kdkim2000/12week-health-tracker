// 파일 경로: app/layout.tsx
// 설명: Next.js App Router의 루트 레이아웃 (React 19 호환)

import type { Metadata,Viewport } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from './theme';
/**
 * 메타데이터 설정
 */
export const metadata: Metadata = {
  title: '12주 건강관리 체크리스트',
  description: '12주간의 운동습관과 생활지표를 기록하고 관리하는 앱',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export const viewport: Viewport = {
  themeColor: 'black',
}
 
/**
 * RootLayout 컴포넌트
 * - Server Component로 유지 (no 'use client')
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0 }}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}