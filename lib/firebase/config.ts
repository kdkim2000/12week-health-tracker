// lib/firebase/config.ts
/**
 * Firebase 초기화 및 설정 v3.0
 * - Firebase 앱 인스턴스 생성
 * - Authentication, Firestore 초기화
 * - 환경 변수 검증 및 디버깅
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// ============================================
// Firebase 설정 인터페이스
// ============================================
interface FirebaseConfig {
  apiKey: string | undefined;
  authDomain: string | undefined;
  projectId: string | undefined;
  storageBucket: string | undefined;
  messagingSenderId: string | undefined;
  appId: string | undefined;
  measurementId?: string | undefined;
}

// ============================================
// 환경 변수에서 Firebase 설정 로드
// ============================================
const firebaseConfig: FirebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// ============================================
// 설정 검증 및 디버깅
// ============================================
function validateFirebaseConfig(): void {
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔥 Firebase Configuration Check');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  const checks = [
    { name: 'API Key', key: 'apiKey', value: firebaseConfig.apiKey, required: true },
    { name: 'Auth Domain', key: 'authDomain', value: firebaseConfig.authDomain, required: true },
    { name: 'Project ID', key: 'projectId', value: firebaseConfig.projectId, required: true },
    { name: 'Storage Bucket', key: 'storageBucket', value: firebaseConfig.storageBucket, required: true },
    { name: 'Messaging Sender ID', key: 'messagingSenderId', value: firebaseConfig.messagingSenderId, required: true },
    { name: 'App ID', key: 'appId', value: firebaseConfig.appId, required: true },
    { name: 'Measurement ID', key: 'measurementId', value: firebaseConfig.measurementId, required: false },
  ];

  const errors: string[] = [];

  checks.forEach(({ name, key, value, required }) => {
    const exists = !!value;
    const isPlaceholder = value?.includes('your-') || value?.includes('here') || value === 'undefined';

    if (!exists && required) {
      const errorMsg = `${name}: 누락됨 (필수)`;
      errors.push(errorMsg);
      if (isDevelopment) {
        console.error(`❌ ${errorMsg}`);
      }
    } else if (isPlaceholder) {
      const errorMsg = `${name}: Placeholder 값 감지 - "${value}"`;
      errors.push(errorMsg);
      if (isDevelopment) {
        console.error(`❌ ${errorMsg}`);
      }
    } else if (exists) {
      // API Key는 일부만 표시 (보안)
      if (key === 'apiKey') {
        const masked = value!.substring(0, 10) + '...';
        if (isDevelopment) {
          console.log(`✅ ${name}: ${masked}`);
        }
      } else {
        if (isDevelopment) {
          console.log(`✅ ${name}: ${value}`);
        }
      }
    } else {
      if (isDevelopment) {
        console.log(`ℹ️ ${name}: 설정 안 됨 (선택사항)`);
      }
    }
  });

  if (isDevelopment) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  }

  // 오류가 있으면 상세 안내 출력
  if (errors.length > 0) {
    console.error('');
    console.error('🚨 Firebase 설정 오류 발견!');
    console.error('');
    console.error('발견된 오류:');
    errors.forEach(error => console.error(`  • ${error}`));
    console.error('');
    console.error('해결 방법:');
    console.error('1. 프로젝트 루트에 .env.local 파일 생성');
    console.error('2. Firebase Console에서 설정 값 복사');
    console.error('   → https://console.firebase.google.com/');
    console.error('   → 프로젝트 설정 → 일반 → 내 앱');
    console.error('3. .env.local 파일에 다음 형식으로 추가:');
    console.error('');
    console.error('   NEXT_PUBLIC_FIREBASE_API_KEY=실제_API_키');
    console.error('   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=프로젝트.firebaseapp.com');
    console.error('   NEXT_PUBLIC_FIREBASE_PROJECT_ID=프로젝트_ID');
    console.error('   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=프로젝트.appspot.com');
    console.error('   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=숫자');
    console.error('   NEXT_PUBLIC_FIREBASE_APP_ID=1:숫자:web:문자열');
    console.error('');
    console.error('4. 개발 서버 재시작: npm run dev');
    console.error('5. 브라우저 하드 리프레시: Ctrl + Shift + R');
    console.error('');

    throw new Error(
      `Firebase 설정 오류: ${errors.length}개의 문제가 발견되었습니다. ` +
      `콘솔 메시지를 확인하여 .env.local 파일을 수정하세요.`
    );
  }
}

// ============================================
// Firebase 앱 초기화
// ============================================
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

// 클라이언트 사이드에서만 초기화
if (typeof window !== 'undefined') {
  try {
    // 설정 검증
    validateFirebaseConfig();

    // 이미 초기화된 앱이 있는지 확인
    if (!getApps().length) {
      app = initializeApp(firebaseConfig as any);
      console.log('✅ Firebase 앱 초기화 완료');
    } else {
      app = getApps()[0];
      console.log('✅ 기존 Firebase 앱 재사용');
    }

    // Auth 및 Firestore 초기화
    auth = getAuth(app);
    db = getFirestore(app);

    // 개발 환경에서 전역 객체에 노출 (디버깅용)
    if (process.env.NODE_ENV === 'development') {
      (window as any).firebaseAuth = auth;
      (window as any).firebaseDb = db;
      (window as any).firebaseConfig = firebaseConfig;
      console.log('🔧 디버깅: window.firebaseAuth, window.firebaseDb 사용 가능');
    }
  } catch (error) {
    console.error('❌ Firebase 초기화 실패:', error);
    
    // 프로덕션에서는 에러를 throw하지만, 개발에서는 경고만 표시
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
}

// ============================================
// 내보내기
// ============================================
export { app, auth, db };

/**
 * Firebase 설정 정보 조회 (디버깅용)
 */
export const getFirebaseConfig = () => {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isConfigured: !!firebaseConfig.apiKey && 
                  !firebaseConfig.apiKey.includes('your-') && 
                  !firebaseConfig.apiKey.includes('here'),
    environment: process.env.NODE_ENV,
  };
};

/**
 * Firebase 연결 상태 확인
 */
export const checkFirebaseConnection = () => {
  const config = getFirebaseConfig();
  
  console.log('🔍 Firebase 연결 상태:');
  console.log('  • 설정 완료:', config.isConfigured ? '✅' : '❌');
  console.log('  • Project ID:', config.projectId || '없음');
  console.log('  • Auth Domain:', config.authDomain || '없음');
  console.log('  • 환경:', config.environment);
  
  return config.isConfigured;
};