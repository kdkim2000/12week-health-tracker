// eslint.config.mjs
// 초보자를 위한 최소한의 ESLint 설정 + Next.js 플러그인
// - 기본적인 규칙만 적용
// - 엄격하지 않은 경고 위주 설정
// - 학습에 방해가 되지 않도록 구성

import js from '@eslint/js';
import nextPlugin from '@next/eslint-plugin-next';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // JavaScript 기본 규칙 (권장사항만)
  js.configs.recommended,
  
  // Next.js 추천 규칙 추가
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@next/next': nextPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules,
      ...nextPlugin.configs['core-web-vitals'].rules,
    },
  },
  
  // 메인 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    
    plugins: {
      '@next/next': nextPlugin,
    },
    
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        // 브라우저 기본 객체들
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        
        // Node.js 환경
        process: 'readonly',
        
        // React
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    
    rules: {
      // 🔥 초보자를 위한 최소한의 규칙들
      
      // 기본적인 JavaScript 규칙 (경고만)
      'no-unused-vars': 'off',  // TypeScript가 처리하므로 끔
      'no-undef': 'off',        // TypeScript가 처리하므로 끔
      'prefer-const': 'warn',   // let 대신 const 사용 권장
      'no-var': 'warn',         // var 대신 let/const 사용
      
      // 콘솔은 학습용으로 허용
      'no-console': 'off',
      
      // Next.js 기본 규칙들 (경고로 설정)
      '@next/next/no-html-link-for-pages': 'warn',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-page-custom-font': 'warn',
      
      // React JSX에서 React import 불필요 (Next.js 17+)
      'react/react-in-jsx-scope': 'off',
      
      // 세미콜론 관련 (선택사항)
      'semi': ['warn', 'always'],
      
      // 따옴표 통일 (선택사항)
      'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
    },
  },
  
  // 무시할 파일들
  {
    ignores: [
      '.next/**',
      'out/**', // GitHub Pages 빌드 출력
      'node_modules/**',
      'public/**',
      'dist/**',
      'build/**',
      '*.config.*',
    ],
  },
];
