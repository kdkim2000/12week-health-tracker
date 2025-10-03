// eslint.config.mjs
// Next.js 15 호환 ESLint 설정

import js from '@eslint/js';

export default [
  // JavaScript 기본 규칙
  js.configs.recommended,
  
  // 메인 설정
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // 브라우저 전역 변수
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        localStorage: 'readonly',
        fetch: 'readonly',
        
        // Node.js 전역 변수
        process: 'readonly',
        module: 'readonly',  // module 전역 변수 추가
        require: 'readonly',
        exports: 'readonly',
        
        // React 전역 변수
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    
    rules: {
      // 초보자 친화적 규칙
      'no-unused-vars': 'off',
      'no-undef': 'off', 
      'prefer-const': 'warn',
      'no-var': 'warn',
      'no-console': 'off',
      'semi': ['warn', 'always'],
      'quotes': ['warn', 'single', { 'allowTemplateLiterals': true }],
    },
  },
  
  // 무시할 파일
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      'public/**',
      'dist/**',
      'build/**',
      '*.config.*',
    ],
  },
];
