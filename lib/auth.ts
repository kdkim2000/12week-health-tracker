// 파일 경로: lib/auth.ts
// 설명: v2.0 인증 함수 (신체정보 추가)

import { getUserByEmail, createUser, setCurrentUser } from './localStorage';

/**
 * 이메일 유효성 검사
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return {
      valid: false,
      message: '비밀번호는 최소 6자 이상이어야 합니다',
    };
  }
  
  return { valid: true, message: '' };
}

/**
 * 로그인 처리 (기존과 동일)
 */
export function login(email: string, password: string): {
  success: boolean;
  message: string;
  userId?: string;
} {
  if (!validateEmail(email)) {
    return { success: false, message: '올바른 이메일 형식이 아닙니다' };
  }

  const user = getUserByEmail(email);
  if (!user) {
    return { success: false, message: '등록되지 않은 이메일입니다' };
  }

  if (user.password !== password) {
    return { success: false, message: '비밀번호가 일치하지 않습니다' };
  }

  setCurrentUser(user.id);
  return { success: true, message: '로그인 성공', userId: user.id };
}

/**
 * 회원가입 처리 v2.0 (신체 정보 추가)
 */
export function signup(
  email: string,
  password: string,
  confirmPassword: string,
  startDate: string,
  initialWeight: number,
  targetWeight: number,
  initialWaist: number,
  targetWaist: number
): {
  success: boolean;
  message: string;
  userId?: string;
} {
  // 이메일 검증
  if (!validateEmail(email)) {
    return { success: false, message: '올바른 이메일 형식이 아닙니다' };
  }

  // 비밀번호 검증
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return { success: false, message: passwordValidation.message };
  }

  // 비밀번호 확인
  if (password !== confirmPassword) {
    return { success: false, message: '비밀번호가 일치하지 않습니다' };
  }

  // 이메일 중복 확인
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return { success: false, message: '이미 등록된 이메일입니다' };
  }

  // 신체 정보 검증
  if (initialWeight <= 0 || targetWeight <= 0 || initialWaist <= 0 || targetWaist <= 0) {
    return { success: false, message: '신체 정보를 올바르게 입력해주세요' };
  }

  // 새 사용자 생성
  const newUser = createUser(
    email,
    password,
    startDate,
    initialWeight,
    targetWeight,
    initialWaist,
    targetWaist
  );

  return {
    success: true,
    message: '회원가입 성공! 12주 건강관리를 시작합니다.',
    userId: newUser.id,
  };
}

/**
 * 체중 유효성 검사
 */
export function validateWeight(weight: number | null): { valid: boolean; message: string } {
  if (weight === null) {
    return { valid: true, message: '' };
  }

  if (isNaN(weight)) {
    return { valid: false, message: '올바른 숫자를 입력해주세요' };
  }

  if (weight <= 0 || weight > 300) {
    return { valid: false, message: '체중은 0보다 크고 300 이하여야 합니다' };
  }

  return { valid: true, message: '' };
}