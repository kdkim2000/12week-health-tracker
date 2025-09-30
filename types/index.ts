// 파일 경로: types/index.ts
// 설명: 애플리케이션 전체에서 사용되는 TypeScript 타입 정의

/**
 * 사용자 정보 타입
 * - 로컬 스토리지에 저장되는 사용자 데이터 구조
 */
export interface User {
  id: string;                // 고유 식별자 (UUID 형식)
  email: string;             // 사용자 이메일 (로그인 ID로 사용)
  password: string;          // 비밀번호 (실제 서비스에서는 해시 처리 필요)
  startDate: string;         // 12주 프로그램 시작일 (ISO 8601 형식: YYYY-MM-DD)
  createdAt: string;         // 계정 생성일시
}

/**
 * 일일 체크리스트 타입
 * - 매일의 운동, 식단, 체중 기록을 저장
 */
export interface DailyCheck {
  date: string;              // 기록 날짜 (YYYY-MM-DD)
  exerciseCompleted: boolean; // 운동 완료 여부
  dietCompleted: boolean;    // 식단 준수 여부
  weight: number | null;     // 체중 기록 (kg, null이면 미기록)
}

/**
 * 로컬 스토리지 전체 구조 타입
 * - 브라우저 로컬 스토리지에 저장되는 전체 데이터 구조
 */
export interface LocalStorageData {
  currentUser: string | null;           // 현재 로그인한 사용자 ID
  users: {
    [userId: string]: User;             // 모든 사용자 정보 (userId를 키로 사용)
  };
  dailyChecks: {
    [userId: string]: {
      [date: string]: DailyCheck;       // 사용자별, 날짜별 체크리스트
    };
  };
}

/**
 * 주간 통계 타입
 * - 각 주차의 달성률 계산 결과
 */
export interface WeeklyStats {
  weekNumber: number;        // 주차 (1-12)
  totalDays: number;         // 해당 주의 총 일수
  completedDays: number;     // 모든 항목을 완료한 날 수
  partialDays: number;       // 일부 항목만 완료한 날 수
  achievementRate: number;   // 달성률 (0-100)
}

/**
 * 달력 날짜 타입
 * - 달력 컴포넌트에서 사용하는 날짜 정보
 */
export interface CalendarDay {
  date: string;              // 날짜 (YYYY-MM-DD)
  dayOfWeek: number;         // 요일 (0: 일요일, 6: 토요일)
  weekNumber: number;        // 주차 (1-12)
  isToday: boolean;          // 오늘 날짜 여부
  isPast: boolean;           // 과거 날짜 여부
  isFuture: boolean;         // 미래 날짜 여부
  status: 'completed' | 'partial' | 'incomplete' | 'future'; // 달성 상태
}