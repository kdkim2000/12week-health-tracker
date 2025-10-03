# 빠른 수정 체크리스트

## 2가지 오류 해결

### 1. ESLint 오류: compat is not defined

**수정 파일**: `eslint.config.mjs`

**방법**: 전체 파일 교체
```bash
cp eslint.config.mjs eslint.config.mjs.backup
# 다운로드한 eslint.config.mjs로 교체
```

---

### 2. TypeScript 오류: Phase 타입 불일치

**수정 파일**: `app/page.tsx`

**수정 위치 3곳**:

#### 위치 1: Import 문 (파일 상단)
```typescript
// 찾기
import { User, DailyCheck, ChartDataPoint } from '@/types';

// 수정
import { User, DailyCheck, ChartDataPoint, Phase } from '@/types';
```

#### 위치 2: WeeklyStatsData 인터페이스 (약 13-22줄)
```typescript
// 찾기
interface WeeklyStatsData {
  weekNumber: number;
  phase: number;  // ← 이 줄
  achievementRate: number;
  // ...
}

// 수정
interface WeeklyStatsData {
  weekNumber: number;
  phase: Phase;  // ← number를 Phase로 변경
  achievementRate: number;
  // ...
}
```

#### 위치 3: weeklyData useMemo (약 120줄)
```typescript
// 찾기
stats.push({
  weekNumber: week,
  phase: getPhaseFromWeek(week),  // ← 이 줄
  achievementRate,
  // ...
});

// 수정
stats.push({
  weekNumber: week,
  phase: getPhaseFromWeek(week) as Phase,  // ← as Phase 추가
  achievementRate,
  // ...
});
```

---

## 테스트 & 커밋

```bash
# 1. 빌드 테스트
npm run build

# 2. 성공하면 커밋
git add .
git commit -m "Fix: Phase type and ESLint compat errors"
git push
```

---

## 예상 결과

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
Export successful!
```
