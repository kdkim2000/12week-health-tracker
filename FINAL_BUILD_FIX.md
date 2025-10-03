# 빌드 오류 최종 해결 가이드

## 오류 목록

1. ESLint: compat is not defined
2. TypeScript: Type 'number' is not assignable to type 'Phase'

---

## 해결 방법

### 문제 1: ESLint - compat is not defined

**원인**: eslint.config.mjs 파일에 정의되지 않은 `compat` 변수 사용

**해결**: eslint.config.mjs 전체 교체

제공된 `eslint.config_final.mjs` 파일을 사용하세요.

---

### 문제 2: TypeScript - Phase 타입 불일치

**원인**: app/page.tsx의 WeeklyStatsData 인터페이스에서 phase 타입이 `number`로 정의됨

```typescript
// ❌ 잘못된 타입
interface WeeklyStatsData {
  phase: number;  // getPhaseFromWeek()는 Phase (1|2|3) 반환
}
```

**해결**: Phase 타입으로 변경

```typescript
// ✅ 올바른 타입
import { Phase } from '@/types';

interface WeeklyStatsData {
  phase: Phase;  // 1 | 2 | 3
}
```

---

## 수정 파일

### 1. app/page.tsx 수정 부분

파일 상단에 Phase import 추가:
```typescript
import { User, DailyCheck, ChartDataPoint, Phase } from '@/types';
```

WeeklyStatsData 인터페이스 수정:
```typescript
interface WeeklyStatsData {
  weekNumber: number;
  phase: Phase;  // ⭐ number → Phase
  achievementRate: number;
  mealCompletionRate: number;
  waterAverageIntake: number;
  exerciseDays: number;
  totalExerciseMinutes: number;
  weightChange?: number;
}
```

weeklyData useMemo에서 타입 캐스팅:
```typescript
stats.push({
  weekNumber: week,
  phase: getPhaseFromWeek(week) as Phase,  // ⭐ 타입 캐스팅
  achievementRate,
  // ... 나머지
});
```

### 2. eslint.config.mjs 전체 교체

기존 파일을 백업하고 제공된 `eslint.config_final.mjs`로 교체

---

## 적용 순서

### Step 1: app/page.tsx 수정

```typescript
// 1. import 문 찾기 (상단)
import { User, DailyCheck, ChartDataPoint } from '@/types';

// 2. Phase 추가
import { User, DailyCheck, ChartDataPoint, Phase } from '@/types';

// 3. WeeklyStatsData 인터페이스 찾기 (약 13-22번째 줄)
interface WeeklyStatsData {
  weekNumber: number;
  phase: number;  // ← 이 줄 수정
  // ...
}

// 4. phase 타입 변경
interface WeeklyStatsData {
  weekNumber: number;
  phase: Phase;  // ← 수정됨
  // ...
}

// 5. weeklyData useMemo 찾기 (약 70-130번째 줄)
stats.push({
  weekNumber: week,
  phase: getPhaseFromWeek(week),  // ← 이 줄 수정
  // ...
});

// 6. 타입 캐스팅 추가
stats.push({
  weekNumber: week,
  phase: getPhaseFromWeek(week) as Phase,  // ← 수정됨
  // ...
});
```

### Step 2: eslint.config.mjs 교체

```bash
# 기존 파일 백업
cp eslint.config.mjs eslint.config.mjs.backup

# 새 파일 적용
cp eslint.config_final.mjs eslint.config.mjs
```

### Step 3: 테스트

```bash
# 타입 체크
npx tsc --noEmit

# ESLint 체크
npm run lint

# 빌드 테스트
npm run build
```

### Step 4: 성공 시 커밋

```bash
git add .
git commit -m "Fix: Phase type error and ESLint compat issue"
git push
```

---

## 호환성 처리 (보너스)

weeklyData useMemo에서 v2.0/v3.0 호환성도 추가:

```typescript
// meals 호환성
const mealCompletedCount = weekChecks.filter(check => 
  check.meals ||  // v2.0
  check.breakfastCompleted || check.lunchCompleted || check.dinnerCompleted  // v3.0
).length;

// water 호환성
const waterTotal = weekChecks.reduce((sum, check) => 
  sum + (check.waterIntake || check.water || 0), 0
);

// exercise 호환성
const exerciseDaysCount = weekChecks.filter(check => 
  check.exercise || check.exerciseCompleted
).length;

const totalMinutes = weekChecks.reduce((sum, check) => {
  if (check.exerciseDuration) {
    return sum + check.exerciseDuration;
  }
  if (check.exercise) {
    const match = check.exercise.match(/(\d+)분/);
    return sum + (match ? parseInt(match[1]) : 0);
  }
  return sum;
}, 0);
```

---

## 예상 결과

수정 후 GitHub Actions에서:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization

Export successful!
```

---

## 체크리스트

- [ ] app/page.tsx에서 Phase import 추가
- [ ] WeeklyStatsData.phase 타입을 Phase로 변경
- [ ] getPhaseFromWeek(week) as Phase 캐스팅 추가
- [ ] eslint.config.mjs 교체
- [ ] npm run build 성공
- [ ] Git 커밋 & 푸시

---

## 추가 정보

### Phase 타입이란?

```typescript
// types/index.ts
export type Phase = 1 | 2 | 3;

// 1: 1-4주 (적응기)
// 2: 5-8주 (발전기)
// 3: 9-12주 (완성기)
```

### getPhaseFromWeek 함수

```typescript
// lib/programData.ts
export function getPhaseFromWeek(week: number): Phase {
  if (week <= 4) return 1;
  if (week <= 8) return 2;
  return 3;
}
```

이 함수는 Phase 타입(1|2|3)을 반환하지만, TypeScript는 이를 number로 추론할 수 있으므로 명시적으로 `as Phase` 캐스팅이 필요합니다.
