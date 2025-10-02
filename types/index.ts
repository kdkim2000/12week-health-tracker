// 파일 경로: types/index.ts
// 설명: v2.0 새로운 타입 정의 - 12개 체크 항목 포함

/**
 * 사용자 정보 타입 (v2.0 확장)
 */
export interface User {
  id: string;
  email: string;
  password: string;
  startDate: string;              // 프로그램 시작일
  createdAt: string;
  
  // 🆕 v2.0 추가 필드
  initialWeight: number;          // 초기 체중
  targetWeight: number;           // 목표 체중
  initialWaist: number;           // 초기 허리둘레
  targetWaist: number;            // 목표 허리둘레
}

/**
 * Phase 타입 (1-4주 / 5-8주 / 9-12주)
 */
export type Phase = 1 | 2 | 3;

/**
 * 일일 체크리스트 v2.0 (12개 항목)
 */
export interface DailyCheck {
  date: string;                   // YYYY-MM-DD
  
  // 식사 관련 (3개)
  breakfastCompleted: boolean;    // 아침 식사
  breakfastTime?: string;         // 식사 시간 (HH:MM)
  lunchCompleted: boolean;        // 점심 식사
  lunchTime?: string;
  dinnerCompleted: boolean;       // 저녁 식사
  dinnerTime?: string;
  
  // 수분 섭취
  waterIntake: number;            // 물 섭취량 (잔 수, 0-8)
  
  // 운동
  exerciseCompleted: boolean;     // 운동 완료 여부
  exerciseType?: string;          // 운동 종류 (예: "유산소 30분")
  exerciseDuration?: number;      // 운동 시간 (분)
  
  // 수면
  sleepHours?: number;            // 수면 시간 (시간 단위)
  
  // 신체 측정
  weight?: number;                // 체중 (kg)
  waistCircumference?: number;    // 허리둘레 (cm)
  
  // 컨디션
  condition?: number;             // 컨디션 (1-10)
  memo?: string;                  // 메모
}

/**
 * 주간 통계 v2.0
 */
export interface WeeklyStats {
  weekNumber: number;             // 주차 (1-12)
  phase: Phase;                   // Phase 번호
  
  // 식단 통계
  mealCompletionRate: number;     // 식사 완료율 (%)
  waterAverageIntake: number;     // 평균 물 섭취 (잔)
  
  // 운동 통계
  exerciseDays: number;           // 운동 일수
  totalExerciseMinutes: number;   // 총 운동 시간 (분)
  
  // 신체 변화
  averageWeight?: number;         // 평균 체중
  averageWaist?: number;          // 평균 허리둘레
  weightChange?: number;          // 체중 변화 (시작 대비)
  waistChange?: number;           // 허리둘레 변화
  
  // 전체 달성률
  achievementRate: number;        // 전체 달성률 (%)
}

/**
 * Phase별 프로그램 정보
 */
export interface PhaseInfo {
  phase: Phase;
  title: string;
  weekRange: string;              // "1-4주"
  description: string;
  focusAreas: string[];           // 집중 영역
  exerciseGoal: string;           // 운동 목표
  nutritionGoal: string;          // 식단 목표
}

/**
 * 주차별 프로그램 상세
 */
export interface WeeklyProgram {
  weekNumber: number;
  phase: Phase;
  
  // 운동 프로그램
  exerciseSchedule: {
    day: string;                  // "월요일"
    exercise: string;             // "유산소 30분 + 스트레칭"
    description: string;
  }[];
  
  // 식단 가이드
  nutritionGuide: {
    day: string;
    meals: {
      breakfast: string;
      lunch: string;
      dinner: string;
      snacks?: string[];
    };
  }[];
  
  // 주간 목표
  weeklyGoals: string[];
}

/**
 * 로컬 스토리지 데이터 구조 v2.0
 */
export interface LocalStorageData {
  currentUser: string | null;
  users: {
    [userId: string]: User;
  };
  dailyChecks: {
    [userId: string]: {
      [date: string]: DailyCheck;
    };
  };
}

/**
 * 달력 날짜 타입 v2.0
 */
export interface CalendarDay {
  date: string;
  dayOfWeek: number;
  weekNumber: number;
  phase: Phase;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  status: 'excellent' | 'good' | 'partial' | 'incomplete' | 'future';
  completionRate: number;         // 0-100
}

/**
 * 차트 데이터 포인트
 */
export interface ChartDataPoint {
  date: string;                   // "1/1" 형식
  weight?: number;
  waist?: number;
  targetWeight?: number;
  targetWaist?: number;
}