// E:\apps\12week-health-tracker\lib\firebase\firestore.ts
/**
 * Firestore 데이터베이스 작업
 * - 사용자 프로필 CRUD
 * - 일일 체크 CRUD
 * - 실시간 동기화
 * - Timestamp <-> Date 자동 변환
 */

import {
  doc,
  setDoc,
  getDoc,
  collection,
  query,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from './config';
import { User, DailyCheck } from '@/types';

// ============================================
// 헬퍼 함수: Timestamp 변환
// ============================================
/**
 * undefined 필드를 제거하는 헬퍼 함수
 */
function removeUndefinedFields(obj: any): any {
  const cleaned: any = {};
  
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  
  return cleaned;
}

/**
 * Firestore Timestamp를 Date로 변환
 * @param timestamp - Firestore Timestamp 또는 Date
 * @returns Date 객체
 */
function convertTimestampToDate(timestamp: any): Date {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  if (timestamp?.toDate) {
    return timestamp.toDate();
  }
  if (timestamp instanceof Date) {
    return timestamp;
  }
  // 문자열인 경우 (ISO 형식)
  if (typeof timestamp === 'string') {
    return new Date(timestamp);
  }
  // 기본값: 현재 시간
  console.warn('⚠️ 알 수 없는 timestamp 형식:', timestamp);
  return new Date();
}

/**
 * Date를 Firestore Timestamp로 변환
 * @param date - Date 객체 또는 문자열
 * @returns Firestore Timestamp
 */
function convertDateToTimestamp(date: Date | string): Timestamp {
  if (date instanceof Date) {
    return Timestamp.fromDate(date);
  }
  if (typeof date === 'string') {
    return Timestamp.fromDate(new Date(date));
  }
  return Timestamp.now();
}

// ============================================
// 사용자 프로필 관련 함수
// ============================================

/**
 * 사용자 프로필 생성
 * @param user - 사용자 정보
 */
export async function createUserProfile(user: User): Promise<void> {
  try {
    const userRef = doc(db, 'users', user.id);
    
    // Date를 Timestamp로 변환하여 저장
    await setDoc(userRef, {
      id: user.id,
      email: user.email,
      initialWeight: user.initialWeight,
      targetWeight: user.targetWeight,
      initialWaist: user.initialWaist,
      targetWaist: user.targetWaist,
      startDate: convertDateToTimestamp(user.startDate),
      createdAt: Timestamp.now(),
    });
    
    console.log('✅ 사용자 프로필 생성 완료:', user.id);
  } catch (error) {
    console.error('❌ 사용자 프로필 생성 실패:', error);
    throw new Error('사용자 프로필 생성에 실패했습니다.');
  }
}

/**
 * 사용자 프로필 가져오기
 * @param userId - 사용자 ID
 * @returns 사용자 정보 또는 null
 */
export async function getUserProfile(userId: string): Promise<User | null> {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const data = userSnap.data();
      
      // Timestamp를 Date로 변환하여 반환
      return {
        id: userSnap.id,
        email: data.email,
        password: '', // 비밀번호는 반환하지 않음
        initialWeight: data.initialWeight,
        targetWeight: data.targetWeight,
        initialWaist: data.initialWaist,
        targetWaist: data.targetWaist,
        startDate: convertTimestampToDate(data.startDate),
        createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
      };
    }

    return null;
  } catch (error) {
    console.error('❌ 사용자 프로필 조회 실패:', error);
    throw new Error('사용자 프로필 조회에 실패했습니다.');
  }
}

/**
 * 사용자 프로필 업데이트
 * @param userId - 사용자 ID
 * @param updates - 업데이트할 필드
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<User>
): Promise<void> {
  try {
    const userRef = doc(db, 'users', userId);
    
    // Date 필드를 Timestamp로 변환
    const convertedUpdates: any = { ...updates };
    if (updates.startDate) {
      convertedUpdates.startDate = convertDateToTimestamp(updates.startDate);
    }
    
    await updateDoc(userRef, convertedUpdates);
    console.log('✅ 사용자 프로필 업데이트 완료:', userId);
  } catch (error) {
    console.error('❌ 사용자 프로필 업데이트 실패:', error);
    throw new Error('사용자 프로필 업데이트에 실패했습니다.');
  }
}

/**
 * 일일 체크 저장 (플랫 구조)
 */
export async function saveDailyCheck(
  userId: string,
  dailyCheck: DailyCheck
): Promise<void> {
  try {
    if (!dailyCheck.date) {
      throw new Error('날짜 정보가 없습니다.');
    }
    
    // undefined 필드 제거
    const cleanedCheck = removeUndefinedFields({
      ...dailyCheck,
      userId,
      updatedAt: Timestamp.now(),
    });
    
    const checkRef = doc(db, 'dailyChecks', `${userId}_${dailyCheck.date}`);
    
    await setDoc(checkRef, cleanedCheck, { merge: true });
    
    console.log('✅ 일일 체크 저장 완료:', dailyCheck.date);
  } catch (error) {
    console.error('❌ 일일 체크 저장 실패:', error);
    throw error;
  }
}
/**
 * 특정 날짜의 일일 체크 가져오기
 * @param userId - 사용자 ID
 * @param date - 날짜 (YYYY-MM-DD)
 * @returns 일일 체크 데이터 또는 null
 */
export async function getDailyCheck(
  userId: string,
  date: string
): Promise<DailyCheck | null> {
  try {
    const checkRef = doc(db, 'dailyChecks', userId, 'checks', date);
    const checkSnap = await getDoc(checkRef);

    if (checkSnap.exists()) {
      const data = checkSnap.data();
      return {
        ...data,
        createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : undefined,
        updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : undefined,
      } as DailyCheck;
    }

    return null;
  } catch (error) {
    console.error('❌ 일일 체크 조회 실패:', error);
    throw new Error('일일 체크 조회에 실패했습니다.');
  }
}

