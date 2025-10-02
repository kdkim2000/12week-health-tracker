// lib/firebase/config.ts
/**
 * Firebase 초기화 및 설정
 * - Firebase 앱 인스턴스 생성
 * - Authentication, Firestore 초기화
 */

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

// Firebase 설정 객체
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Firebase 설정 검증
function validateFirebaseConfig(): void {
    // 디버깅: 환경 변수 출력
  console.log('🔍 환경 변수 확인:');
  console.log('API_KEY:', process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? '설정됨' : '누락됨');
  console.log('AUTH_DOMAIN:', process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? '설정됨' : '누락됨');
  console.log('PROJECT_ID:', process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? '설정됨' : '누락됨');
  const requiredKeys = [
    'apiKey',
    'authDomain',
    'projectId',
    'storageBucket',
    'messagingSenderId',
    'appId',
  ];

  const missingKeys = requiredKeys.filter(
    (key) => !firebaseConfig[key as keyof typeof firebaseConfig]
  );

  if (missingKeys.length > 0) {
    throw new Error(
      `Firebase 설정이 누락되었습니다. .env.local 파일을 확인하세요.\n` +
        `누락된 키: ${missingKeys.join(', ')}`
    );
  }
}

// Firebase 앱 초기화 (중복 초기화 방지)
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (typeof window !== 'undefined') {
  // 클라이언트 사이드에서만 실행
  validateFirebaseConfig();

  // 이미 초기화된 앱이 있는지 확인
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase 초기화 완료');
  } else {
    app = getApps()[0];
    console.log('♻️ 기존 Firebase 앱 재사용');
  }

  // Auth 및 Firestore 초기화
  auth = getAuth(app);
  db = getFirestore(app);
}

// 내보내기
export { app, auth, db };

// Firebase 설정 정보 (디버깅용)
export const getFirebaseConfig = () => {
  return {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain,
    isConfigured: !!firebaseConfig.apiKey,
  };
};