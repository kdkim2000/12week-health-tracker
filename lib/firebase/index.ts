// lib/firebase/index.ts
/**
 * Firebase 관련 모든 함수를 통합 내보내기
 * - 다른 파일에서 import 편의성 제공
 */

// Firebase 설정
export { app, auth, db, getFirebaseConfig } from './config';

// Authentication
export {
  signUp,
  signIn,
  logOut,
  getCurrentUser,
  onAuthStateChange,
  isValidEmail,
  validatePassword,
} from './auth';

// Firestore
export {
  // 사용자 프로필
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  
  // 일일 체크
  saveDailyCheck,
  getDailyCheck,
  getAllDailyChecks,
  getDailyChecksByDateRange,
  deleteDailyCheck,
  
  // 실시간 동기화
  subscribeToUserProfile,
  subscribeToDailyChecks,
  subscribeToDailyCheck,
} from './firestore';
