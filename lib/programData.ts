// 파일 경로: lib/programData.ts
// 설명: 12주 건강개선 프로그램 데이터 (운동/식단 가이드)

import type { PhaseInfo, WeeklyProgram, Phase } from '@/types';

/**
 * Phase별 기본 정보
 */
export const PHASE_INFO: Record<Phase, PhaseInfo> = {
  1: {
    phase: 1,
    title: 'Phase 1: 기초 다지기',
    weekRange: '1-4주',
    description: '기초 체력 향상 및 건강한 습관 형성',
    focusAreas: ['운동 습관 형성', '칼로리 조절', '규칙적인 식사'],
    exerciseGoal: '주 5-6회, 하루 30-40분',
    nutritionGoal: '일일 2,000kcal, 식사 시간 규칙화',
  },
  2: {
    phase: 2,
    title: 'Phase 2: 강도 증가',
    weekRange: '5-8주',
    description: '운동 강도 증가 및 체중 감량 가속화',
    focusAreas: ['운동 강도 증가', 'HIIT 도입', '단백질 섭취 증가'],
    exerciseGoal: '주 6회, 하루 40-50분',
    nutritionGoal: '일일 1,800kcal, 탄수화물 비율 조정',
  },
  3: {
    phase: 3,
    title: 'Phase 3: 목표 달성',
    weekRange: '9-12주',
    description: '목표 달성 및 유지 습관 정착',
    focusAreas: ['근력 향상', '체지방 감소', '습관 자동화'],
    exerciseGoal: '주 6회, 하루 45-60분',
    nutritionGoal: '일일 1,900kcal, 영양 밸런스 최적화',
  },
};

/**
 * 주차별 운동 스케줄 (샘플 - 1주차)
 */
const WEEK1_EXERCISE = [
  {
    day: '월요일',
    exercise: '유산소 30분 + 스트레칭 10분',
    description: '빠르게 걷기, 목표 심박수 100-115회/분',
  },
  {
    day: '화요일',
    exercise: '근력운동 30분 + 코어 10분',
    description: '스쿼트, 푸시업, 플랭크, 런지 각 3세트',
  },
  {
    day: '수요일',
    exercise: '유산소 40분',
    description: '빠르게 걷기 또는 자전거',
  },
  {
    day: '목요일',
    exercise: '근력운동 30분 + 코어 10분',
    description: '전날과 같은 루틴 반복',
  },
  {
    day: '금요일',
    exercise: '유산소 30분 + 스트레칭 10분',
    description: '가볍게 조깅 가능',
  },
  {
    day: '토요일',
    exercise: '근력운동 30분 또는 활동적 레저',
    description: '등산, 수영 등 즐거운 활동',
  },
  {
    day: '일요일',
    exercise: '휴식 또는 가벼운 산책 20분',
    description: '완전 휴식 또는 액티브 리커버리',
  },
];

/**
 * 주차별 식단 가이드 (샘플 - 1주차)
 */
const WEEK1_NUTRITION = [
  {
    day: '월요일',
    meals: {
      breakfast: '현미밥 100g, 된장찌개, 구운 김, 시금치나물, 계란찜',
      lunch: '귀리밥 100g, 제육볶음(살코기 120g), 배추김치, 미역국',
      dinner: '현미밥 80g, 고등어구이, 두부샐러드, 깍두기',
      snacks: ['방울토마토 10개', '무당 그릭 요거트 100g + 블루베리'],
    },
  },
  {
    day: '화요일',
    meals: {
      breakfast: '통밀빵 2장, 아보카도 1/2개, 계란 프라이 1개',
      lunch: '연어샐러드(연어 150g, 채소, 올리브유), 고구마 1개',
      dinner: '닭가슴살 샐러드 볼(닭 120g), 현미밥 80g',
      snacks: ['사과 1/2개 + 아몬드 10알', '당근 스틱 + 후무스'],
    },
  },
  {
    day: '수요일',
    meals: {
      breakfast: '오트밀 50g + 우유, 바나나 1/2개, 호두 5알',
      lunch: '현미비빔밥(채소 듬뿍, 계란, 참기름 약간)',
      dinner: '두부스테이크 200g, 브로콜리, 퀴노아 80g',
      snacks: ['배 1/2개', '두유 200ml'],
    },
  },
  {
    day: '목요일',
    meals: {
      breakfast: '현미밥 100g, 미역국, 계란말이, 깍두기',
      lunch: '닭가슴살 샌드위치(통밀빵), 샐러드',
      dinner: '현미밥 80g, 생선조림(동태), 숙주나물',
      snacks: ['키위 1개', '견과류 믹스 30g'],
    },
  },
  {
    day: '금요일',
    meals: {
      breakfast: '통곡물 시리얼 + 저지방우유, 딸기 5개',
      lunch: '현미밥 100g, 소고기뭇국(살코기 80g), 나물 3가지',
      dinner: '해물순두부찌개, 현미밥 80g, 배추김치',
      snacks: ['셀러리 스틱 + 땅콩버터', '방울토마토 + 모짜렐라'],
    },
  },
  {
    day: '토요일',
    meals: {
      breakfast: '고구마 200g, 삶은 계란 2개, 샐러드',
      lunch: '닭가슴살 덮밥(현미밥 100g, 채소 볶음)',
      dinner: '연어구이 150g, 아스파라거스, 퀴노아 80g',
      snacks: ['오렌지 1개', '프로틴 셰이크'],
    },
  },
  {
    day: '일요일 (자유 식사 1끼)',
    meals: {
      breakfast: '현미죽, 구운 김, 깍두기',
      lunch: '본인이 원하는 음식 (단, 과식 금지)',
      dinner: '채소 듬뿍 샤브샤브, 현미밥 80g',
      snacks: ['과일 샐러드', '견과류'],
    },
  },
];

/**
 * 전체 12주 프로그램 데이터 생성
 * (실제로는 12주 전체를 작성하지만, 여기서는 구조만 보여줌)
 */
export function getWeeklyProgram(weekNumber: number): WeeklyProgram {
  const phase: Phase = weekNumber <= 4 ? 1 : weekNumber <= 8 ? 2 : 3;
  
  // 각 Phase별로 다른 프로그램 제공 (여기서는 Phase 1 샘플만)
  return {
    weekNumber,
    phase,
    exerciseSchedule: WEEK1_EXERCISE,
    nutritionGuide: WEEK1_NUTRITION,
    weeklyGoals: [
      `${weekNumber}주차 목표: 운동 ${phase === 1 ? 5 : phase === 2 ? 6 : 6}일 완료`,
      '식사 시간 규칙화 (아침 7시, 점심 12시, 저녁 6시)',
      '물 하루 2L 섭취 (8잔)',
      phase === 1 ? '운동 습관 만들기' : phase === 2 ? '운동 강도 높이기' : '목표 체중 달성',
    ],
  };
}

/**
 * Phase 번호 계산
 */
export function getPhaseFromWeek(weekNumber: number): Phase {
  if (weekNumber <= 4) return 1;
  if (weekNumber <= 8) return 2;
  return 3;
}

/**
 * Phase별 색상
 */
export const PHASE_COLORS: Record<Phase, string> = {
  1: '#4CAF50',  // 초록색
  2: '#FF9800',  // 주황색
  3: '#2196F3',  // 파란색
};