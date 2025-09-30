// 파일 경로: lib/auth.ts
// 설명: 사용자 인증 관련 함수 (로그인, 회원가입, 유효성 검사)

import { getUserByEmail, createUser, setCurrentUser } from './localStorage';
import { getTodayString } from './dateUtils';

/**
 * 이메일 유효성 검사
 * @param email - 검사할 이메일
 * @returns 유효하면 true
 * 
 * 검사 기준:
 * - 기본적인 이메일 형식 (example@domain.com)
 * - 정규표현식 사용
 */
export function validateEmail(email: string): boolean {
  // 이메일 정규표현식: 문자@문자.문자
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * 비밀번호 유효성 검사
 * @param password - 검사할 비밀번호
 * @returns { valid: boolean, message: string }
 * 
 * 검사 기준:
 * - 최소 6자 이상
 * - 실제 서비스에서는 더 강력한 규칙 적용 권장
 *   (대문자, 소문자, 숫자, 특수문자 포함 등)
 */
export function validatePassword(password: string): { valid: boolean; message: string } {
  if (password.length < 6) {
    return {
      valid: false,
      message: '비밀번호는 최소 6자 이상이어야 합니다',
    };
  }
  
  return {
    valid: true,
    message: '',
  };
}

/**
 * 로그인 처리
 * @param email - 이메일
 * @param password - 비밀번호
 * @returns { success: boolean, message: string, userId?: string }
 * 
 * 동작 순서:
 * 1. 이메일로 사용자 찾기
 * 2. 비밀번호 확인
 * 3. 로그인 상태 저장
 */
export function login(email: string, password: string): {
  success: boolean;
  message: string;
  userId?: string;
} {
  // 1. 이메일 유효성 검사
  if (!validateEmail(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다',
    };
  }

  // 2. 사용자 찾기
  const user = getUserByEmail(email);
  if (!user) {
    return {
      success: false,
      message: '등록되지 않은 이메일입니다',
    };
  }

  // 3. 비밀번호 확인
  // 실제 서비스에서는 해시 비교 필요 (bcrypt.compare)
  if (user.password !== password) {
    return {
      success: false,
      message: '비밀번호가 일치하지 않습니다',
    };
  }

  // 4. 로그인 성공 - currentUser 설정
  setCurrentUser(user.id);

  return {
    success: true,
    message: '로그인 성공',
    userId: user.id,
  };
}

/**
 * 회원가입 처리
 * @param email - 이메일
 * @param password - 비밀번호
 * @param confirmPassword - 비밀번호 확인
 * @returns { success: boolean, message: string, userId?: string }
 * 
 * 동작 순서:
 * 1. 입력값 유효성 검사
 * 2. 이메일 중복 확인
 * 3. 새 사용자 생성 (시작일: 오늘)
 */
export function signup(
  email: string,
  password: string,
  confirmPassword: string
): {
  success: boolean;
  message: string;
  userId?: string;
} {
  // 1. 이메일 유효성 검사
  if (!validateEmail(email)) {
    return {
      success: false,
      message: '올바른 이메일 형식이 아닙니다',
    };
  }

  // 2. 비밀번호 유효성 검사
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return {
      success: false,
      message: passwordValidation.message,
    };
  }

  // 3. 비밀번호 확인
  if (password !== confirmPassword) {
    return {
      success: false,
      message: '비밀번호가 일치하지 않습니다',
    };
  }

  // 4. 이메일 중복 확인
  const existingUser = getUserByEmail(email);
  if (existingUser) {
    return {
      success: false,
      message: '이미 등록된 이메일입니다',
    };
  }

  // 5. 새 사용자 생성
  // 시작일은 오늘로 설정
  const newUser = createUser(email, password, getTodayString());

  return {
    success: true,
    message: '회원가입 성공! 12주 건강관리를 시작합니다.',
    userId: newUser.id,
  };
}

/**
 * 체중 유효성 검사
 * @param weight - 검사할 체중 (kg)
 * @returns { valid: boolean, message: string }
 * 
 * 검사 기준:
 * - 0보다 크고 300 이하 (합리적인 범위)
 * - 숫자 형식
 */
export function validateWeight(weight: number | null): { valid: boolean; message: string } {
  if (weight === null) {
    return { valid: true, message: '' }; // 체중 입력은 선택사항
  }

  if (isNaN(weight)) {
    return {
      valid: false,
      message: '올바른 숫자를 입력해주세요',
    };
  }

  if (weight <= 0 || weight > 300) {
    return {
      valid: false,
      message: '체중은 0보다 크고 300 이하여야 합니다',
    };
  }

  return {
    valid: true,
    message: '',
  };
}