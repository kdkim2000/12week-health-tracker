// E:\apps\12week-health-tracker\lib\dateUtils.ts
// 파일 경로: lib/dateUtils.ts
// 설명: 날짜 계산 및 포맷팅 관련 유틸리티 함수

/**
 * 날짜를 YYYY-MM-DD 형식의 문자열로 변환
 * @param date - 변환할 Date 객체
 * @returns YYYY-MM-DD 형식의 문자열
 * 
 * 예시: formatDate(new Date('2025-01-15')) → '2025-01-15'
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * YYYY-MM-DD 형식의 문자열을 Date 객체로 변환
 * @param dateString - 변환할 날짜 문자열
 * @returns Date 객체
 * 
 * 예시: parseDate('2025-01-15') → Date 객체
 */
export function parseDate(dateString: string): Date {
  return new Date(dateString);
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 * @returns 오늘 날짜 문자열
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * 시작일로부터 특정 일수를 더한 날짜 계산
 * @param startDate - 시작 날짜 문자열 (YYYY-MM-DD)
 * @param days - 더할 일수
 * @returns 계산된 날짜 문자열 (YYYY-MM-DD)
 * 
 * 예시: addDays('2025-01-01', 7) → '2025-01-08'
 */
export function addDays(startDate: string, days: number): string {
  const date = parseDate(startDate);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

/**
 * 두 날짜 사이의 일수 차이 계산
 * @param date1 - 첫 번째 날짜 (YYYY-MM-DD)
 * @param date2 - 두 번째 날짜 (YYYY-MM-DD)
 * @returns 일수 차이 (date2 - date1)
 * 
 * 예시: daysBetween('2025-01-01', '2025-01-08') → 7
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = parseDate(date1);
  const d2 = parseDate(date2);
  const diffTime = d2.getTime() - d1.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * 시작 날짜로부터 현재 주차 계산 (1~12주)
 * @param startDate - 프로그램 시작 날짜 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @returns 현재 주차 (1~12, 12 이상은 12로 고정)
 * 
 * 예시: 
 * - 시작일이 오늘이면 → 1주차
 * - 시작일로부터 7일 후면 → 2주차
 * - 시작일로부터 84일 후면 → 12주차
 */
export function getCurrentWeek(startDate: Date | string): number {
  // Date 객체를 문자열로 변환
  const startDateStr = startDate instanceof Date ? formatDate(startDate) : startDate;
  const todayStr = getTodayString();
  
  // 경과 일수 계산
  const days = daysBetween(startDateStr, todayStr);
  
  // 주차 계산 (1주차부터 시작)
  const weekNumber = Math.floor(days / 7) + 1;
  
  // 최소 1주차, 최대 12주차
  return Math.max(1, Math.min(weekNumber, 12));
}

/**
 * 12주 프로그램의 모든 날짜 배열 생성
 * @param startDate - 프로그램 시작일 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @returns 84일간의 날짜 문자열 배열
 * 
 * 예시: get12WeekDates('2025-01-01') → ['2025-01-01', '2025-01-02', ..., '2025-03-25']
 */
export function get12WeekDates(startDate: Date | string): string[] {
  // Date 객체를 문자열로 변환
  const startDateStr = startDate instanceof Date ? formatDate(startDate) : startDate;
  
  const dates: string[] = [];
  for (let i = 0; i < 84; i++) { // 12주 = 84일
    dates.push(addDays(startDateStr, i));
  }
  return dates;
}

/**
 * 특정 날짜가 12주 프로그램의 몇 주차인지 계산
 * @param startDate - 프로그램 시작일
 * @param targetDate - 확인할 날짜
 * @returns 주차 번호 (1-12), 범위 밖이면 null
 * 
 * 예시: getWeekNumber('2025-01-01', '2025-01-08') → 2 (2주차)
 */
export function getWeekNumber(startDate: string, targetDate: string): number | null {
  const days = daysBetween(startDate, targetDate);
  if (days < 0 || days >= 84) return null; // 12주(84일) 범위 밖
  return Math.floor(days / 7) + 1; // 주차는 1부터 시작
}

/**
 * 특정 주차의 모든 날짜 가져오기
 * @param startDate - 프로그램 시작일
 * @param weekNumber - 주차 번호 (1-12)
 * @returns 해당 주의 날짜 문자열 배열 (7일)
 * 
 * 예시: getWeekDates('2025-01-01', 1) → ['2025-01-01', ..., '2025-01-07']
 */
export function getWeekDates(startDate: string, weekNumber: number): string[] {
  const startDay = (weekNumber - 1) * 7; // 0부터 시작
  const dates: string[] = [];
  for (let i = 0; i < 7; i++) {
    dates.push(addDays(startDate, startDay + i));
  }
  return dates;
}

/**
 * 날짜가 오늘인지 확인
 * @param date - 확인할 날짜 (YYYY-MM-DD)
 * @returns 오늘이면 true
 */
export function isToday(date: string): boolean {
  return date === getTodayString();
}

/**
 * 날짜가 과거인지 확인
 * @param date - 확인할 날짜 (YYYY-MM-DD)
 * @returns 과거면 true
 */
export function isPast(date: string): boolean {
  return daysBetween(date, getTodayString()) > 0;
}

/**
 * 날짜가 미래인지 확인
 * @param date - 확인할 날짜 (YYYY-MM-DD)
 * @returns 미래면 true
 */
export function isFuture(date: string): boolean {
  return daysBetween(getTodayString(), date) > 0;
}

/**
 * 요일 이름 가져오기
 * @param date - 날짜 문자열 (YYYY-MM-DD)
 * @returns 요일 이름 (월, 화, 수, 목, 금, 토, 일)
 */
export function getDayName(date: string): string {
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const dateObj = parseDate(date);
  return dayNames[dateObj.getDay()];
}

/**
 * 프로그램 진행률 계산 (0~100)
 * @param startDate - 프로그램 시작 날짜 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @returns 진행률 퍼센트 (0~100)
 * 
 * 예시: 6주차일 경우 → 50%
 */
export function getProgressPercentage(startDate: Date | string): number {
  const currentWeek = getCurrentWeek(startDate);
  return Math.min(Math.round((currentWeek / 12) * 100), 100);
}

/**
 * 프로그램 종료일 계산
 * @param startDate - 프로그램 시작 날짜 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @returns 종료 날짜 문자열 (YYYY-MM-DD)
 * 
 * 예시: getEndDate('2025-01-01') → '2025-03-25'
 */
export function getEndDate(startDate: Date | string): string {
  const startDateStr = startDate instanceof Date ? formatDate(startDate) : startDate;
  return addDays(startDateStr, 83); // 12주 = 84일 (0일째부터 83일째까지)
}

/**
 * 프로그램 남은 일수 계산
 * @param startDate - 프로그램 시작 날짜 (Date 객체 또는 YYYY-MM-DD 문자열)
 * @returns 남은 일수 (음수면 0 반환)
 * 
 * 예시: 프로그램 중간이면 → 42일 정도
 */
export function getRemainingDays(startDate: Date | string): number {
  const endDateStr = getEndDate(startDate);
  const todayStr = getTodayString();
  const remaining = daysBetween(todayStr, endDateStr);
  return Math.max(remaining, 0);
}