/**
 * 모든 일일 체크 가져오기
 * @param userId - 사용자 ID
 * @returns 날짜를 키로 하는 일일 체크 객체
 */
export async function getAllDailyChecks(
  userId: string
): Promise<Record<string, DailyCheck>> {
  try {
    const checksRef = collection(db, 'dailyChecks', userId, 'checks');
    const querySnapshot = await getDocs(checksRef);

    const dailyChecks: Record<string, DailyCheck> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dailyChecks[doc.id] = {
        ...data,
        createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : undefined,
        updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : undefined,
      } as DailyCheck;
    });

    console.log(`✅ 일일 체크 ${querySnapshot.size}개 조회 완료`);
    return dailyChecks;
  } catch (error) {
    console.error('❌ 일일 체크 목록 조회 실패:', error);
    throw new Error('일일 체크 목록 조회에 실패했습니다.');
  }
}

/**
 * 특정 기간의 일일 체크 가져오기
 * @param userId - 사용자 ID
 * @param startDate - 시작 날짜
 * @param endDate - 종료 날짜
 * @returns 날짜를 키로 하는 일일 체크 객체
 */
export async function getDailyChecksByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Record<string, DailyCheck>> {
  try {
    const checksRef = collection(db, 'dailyChecks', userId, 'checks');
    const q = query(
      checksRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date', 'asc')
    );

    const querySnapshot = await getDocs(q);

    const dailyChecks: Record<string, DailyCheck> = {};
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      dailyChecks[doc.id] = {
        ...data,
        createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : undefined,
        updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : undefined,
      } as DailyCheck;
    });

    console.log(
      `✅ 기간별 일일 체크 ${querySnapshot.size}개 조회 완료 (${startDate} ~ ${endDate})`
    );
    return dailyChecks;
  } catch (error) {
    console.error('❌ 기간별 일일 체크 조회 실패:', error);
    throw new Error('기간별 일일 체크 조회에 실패했습니다.');
  }
}

/**
 * 일일 체크 삭제
 * @param userId - 사용자 ID
 * @param date - 날짜
 */
export async function deleteDailyCheck(
  userId: string,
  date: string
): Promise<void> {
  try {
    const checkRef = doc(db, 'dailyChecks', userId, 'checks', date);
    await deleteDoc(checkRef);
    console.log('✅ 일일 체크 삭제 완료:', date);
  } catch (error) {
    console.error('❌ 일일 체크 삭제 실패:', error);
    throw new Error('일일 체크 삭제에 실패했습니다.');
  }
}

// ============================================
// 실시간 동기화 함수
// ============================================

/**
 * 사용자 프로필 실시간 리스너
 * @param userId - 사용자 ID
 * @param callback - 데이터 변경 시 호출될 콜백 함수
 * @returns unsubscribe 함수
 */
export function subscribeToUserProfile(
  userId: string,
  callback: (user: User | null) => void
) {
  const userRef = doc(db, 'users', userId);

  return onSnapshot(
    userRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        
        // Timestamp를 Date로 변환
        const user: User = {
          id: doc.id,
          email: data.email,
          password: '',
          initialWeight: data.initialWeight,
          targetWeight: data.targetWeight,
          initialWaist: data.initialWaist,
          targetWaist: data.targetWaist,
          startDate: convertTimestampToDate(data.startDate),
          createdAt: data.createdAt?.toDate().toISOString() || new Date().toISOString(),
        };
        callback(user);
        console.log('🔄 사용자 프로필 실시간 업데이트');
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('❌ 사용자 프로필 실시간 동기화 오류:', error);
    }
  );
}

/**
 * 일일 체크 실시간 리스너 (플랫 구조)
 */
export function subscribeToDailyChecks(
  userId: string,
  callback: (dailyChecks: Record<string, DailyCheck>) => void
) {
  const checksRef = collection(db, 'dailyChecks');
  const q = query(checksRef, where('userId', '==', userId));

  return onSnapshot(
    q,
    (querySnapshot) => {
      const dailyChecks: Record<string, DailyCheck> = {};
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        // date를 키로 사용
        dailyChecks[data.date] = {
          ...data,
          createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : undefined,
          updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : undefined,
        } as DailyCheck;
      });
      
      callback(dailyChecks);
      // 데이터가 있을 때만 로그 출력
      if (querySnapshot.size > 0) {
        console.log(`🔄 실시간 동기화: ${querySnapshot.size}개 체크 업데이트`);
      }
    },
    (error) => {
      console.error('❌ 일일 체크 실시간 동기화 오류:', error);
    }
  );
}

/**
 * 특정 날짜 일일 체크 실시간 리스너
 * @param userId - 사용자 ID
 * @param date - 날짜
 * @param callback - 데이터 변경 시 호출될 콜백 함수
 * @returns unsubscribe 함수
 */
export function subscribeToDailyCheck(
  userId: string,
  date: string,
  callback: (dailyCheck: DailyCheck | null) => void
) {
  const checkRef = doc(db, 'dailyChecks', userId, 'checks', date);

  return onSnapshot(
    checkRef,
    (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        // Timestamp를 ISO 문자열로 변환
        callback({
          ...data,
          createdAt: data.createdAt ? convertTimestampToDate(data.createdAt).toISOString() : undefined,
          updatedAt: data.updatedAt ? convertTimestampToDate(data.updatedAt).toISOString() : undefined,
        } as DailyCheck);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('❌ 일일 체크 실시간 동기화 오류:', error);
    }
  );
}