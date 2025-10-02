// lib/firebase/auth.ts
/**
 * Firebase Authentication 관련 함수
 * - 회원가입, 로그인, 로그아웃
 * - 현재 사용자 정보 가져오기
 */

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError,
} from 'firebase/auth';
import { auth } from './config';
import { createUserProfile, getUserProfile } from './firestore';
import { User } from '@/types';

/**
 * 회원가입
 * @param email - 이메일
 * @param password - 비밀번호
 * @param userData - 사용자 추가 정보 (체중, 목표 등)
 * @returns 생성된 사용자 정보
 */
export async function signUp(
  email: string,
  password: string,
  userData: {
    initialWeight: number;
    targetWeight: number;
    initialWaist: number;
    targetWaist: number;
    startDate: string;
  }
): Promise<User> {
  try {
    // Firebase Authentication에 사용자 생성
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Firestore에 사용자 프로필 생성
    const user: User = {
      id: userCredential.user.uid,
      email,
      password: '', // Firebase Auth 사용 시 비밀번호는 저장하지 않음
      ...userData,
      createdAt: new Date().toISOString(),
    };

    await createUserProfile(user);

    console.log('✅ 회원가입 성공:', user.id);
    return user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('❌ 회원가입 실패:', authError);
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * 로그인
 * @param email - 이메일
 * @param password - 비밀번호
 * @returns 로그인된 사용자 정보
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    // Firebase Authentication 로그인
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Firestore에서 사용자 프로필 가져오기
    const user = await getUserProfile(userCredential.user.uid);

    if (!user) {
      throw new Error('사용자 정보를 찾을 수 없습니다.');
    }

    console.log('✅ 로그인 성공:', user.id);
    return user;
  } catch (error) {
    const authError = error as AuthError;
    console.error('❌ 로그인 실패:', authError);
    throw new Error(getAuthErrorMessage(authError.code));
  }
}

/**
 * 로그아웃
 */
export async function logOut(): Promise<void> {
  try {
    await signOut(auth);
    console.log('✅ 로그아웃 성공');
  } catch (error) {
    console.error('❌ 로그아웃 실패:', error);
    throw new Error('로그아웃에 실패했습니다.');
  }
}

/**
 * 현재 로그인된 사용자 가져오기
 * @returns 현재 사용자 또는 null
 */
export function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser;
}

/**
 * 인증 상태 변경 리스너
 * @param callback - 인증 상태 변경 시 호출될 콜백 함수
 * @returns unsubscribe 함수
 */
export function onAuthStateChange(
  callback: (user: FirebaseUser | null) => void
) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Firebase Auth 에러 메시지 한글화
 * @param errorCode - Firebase Auth 에러 코드
 * @returns 한글 에러 메시지
 */
function getAuthErrorMessage(errorCode: string): string {
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
    'auth/invalid-email': '유효하지 않은 이메일 형식입니다.',
    'auth/operation-not-allowed': '이메일/비밀번호 로그인이 비활성화되어 있습니다.',
    'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
    'auth/user-disabled': '비활성화된 계정입니다.',
    'auth/user-not-found': '존재하지 않는 계정입니다.',
    'auth/wrong-password': '잘못된 비밀번호입니다.',
    'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
    'auth/too-many-requests': '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
  };

  return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
}

/**
 * 이메일 형식 검증
 * @param email - 검증할 이메일
 * @returns 유효한 이메일인지 여부
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 강도 검증
 * @param password - 검증할 비밀번호
 * @returns 검증 결과 { valid, message }
 */
export function validatePassword(password: string): {
  valid: boolean;
  message: string;
} {
  if (password.length < 6) {
    return { valid: false, message: '비밀번호는 6자 이상이어야 합니다.' };
  }
  if (password.length > 128) {
    return { valid: false, message: '비밀번호는 128자 이하여야 합니다.' };
  }
  return { valid: true, message: '사용 가능한 비밀번호입니다.' };
}