// eslint.config.mjs
// 초보자를 위한 최소한의 ESLint 설정
// - 기본적인 규칙만 적용
// - 엄격하지 않은 경고 위주 설정
// - 학습에 방해가 되지 않도록 구성

import js from '@eslint/js';
import typescriptParser from '@typescript-eslint/parser';

export default [
  // JavaScript 기본 규칙 (권장사항만)
  js.configs.recommended,
  
  // 메인 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    
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
      'node_modules/**',
      'out/**',
      'public/**',
      'dist/**',
      'build/**',
      '*.config.*',
    ],
  },
];
