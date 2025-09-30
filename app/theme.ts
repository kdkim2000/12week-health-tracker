// 파일 경로: app/theme.ts
// 설명: MUI 테마 설정 (별도 파일로 분리)

'use client';

import { createTheme } from '@mui/material/styles';

/**
 * MUI 테마 객체
 * - Client Component에서 사용할 수 있도록 별도 파일로 분리
 */
const theme = createTheme({
  // 색상 팔레트
  palette: {
    primary: {
      main: '#2196F3', // 파란색
    },
    secondary: {
      main: '#FF4081', // 핑크색
    },
    success: {
      main: '#4CAF50', // 초록색
    },
    warning: {
      main: '#FFC107', // 노란색
    },
    error: {
      main: '#F44336', // 빨간색
    },
  },
  
  // 타이포그래피 (폰트 스타일)
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  
  // 컴포넌트 기본 스타일 커스터마이징
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // 버튼 텍스트 대문자 변환 비활성화
          borderRadius: 8, // 둥근 모서리
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12, // 종이 컴포넌트 둥근 모서리
        },
      },
    },
  },
});

export default theme;