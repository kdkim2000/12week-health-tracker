// 파일 경로: app/layout.tsx
// 설명: Next.js 15 메타데이터 API 업데이트 적용

import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import theme from './theme';

/**
 * 메타데이터 (viewport 제외)
 */
export const metadata: Metadata = {
  title: '12주 건강관리 체크리스트',
  description: '12주간의 운동습관과 생활지표를 기록하고 관리하는 앱',
};

/**
 * ⭐ Viewport를 별도로 export (Next.js 15+ 필수)
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: 'black',
};

/**
 * RootLayout 컴포넌트
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