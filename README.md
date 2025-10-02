# 🏃‍♂️ 12주 건강개선 프로그램 v2.0

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kdkim2000.github.io/12week-health-tracker/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue)](https://www.typescriptlang.org/)
[![Material-UI](https://img.shields.io/badge/MUI-7.0.0-007FFF)](https://mui.com/)
[![Recharts](https://img.shields.io/badge/Recharts-2.12.7-8884d8)](https://recharts.org/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **🎓 Next.js 초보자를 위한 실전 프로젝트 v2.0**  
> 개인 맞춤형 12주 건강개선 프로그램을 기록하고 추적하는 웹 애플리케이션입니다.  
> 체중 감량, 허리둘레 관리, 생활습관 개선을 과학적으로 관리하세요!

---

## 🌟 v2.0의 새로운 기능

### 🎯 주요 업그레이드

#### 1. **12개 항목 체크리스트** (기존 3개 → 12개)
```
v1.0: ✅ 운동 / 🍎 식단 / ⚖️ 체중

v2.0: 
  📋 식사 관리 (아침/점심/저녁 + 시간 기록)
  💧 물 섭취 추적 (0-8잔 슬라이더)
  💪 운동 기록 (종류 + 시간)
  😴 수면 시간 입력
  ⚖️ 체중 측정
  📏 허리둘레 측정
  😊 컨디션 체크 (1-10)
  📝 자유 메모
```

#### 2. **Phase 시스템** (12주를 3단계로 구분)
```
Phase 1 (1-4주)  🟢 기초 다지기
- 목표: 운동 습관 형성, 칼로리 조절
- 운동: 주 5-6회, 하루 30-40분
- 식단: 일일 2,000kcal

Phase 2 (5-8주)  🟠 강도 증가
- 목표: 체중 감량 가속화, HIIT 도입
- 운동: 주 6회, 하루 40-50분
- 식단: 일일 1,800kcal

Phase 3 (9-12주) 🔵 목표 달성
- 목표: 목표 체중 달성, 습관 정착
- 운동: 주 6회, 하루 45-60분
- 식단: 일일 1,900kcal
```

#### 3. **건강 지표 차트** (신규)
- 📊 체중 추이 그래프 (recharts)
- 📏 허리둘레 변화 추이
- 🎯 목표선 표시
- 📈 실시간 변화량 계산

#### 4. **프로그램 가이드 페이지** (신규)
- 📅 주차별 운동 스케줄
- 🍽️ 식단 가이드 (7일 메뉴)
- 🎯 주간 목표 설정
- 💡 단계별 팁 제공

---

## 📖 목차

- [v2.0 주요 변경사항](#-v20-주요-변경사항)
- [프로젝트 소개](#-프로젝트-소개)
- [기술 스택](#-기술-스택)
- [학습 포인트](#-학습-포인트)
- [시작하기](#-시작하기)
- [프로젝트 구조](#-프로젝트-구조)
- [핵심 구현 설명](#-핵심-구현-설명)
- [v1.0에서 v2.0으로 업그레이드](#-v10에서-v20으로-업그레이드)
- [GitHub Pages 배포](#-github-pages-배포)
- [트러블슈팅](#-트러블슈팅)
- [향후 개선 방향](#-향후-개선-방향)

---

## 🆕 v2.0 주요 변경사항

### 📊 데이터 구조 확장

#### **타입 정의 변경** (`types/index.ts`)

**v1.0:**
```typescript
interface DailyCheck {
  date: string;
  exerciseCompleted: boolean;
  dietCompleted: boolean;
  weight: number | null;
}
```

**v2.0:**
```typescript
interface DailyCheck {
  date: string;
  
  // 식사 (3개 → 시간 기록 포함)
  breakfastCompleted: boolean;
  breakfastTime?: string;
  lunchCompleted: boolean;
  lunchTime?: string;
  dinnerCompleted: boolean;
  dinnerTime?: string;
  
  // 물 섭취 (신규)
  waterIntake: number;  // 0-8잔
  
  // 운동 (확장)
  exerciseCompleted: boolean;
  exerciseType?: string;      // 운동 종류
  exerciseDuration?: number;  // 운동 시간(분)
  
  // 수면 (신규)
  sleepHours?: number;
  
  // 신체 측정 (확장)
  weight?: number;
  waistCircumference?: number;  // 허리둘레
  
  // 컨디션 & 메모 (신규)
  condition?: number;  // 1-10
  memo?: string;
}
```

#### **사용자 정보 확장** (`types/index.ts`)

**v2.0 추가 필드:**
```typescript
interface User {
  id: string;
  email: string;
  password: string;
  startDate: string;
  createdAt: string;
  
  // 🆕 v2.0 추가
  initialWeight: number;    // 초기 체중
  targetWeight: number;     // 목표 체중
  initialWaist: number;     // 초기 허리둘레
  targetWaist: number;      // 목표 허리둘레
}
```

### 🎨 UI/UX 개선

#### **1. 회원가입 프로세스 개선**

**v1.0:** 이메일/비밀번호만 입력
**v2.0:** 2단계 프로세스
```
Step 1: 계정 정보 (이메일/비밀번호)
Step 2: 신체 정보 & 목표 설정
  - 현재 체중 입력
  - 현재 허리둘레 입력
  - 목표 체중 설정
  - 목표 허리둘레 설정
```

#### **2. 달력 시각화 강화**

**v1.0 색상 시스템:**
```
🟢 초록: 모두 완료
🟡 노랑: 일부 완료
🔴 빨강: 미완료
⚪ 회색: 미래
```

**v2.0 색상 시스템 (Phase별 구분):**
```
Phase 1 (1-4주):   🟢 초록색 계열
Phase 2 (5-8주):   🟠 주황색 계열
Phase 3 (9-12주):  🔵 파란색 계열

완료율 표시:
  80%+ : 진한 색상 (excellent)
  50-79%: 중간 색상 (good)
  20-49%: 노란색 (partial)
  <20%  : 빨간색 (incomplete)
```

#### **3. 상세 통계 추가**

**v2.0 주차별 통계:**
```
✅ 식사 완료율: 85%
💧 평균 물 섭취: 7.2잔/일
💪 운동 일수: 6일 (총 240분)
⚖️ 체중 변화: -2.3kg
📏 허리둘레 변화: -1.5cm
📊 전체 달성률: 78%
```

### 📦 새로운 패키지 추가

```bash
npm install recharts  # 차트 라이브러리
```

**recharts 사용 이유:**
- React 친화적 (컴포넌트 기반)
- 반응형 차트 자동 지원
- 간단한 API
- TypeScript 지원

---

## 🎯 프로젝트 소개

### 왜 v2.0을 만들었나요?

**v1.0의 한계:**
- 단순한 체크리스트 (2개 항목만)
- 시각화 부족
- 목표 설정 불가
- 상세 통계 없음

**v2.0의 개선:**
- ✅ 포괄적인 건강 관리 (12개 항목)
- ✅ 실시간 차트 시각화
- ✅ 개인 맞춤 목표 설정
- ✅ 과학적 Phase 시스템
- ✅ 주차별 운동/식단 가이드

### 어떤 사람에게 필요한가요?

이 앱은 다음과 같은 분들을 위해 만들어졌습니다:

1. **건강검진 결과 개선이 필요한 분**
   - 체중 감량 필요
   - 허리둘레 관리 필요
   - HS-CRP 수치 개선 필요

2. **체계적인 건강 관리를 원하는 분**
   - 운동 습관 형성
   - 식단 관리
   - 진행 상황 추적

3. **Next.js를 실전으로 배우고 싶은 개발자**
   - 실제 사용 가능한 앱 제작
   - 최신 기술 스택 학습
   - 포트폴리오 프로젝트

---

## 🛠️ 기술 스택

### Core Technologies

| 기술 | 버전 | 역할 | v2.0 변경사항 |
|------|------|------|-------------|
| **Next.js** | 15.1.0 | React 프레임워크 | - |
| **React** | 19.0.0 | UI 라이브러리 | - |
| **TypeScript** | 5.6+ | 타입 안정성 | - |
| **Material-UI** | 7.0.0 | UI 컴포넌트 | - |
| **Recharts** | 2.12.7 | 차트 라이브러리 | 🆕 **신규 추가** |

### v2.0 추가 기능

#### **Recharts - 차트 시각화**

```typescript
// 체중 추이 그래프 예시
<LineChart data={chartData}>
  <XAxis dataKey="date" />
  <YAxis domain={[70, 85]} />
  <Line 
    dataKey="weight" 
    stroke="#2196F3" 
    strokeWidth={2}
  />
  <ReferenceLine 
    y={targetWeight} 
    stroke="#FF9800" 
    label="목표"
  />
</LineChart>
```

**왜 Recharts를 선택했나요?**
- ✅ React 컴포넌트 방식 (직관적)
- ✅ 반응형 차트 (모바일 자동 대응)
- ✅ TypeScript 완벽 지원
- ✅ 커스터마이징 쉬움
- ✅ 번들 사이즈 작음 (~100KB)

---

## 🎓 학습 포인트

### v2.0에서 새롭게 배울 수 있는 것들

#### 1️⃣ **복잡한 폼 관리**

**v1.0: 간단한 체크박스**
```typescript
<Checkbox 
  checked={exerciseCompleted}
  onChange={(e) => setExerciseCompleted(e.target.checked)}
/>
```

**v2.0: 다양한 입력 컴포넌트**
```typescript
// 체크박스 + 시간 입력
{breakfastCompleted && (
  <TextField
    type="time"
    value={breakfastTime}
    onChange={(e) => setBreakfastTime(e.target.value)}
  />
)}

// 슬라이더 (물 섭취)
<Slider
  value={waterIntake}
  onChange={(_, value) => setWaterIntake(value)}
  min={0}
  max={8}
  marks
/>

// 텍스트 영역 (메모)
<TextField
  multiline
  rows={3}
  value={memo}
  onChange={(e) => setMemo(e.target.value)}
/>
```

**학습 포인트:**
- 조건부 렌더링 마스터
- 다양한 입력 타입 처리
- 상태 동기화 관리

#### 2️⃣ **차트 데이터 가공**

**원본 데이터 → 차트 데이터 변환:**
```typescript
// 원본 데이터
dailyChecks = {
  '2025-01-01': { weight: 83.6, waist: 87.7 },
  '2025-01-08': { weight: 82.1, waist: 86.5 },
  ...
}

// 차트용 데이터로 변환
const chartData: ChartDataPoint[] = dates
  .filter(date => dailyChecks[date]?.weight) // 측정값 있는 날만
  .map(date => ({
    date: formatShortDate(date),  // "1/1"
    weight: dailyChecks[date].weight,
    waist: dailyChecks[date].waistCircumference,
    targetWeight: user.targetWeight,
    targetWaist: user.targetWaist,
  }));
```

**학습 포인트:**
- 배열 메서드 체이닝 (filter → map)
- 데이터 정규화
- 효율적인 변환 로직

#### 3️⃣ **Phase별 동적 스타일링**

```typescript
// Phase 계산
const getPhaseFromWeek = (week: number): Phase => {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  return 3;
};

// Phase별 색상 적용
const PHASE_COLORS = {
  1: '#4CAF50',  // 초록
  2: '#FF9800',  // 주황
  3: '#2196F3',  // 파랑
};

// 동적 스타일
<Paper
  sx={{
    bgcolor: PHASE_COLORS[currentPhase],
    color: 'white',
  }}
>
  Phase {currentPhase}: {phaseInfo.title}
</Paper>
```

**학습 포인트:**
- 조건부 스타일링
- 동적 색상 시스템
- 테마 확장

#### 4️⃣ **완료율 계산 알고리즘**

```typescript
function calculateCompletionRate(check: DailyCheck): number {
  let completed = 0;
  const total = 10;  // 필수 항목 10개
  
  // 식사 (3점)
  if (check.breakfastCompleted) completed++;
  if (check.lunchCompleted) completed++;
  if (check.dinnerCompleted) completed++;
  
  // 물 섭취 (1점)
  if (check.waterIntake >= 8) completed++;
  
  // 운동 (1점)
  if (check.exerciseCompleted) completed++;
  
  // 수면 (1점)
  if (check.sleepHours) completed++;
  
  // 신체 측정 (2점)
  if (check.weight) completed++;
  if (check.waistCircumference) completed++;
  
  // 컨디션 (1점)
  if (check.condition) completed++;
  
  // 메모는 보너스 (선택)
  if (check.memo) completed++;
  
  return Math.round((completed / total) * 100);
}
```

**학습 포인트:**
- 비즈니스 로직 구현
- 점수 시스템 설계
- 퍼센트 계산

#### 5️⃣ **2단계 회원가입 프로세스**

```typescript
const [activeStep, setActiveStep] = useState(0);
const steps = ['계정 정보', '신체 정보 & 목표'];

// Step 1 → Step 2 전환 로직
const handleNextStep = () => {
  // 입력값 검증
  if (!email || !password || !confirmPassword) {
    setError('모든 항목을 입력해주세요');
    return;
  }
  
  if (password !== confirmPassword) {
    setError('비밀번호가 일치하지 않습니다');
    return;
  }
  
  setError('');
  setActiveStep(1);  // 다음 단계로
};
```

**학습 포인트:**
- Stepper 컴포넌트 활용
- 다단계 폼 관리
- 단계별 유효성 검사

---

## 🚀 시작하기

### 사전 요구사항

```bash
# Node.js 버전 확인 (18.17.0 이상)
node --version

# npm 버전 확인 (9.0.0 이상)
npm --version
```

### 설치 방법

#### 1️⃣ 저장소 클론
```bash
git clone https://github.com/kdkim2000/12week-health-tracker.git
cd 12week-health-tracker
```

#### 2️⃣ 의존성 설치
```bash
npm install
```

**v2.0 추가 패키지 확인:**
```bash
# package.json에 다음 항목이 있는지 확인
"recharts": "^2.12.7"
```

만약 없다면:
```bash
npm install recharts
```

#### 3️⃣ 개발 서버 실행
```bash
npm run dev
```

#### 4️⃣ 브라우저에서 확인
```
http://localhost:3000
```

---

## 📁 프로젝트 구조

### v2.0 변경사항

```
12week-health-tracker-v2/
├── app/
│   ├── layout.tsx              (기존 유지)
│   ├── page.tsx                ⚠️ 대폭 수정
│   ├── theme.ts                (기존 유지)
│   ├── login/page.tsx          (기존 유지)
│   ├── signup/page.tsx         ⚠️ 수정 (2단계 프로세스)
│   └── program/              
│       └── page.tsx            🆕 신규 (프로그램 가이드)
│
├── components/
│   ├── Calendar.tsx            ⚠️ 대폭 수정
│   ├── DailyCheckForm.tsx      ⚠️ 대폭 수정 (12개 항목)
│   ├── ProgressBar.tsx         (기존 유지)
│   ├── WeeklyStats.tsx         ⚠️ 수정 (새로운 통계)
│   ├── PhaseIndicator.tsx      🆕 신규
│   └── HealthMetrics.tsx       🆕 신규 (차트)
│
├── lib/
│   ├── auth.ts                 ⚠️ 수정 (신체 정보 추가)
│   ├── dateUtils.ts            (기존 유지)
│   ├── localStorage.ts         ⚠️ 수정 (확장된 데이터)
│   └── programData.ts          🆕 신규 (프로그램 데이터)
│
├── types/
│   └── index.ts                ⚠️ 대폭 수정
│
├── next.config.ts              (기존 유지)
├── package.json                ⚠️ 수정 (recharts 추가)
├── tsconfig.json               (기존 유지)
└── README.md                   ⚠️ 이 파일 (전면 개편)
```

### 🆕 신규 파일 설명

#### `lib/programData.ts`
```typescript
// 12주 프로그램의 핵심 데이터
export const PHASE_INFO = {
  1: {
    title: 'Phase 1: 기초 다지기',
    weekRange: '1-4주',
    focusAreas: ['운동 습관 형성', '칼로리 조절'],
    exerciseGoal: '주 5-6회, 30-40분',
    nutritionGoal: '일일 2,000kcal',
  },
  // Phase 2, 3 ...
};

// 주차별 운동/식단 가이드
export function getWeeklyProgram(weekNumber: number) {
  return {
    weekNumber,
    exerciseSchedule: [...],  // 요일별 운동
    nutritionGuide: [...],     // 요일별 식단
    weeklyGoals: [...],        // 주간 목표
  };
}
```

**활용 예시:**
```typescript
// 프로그램 페이지에서 사용
const program = getWeeklyProgram(selectedWeek);

<Table>
  {program.exerciseSchedule.map(schedule => (
    <TableRow>
      <TableCell>{schedule.day}</TableCell>
      <TableCell>{schedule.exercise}</TableCell>
    </TableRow>
  ))}
</Table>
```

#### `components/PhaseIndicator.tsx`
```typescript
// 현재 Phase 정보 표시
<PhaseIndicator 
  currentWeek={5} 
  currentPhase={2}
/>

// 렌더링 결과:
// ┌─────────────────────────────┐
// │ 🟠 Phase 2: 강도 증가       │
// │ [■■■■■■■□□□□□] 1/4주    │
// │ 집중 영역: HIIT 도입, ...   │
// │ 운동 목표: 주 6회, 40-50분  │
// └─────────────────────────────┘
```

#### `components/HealthMetrics.tsx`
```typescript
// 체중/허리둘레 차트
<HealthMetrics 
  user={user}
  chartData={chartData}
/>

// 기능:
// - 체중/허리둘레 토글 전환
// - 목표선 표시
// - 변화량 계산
// - 반응형 차트
```

---

## 🔧 핵심 구현 설명

### 1. 확장된 체크리스트 관리

#### v1.0 vs v2.0 비교

**v1.0 (3개 필드):**
```typescript
interface DailyCheck {
  date: string;
  exerciseCompleted: boolean;
  dietCompleted: boolean;
  weight: number | null;
}

// 저장
<Checkbox onChange={(e) => 
  saveDailyCheck(userId, {
    date,
    exerciseCompleted: e.target.checked,
    dietCompleted,
    weight,
  })
} />
```

**v2.0 (12개 필드):**
```typescript
interface DailyCheck {
  // 식사 (6개 필드)
  breakfastCompleted: boolean;
  breakfastTime?: string;
  lunchCompleted: boolean;
  lunchTime?: string;
  dinnerCompleted: boolean;
  dinnerTime?: string;
  
  // 기타 (6개 필드)
  waterIntake: number;
  exerciseCompleted: boolean;
  exerciseType?: string;
  exerciseDuration?: number;
  sleepHours?: number;
  weight?: number;
  waistCircumference?: number;
  condition?: number;
  memo?: string;
}

// 저장 (12개 항목 통합)
const handleSave = () => {
  const checkData: DailyCheck = {
    date,
    breakfastCompleted,
    breakfastTime: breakfastCompleted ? breakfastTime : undefined,
    lunchCompleted,
    lunchTime: lunchCompleted ? lunchTime : undefined,
    dinnerCompleted,
    dinnerTime: dinnerCompleted ? dinnerTime : undefined,
    waterIntake,
    exerciseCompleted,
    exerciseType: exerciseCompleted ? exerciseType : undefined,
    exerciseDuration: exerciseCompleted && exerciseDuration 
      ? parseFloat(exerciseDuration) 
      : undefined,
    sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
    weight: weight ? parseFloat(weight) : undefined,
    waistCircumference: waistCircumference 
      ? parseFloat(waistCircumference) 
      : undefined,
    condition,
    memo: memo.trim() || undefined,
  };
  
  onSave(checkData);
};
```

**배울 점:**
- 선택적 필드 처리 (`?:`)
- 조건부 데이터 포함
- 타입 변환 (`parseFloat`)
- 빈 값 필터링 (`trim()`)

### 2. Phase 시스템 구현

```typescript
// Phase 계산 로직
export function getPhaseFromWeek(weekNumber: number): Phase {
  if (weekNumber <= 4) return 1;
  if (weekNumber <= 8) return 2;
  return 3;
}

// Phase별 색상
export const PHASE_COLORS: Record<Phase, string> = {
  1: '#4CAF50',  // 초록 (기초)
  2: '#FF9800',  // 주황 (강도 증가)
  3: '#2196F3',  // 파랑 (목표 달성)
};

// 달력에서 활용
weeks.map((week, weekIndex) => {
  const weekNumber = weekIndex + 1;
  const phase = getPhaseFromWeek(weekNumber);
  const phaseColor = PHASE_COLORS[phase];
  
  return (
    <Box sx={{ borderColor: phaseColor }}>
      {/* 주차 표시 */}
    </Box>
  );
});
```

**설계 원칙:**
- 단순하고 명확한 계산 로직
- 중앙집중식 색상 관리
- 타입 안정성 (`Record<Phase, string>`)

### 3. 차트 데이터 준비

```typescript
// 1단계: 측정값이 있는 날짜 필터링
const dates = get12WeekDates(user.startDate);  // 84일
const dailyChecks = getAllDailyChecks(user.id);

// 2단계: 차트용 데이터로 변환
const chartData: ChartDataPoint[] = dates
  .filter(date => {
    const check = dailyChecks[date];
    return check && (check.weight || check.waistCircumference);
  })
  .map(date => {
    const check = dailyChecks[date];
    const [, month, day] = date.split('-');
    
    return {
      date: `${parseInt(month)}/${parseInt(day)}`,  // "1/1" 형식
      weight: check.weight,
      waist: check.waistCircumference,
      targetWeight: user.targetWeight,
      targetWaist: user.targetWaist,
    };
  });

// 3단계: Recharts에 전달
<LineChart data={chartData}>
  <Line dataKey="weight" stroke="#2196F3" />
  <ReferenceLine y={user.targetWeight} stroke="#FF9800" />
</LineChart>
```

**최적화 포인트:**
- 빈 데이터 제거 (차트 성능 향상)
- 날짜 포맷 간소화 (가독성)
- 목표선 자동 표시

### 4. 주차별 통계 계산

```typescript
// v2.0 확장된 통계
for (let week = 1; week <= 12; week++) {
  const weekDates = getWeekDates(user.startDate, week);
  
  let totalMeals = 0;
  let completedMeals = 0;
  let totalWater = 0;
  let exerciseDays = 0;
  let totalExerciseMinutes = 0;
  let weightMeasurements: number[] = [];
  let waistMeasurements: number[] = [];
  
  weekDates.forEach(date => {
    const check = dailyChecks[date];
    if (!check) return;
    
    // 식사 통계
    totalMeals += 3;
    if (check.breakfastCompleted) completedMeals++;
    if (check.lunchCompleted) completedMeals++;
    if (check.dinnerCompleted) completedMeals++;
    
    // 물 섭취
    totalWater += check.waterIntake;
    
    // 운동
    if (check.exerciseCompleted) {
      exerciseDays++;
      totalExerciseMinutes += check.exerciseDuration || 0;
    }
    
    // 신체 측정
    if (check.weight) weightMeasurements.push(check.weight);
    if (check.waistCircumference) 
      waistMeasurements.push(check.waistCircumference);
  });
  
  // 평균 계산
  const averageWeight = weightMeasurements.length > 0
    ? weightMeasurements.reduce((a, b) => a + b) / weightMeasurements.length
    : undefined;
  
  weeklyStats.push({
    weekNumber: week,
    mealCompletionRate: (completedMeals / totalMeals) * 100,
    waterAverageIntake: totalWater / 7,
    exerciseDays,
    totalExerciseMinutes,
    averageWeight,
    // ...
  });
}
```

**배울 점:**
- 복잡한 집계 로직
- 조건부 배열 추가
- 평균/합계 계산
- null 안전 처리

---

## 🔄 v1.0에서 v2.0으로 업그레이드

### 마이그레이션 가이드

#### ⚠️ 주의사항

**로컬스토리지 키 변경:**
```
v1.0: 'health-tracker-data'
v2.0: 'health-tracker-v2-data'
```

**결과:** 기존 v1.0 데이터는 v2.0에서 보이지 않습니다.

#### 옵션 1: 새로 시작 (권장)

```bash
# v2.0 코드 받기
git pull origin main

# 의존성 업데이트
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 새로 회원가입
```

#### 옵션 2: 데이터 마이그레이션 (고급)

```typescript
// 브라우저 콘솔에서 실행
function migrateV1ToV2() {
  // v1.0 데이터 읽기
  const v1Data = JSON.parse(
    localStorage.getItem('health-tracker-data') || '{}'
  );
  
  // v2.0 형식으로 변환
  const v2Data = {
    currentUser: v1Data.currentUser,
    users: {},
    dailyChecks: {},
  };
  
  // 사용자 데이터 변환
  Object.entries(v1Data.users).forEach(([userId, user]) => {
    v2Data.users[userId] = {
      ...user,
      // v2.0 필수 필드 추가 (임의값)
      initialWeight: 80,
      targetWeight: 75,
      initialWaist: 85,
      targetWaist: 80,
    };
  });
  
  // 체크리스트 변환
  Object.entries(v1Data.dailyChecks).forEach(([userId, checks]) => {
    v2Data.dailyChecks[userId] = {};
    
    Object.entries(checks).forEach(([date, check]) => {
      v2Data.dailyChecks[userId][date] = {
        date,
        // v1.0 필드 매핑
        breakfastCompleted: check.dietCompleted,
        lunchCompleted: check.dietCompleted,
        dinnerCompleted: check.dietCompleted,
        waterIntake: 6,  // 기본값
        exerciseCompleted: check.exerciseCompleted,
        weight: check.weight,
        condition: 5,    // 기본값
      };
    });
  });
  
  // v2.0 저장
  localStorage.setItem('health-tracker-v2-data', JSON.stringify(v2Data));
  
  alert('마이그레이션 완료! 페이지를 새로고침하세요.');
}

migrateV1ToV2();
```

### 코드 업그레이드 체크리스트

- [ ] `package.json`에 recharts 추가
- [ ] `types/index.ts` 타입 업데이트
- [ ] `lib/localStorage.ts` 키 변경
- [ ] `lib/programData.ts` 신규 파일 생성
- [ ] 모든 컴포넌트 업데이트
- [ ] `npm install` 실행
- [ ] 빌드 테스트 (`npm run build`)

---

## 🎨 커스터마이징 가이드

### 1. Phase 색상 변경

```typescript
// lib/programData.ts
export const PHASE_COLORS = {
  1: '#FF6B6B',  // 빨강 (정열)
  2: '#4ECDC4',  // 청록 (균형)
  3: '#45B7D1',  // 하늘 (달성)
};
```

### 2. 프로그램 데이터 수정

```typescript
// lib/programData.ts

// 운동 스케줄 변경
const WEEK1_EXERCISE = [
  {
    day: '월요일',
    exercise: '나만의 운동', // 여기 수정!
    description: '상세 설명',
  },
  // ...
];

// 식단 가이드 변경
const WEEK1_NUTRITION = [
  {
    day: '월요일',
    meals: {
      breakfast: '나만의 아침 메뉴',
      lunch: '나만의 점심 메뉴',
      dinner: '나만의 저녁 메뉴',
    },
  },
  // ...
];
```

### 3. 목표 기간 변경 (12주 → N주)

```typescript
// dateUtils.ts
export function get12WeekDates(startDate: string): string[] {
  const dates: string[] = [];
  const TOTAL_WEEKS = 16;  // 12 → 16주로 변경
  const TOTAL_DAYS = TOTAL_WEEKS * 7;
  
  for (let i = 0; i < TOTAL_DAYS; i++) {
    dates.push(addDays(startDate, i));
  }
  return dates;
}

// programData.ts
export function getPhaseFromWeek(weekNumber: number): Phase {
  if (weekNumber <= 5) return 1;   // 1-5주
  if (weekNumber <= 11) return 2;  // 6-11주
  return 3;                         // 12-16주
}
```

---

## 📊 성능 최적화

### v2.0 최적화 전략

#### 1. 메모이제이션

```typescript
// 비용이 큰 계산은 useMemo로
const chartData = useMemo(() => {
  return dates
    .filter(date => dailyChecks[date]?.weight)
    .map(date => ({
      date: formatDate(date),
      weight: dailyChecks[date].weight,
    }));
}, [dates, dailyChecks]);  // 의존성 배열
```

#### 2. 조건부 렌더링

```typescript
// 데이터 없으면 차트 렌더링 안 함
{chartData.length > 0 ? (
  <LineChart data={chartData}>...</LineChart>
) : (
  <Box>아직 측정 데이터가 없습니다</Box>
)}
```

#### 3. 지연 로딩

```typescript
// 프로그램 페이지는 필요할 때만 로드
const ProgramPage = dynamic(() => import('./program/page'), {
  loading: () => <CircularProgress />,
});
```

---

## 🔍 트러블슈팅

### v2.0 특정 문제

#### Q1. recharts 차트가 안 보여요!

**원인:** recharts 설치 안 됨

**해결:**
```bash
npm install recharts
npm install --save-dev @types/recharts
```

#### Q2. "viewport" 경고가 떠요!

**원인:** Next.js 15 메타데이터 API 변경

**해결:**
```typescript
// app/layout.tsx
import type { Metadata, Viewport } from 'next';

// ❌ 잘못된 방법
export const metadata: Metadata = {
  viewport: { width: 'device-width' },
};

// ✅ 올바른 방법
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};
```

#### Q3. Phase 색상이 안 나와요!

**원인:** `lib/programData.ts` 파일 누락

**해결:**
```bash
# 파일 존재 확인
ls lib/programData.ts

# 없으면 다시 생성 (위 코드 참고)
```

#### Q4. 회원가입 시 오류가 나요!

**원인:** 신체 정보 유효성 검사

**해결:**
```typescript
// 입력값 확인
- 현재 체중 > 목표 체중
- 현재 허리둘레 > 목표 허리둘레
- 모든 값 > 0
```

---

## 🚀 배포하기

### GitHub Pages 배포 (변경 없음)

v1.0과 동일한 방법으로 배포됩니다:

```bash
git add .
git commit -m "feat: v2.0 upgrade"
git push origin main
```

GitHub Actions가 자동으로:
1. 의존성 설치 (recharts 포함)
2. 빌드 실행
3. GitHub Pages 배포

---

## 🎯 향후 개선 방향

### v3.0 계획

#### 1. 백엔드 연동
- Supabase 또는 Firebase
- 실시간 동기화
- 다중 기기 지원

#### 2. AI 코칭
- OpenAI API 연동
- 개인 맞춤 조언
- 자동 식단 생성

#### 3. 소셜 기능
- 친구와 진행 상황 공유
- 그룹 챌린지
- 리더보드

#### 4. 고급 분석
- 주간/월간 리포트
- 예측 분석 (목표 달성일)
- PDF 다운로드

---

## 📚 학습 자료

### v2.0 관련 추천 자료

1. **Recharts 공식 문서**
   - https://recharts.org/
   - 예제가 풍부함

2. **Material-UI Stepper**
   - https://mui.com/material-ui/react-stepper/
   - 다단계 폼 구현

3. **TypeScript Handbook**
   - https://www.typescriptlang.org/docs/
   - 고급 타입 활용

---

## 🙏 감사합니다

v2.0은 실제 건강검진 결과를 바탕으로 과학적인 프로그램을 구현했습니다.

**기여하신 분들:**
- [@kdkim2000](https://github.com/kdkim2000) - 메인 개발자
- Claude (Anthropic) - 프로그램 설계 지원

**피드백 환영!**
- 🐛 버그 제보: [Issues](https://github.com/kdkim2000/12week-health-tracker/issues)
- 💡 기능 제안: [Discussions](https://github.com/kdkim2000/12week-health-tracker/discussions)

---

**Made with ❤️ and 🏃‍♂️**  
**Last Updated: 2025-01-XX**

⭐ **v2.0이 도움이 되셨다면 Star를 눌러주세요!** ⭐