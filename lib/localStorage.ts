// 파일 경로: lib/localStorage.ts
// 설명: v2.0 로컬 스토리지 관리 (확장된 데이터 구조)

import type { User, DailyCheck, LocalStorageData } from '@/types';

const STORAGE_KEY = 'health-tracker-v2-data';

/**
 * 초기 데이터 구조
 */
const initialData: LocalStorageData = {
  currentUser: null,
  users: {},
  dailyChecks: {},
};

/**
 * 로컬 스토리지에서 데이터 가져오기
 */
function getData(): LocalStorageData {
  if (typeof window === 'undefined') {
    return initialData;
  }

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
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
 * 로컬 스토리지에 데이터 저장
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
 * 현재 사용자 ID 가져오기
 */
export function getCurrentUserId(): string | null {
  const data = getData();
  return data.currentUser;
}

/**
 * 현재 사용자 정보 가져오기
 */
export function getCurrentUser(): User | null {
  const data = getData();
  if (!data.currentUser) return null;
  return data.users[data.currentUser] || null;
}

/**
 * 로그인 처리
 */
export function setCurrentUser(userId: string): void {
  const data = getData();
  data.currentUser = userId;
  setData(data);
}

/**
 * 로그아웃
 */
export function logout(): void {
  const data = getData();
  data.currentUser = null;
  setData(data);
}

/**
 * 이메일로 사용자 찾기
 */
export function getUserByEmail(email: string): User | null {
  const data = getData();
  const users = Object.values(data.users);
  return users.find(user => user.email === email) || null;
}

/**
 * 새 사용자 생성 (v2.0 - 초기 체중/허리둘레 포함)
 */
export function createUser(
  email: string,
  password: string,
  startDate: string,
  initialWeight: number,
  targetWeight: number,
  initialWaist: number,
  targetWaist: number
): User {
  const data = getData();
  
  const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  const newUser: User = {
    id: userId,
    email,
    password,
    startDate,
    createdAt: new Date().toISOString(),
    initialWeight,
    targetWeight,
    initialWaist,
    targetWaist,
  };

  data.users[userId] = newUser;
  data.dailyChecks[userId] = {};
  data.currentUser = userId;
  
  setData(data);
  return newUser;
}

/**
 * 특정 날짜의 체크리스트 가져오기
 */
export function getDailyCheck(userId: string, date: string): DailyCheck | null {
  const data = getData();
  return data.dailyChecks[userId]?.[date] || null;
}

/**
 * 체크리스트 저장 (v2.0 - 12개 항목)
 */
export function saveDailyCheck(userId: string, check: DailyCheck): void {
  const data = getData();
  
  if (!data.dailyChecks[userId]) {
    data.dailyChecks[userId] = {};
  }
  
  data.dailyChecks[userId][check.date] = check;
  setData(data);
}

/**
 * 모든 체크리스트 가져오기
 */
export function getAllDailyChecks(userId: string): { [date: string]: DailyCheck } {
  const data = getData();
  return data.dailyChecks[userId] || {};
}

/**
 * 체크리스트 삭제
 */
export function deleteDailyCheck(userId: string, date: string): void {
  const data = getData();
  if (data.dailyChecks[userId]?.[date]) {
    delete data.dailyChecks[userId][date];
    setData(data);
  }
}

/**
 * 모든 데이터 초기화
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}