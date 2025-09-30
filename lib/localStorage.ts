// 파일 경로: lib/localStorage.ts
// 설명: 로컬 스토리지 데이터 관리 유틸리티 함수
// 로컬 스토리지는 브라우저에 데이터를 저장하는 웹 API입니다

import type { User, DailyCheck, LocalStorageData } from '@/types';

// 로컬 스토리지 키 (데이터 저장 시 사용하는 고유 이름)
const STORAGE_KEY = 'health-tracker-data';

/**
 * 로컬 스토리지 초기 데이터 구조
 * - 앱 최초 실행 시 생성되는 기본 데이터
 */
const initialData: LocalStorageData = {
  currentUser: null,     // 로그인한 사용자 없음
  users: {},             // 사용자 목록 비어있음
  dailyChecks: {},       // 체크리스트 비어있음
};

/**
 * 로컬 스토리지에서 전체 데이터 가져오기
 * @returns LocalStorageData 객체
 * 
 * 동작 원리:
 * 1. localStorage.getItem()으로 저장된 JSON 문자열 가져오기
 * 2. JSON.parse()로 문자열을 JavaScript 객체로 변환
 * 3. 데이터가 없으면 초기 데이터 반환
 */
function getData(): LocalStorageData {
  // 브라우저 환경 체크 (Next.js는 서버에서도 실행되므로)
  if (typeof window === 'undefined') {
    return initialData;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      // 데이터가 없으면 초기 데이터를 저장하고 반환
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
      return initialData;
    }
    return JSON.parse(data) as LocalStorageData;
  } catch (error) {
    console.error('로컬 스토리지 읽기 오류:', error);
    return initialData;
  }
}

/**
 * 로컬 스토리지에 전체 데이터 저장
 * @param data - 저장할 데이터
 * 
 * 동작 원리:
 * 1. JavaScript 객체를 JSON.stringify()로 문자열로 변환
 * 2. localStorage.setItem()으로 저장
 */
function setData(data: LocalStorageData): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('로컬 스토리지 저장 오류:', error);
  }
}

/**
 * 현재 로그인한 사용자 ID 가져오기
 * @returns 사용자 ID 또는 null
 */
export function getCurrentUserId(): string | null {
  const data = getData();
  return data.currentUser;
}

/**
 * 현재 로그인한 사용자 정보 가져오기
 * @returns User 객체 또는 null
 */
export function getCurrentUser(): User | null {
  const data = getData();
  if (!data.currentUser) return null;
  return data.users[data.currentUser] || null;
}

/**
 * 사용자 로그인 처리
 * @param userId - 로그인할 사용자 ID
 * 
 * 동작:
 * - currentUser를 업데이트하여 로그인 상태 유지
 */
export function setCurrentUser(userId: string): void {
  const data = getData();
  data.currentUser = userId;
  setData(data);
}

/**
 * 로그아웃 처리
 * 
 * 동작:
 * - currentUser를 null로 설정
 */
export function logout(): void {
  const data = getData();
  data.currentUser = null;
  setData(data);
}

/**
 * 이메일로 사용자 찾기
 * @param email - 찾을 사용자 이메일
 * @returns User 객체 또는 null
 * 
 * 사용 예시: 로그인 시 이메일로 사용자 검색
 */
export function getUserByEmail(email: string): User | null {
  const data = getData();
  // Object.values()로 모든 사용자를 배열로 변환 후 검색
  const users = Object.values(data.users);
  return users.find(user => user.email === email) || null;
}

/**
 * 새 사용자 생성 (회원가입)
 * @param email - 이메일
 * @param password - 비밀번호
 * @param startDate - 12주 프로그램 시작일
 * @returns 생성된 User 객체
 * 
 * 동작:
 * 1. 고유 ID 생성 (타임스탬프 + 랜덤 문자열)
 * 2. 사용자 객체 생성
 * 3. 로컬 스토리지에 저장
 * 4. 자동 로그인 처리
 */
export function createUser(email: string, password: string, startDate: string): User {
  const data = getData();
  
  // 고유 ID 생성 (실제 서비스에서는 UUID 라이브러리 사용 권장)
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newUser: User = {
    id: userId,
    email,
    password, // 실제 서비스에서는 bcrypt 등으로 해시 처리 필요
    startDate,
    createdAt: new Date().toISOString(),
  };

  // 사용자 저장
  data.users[userId] = newUser;
  
  // 해당 사용자의 dailyChecks 초기화
  data.dailyChecks[userId] = {};
  
  // 자동 로그인
  data.currentUser = userId;
  
  setData(data);
  return newUser;
}

/**
 * 특정 날짜의 체크리스트 가져오기
 * @param userId - 사용자 ID
 * @param date - 날짜 (YYYY-MM-DD)
 * @returns DailyCheck 객체 또는 null
 */
export function getDailyCheck(userId: string, date: string): DailyCheck | null {
  const data = getData();
  return data.dailyChecks[userId]?.[date] || null;
}

/**
 * 체크리스트 저장
 * @param userId - 사용자 ID
 * @param check - 저장할 체크리스트 데이터
 * 
 * 동작:
 * - 해당 날짜의 데이터를 업데이트 또는 생성
 */
export function saveDailyCheck(userId: string, check: DailyCheck): void {
  const data = getData();
  
  // 사용자의 dailyChecks가 없으면 초기화
  if (!data.dailyChecks[userId]) {
    data.dailyChecks[userId] = {};
  }
  
  // 날짜별로 체크리스트 저장
  data.dailyChecks[userId][check.date] = check;
  
  setData(data);
}

/**
 * 사용자의 모든 체크리스트 가져오기
 * @param userId - 사용자 ID
 * @returns 날짜를 키로 하는 DailyCheck 객체들
 * 
 * 반환 예시:
 * {
 *   '2025-01-01': { date: '2025-01-01', exerciseCompleted: true, ... },
 *   '2025-01-02': { date: '2025-01-02', exerciseCompleted: false, ... }
 * }
 */
export function getAllDailyChecks(userId: string): { [date: string]: DailyCheck } {
  const data = getData();
  return data.dailyChecks[userId] || {};
}

/**
 * 특정 날짜의 체크리스트 삭제
 * @param userId - 사용자 ID
 * @param date - 삭제할 날짜
 */
export function deleteDailyCheck(userId: string, date: string): void {
  const data = getData();
  if (data.dailyChecks[userId]?.[date]) {
    delete data.dailyChecks[userId][date];
    setData(data);
  }
}

/**
 * 모든 데이터 초기화 (개발/테스트용)
 * 
 * 주의: 이 함수를 호출하면 모든 사용자 데이터가 삭제됩니다!
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}