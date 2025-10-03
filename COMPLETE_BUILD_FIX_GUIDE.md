# GitHub Actions 빌드 오류 종합 해결 가이드

## 오류 목록

1. ✅ `next.config.js` 경고: experimental.images
2. ✅ ESLint: compat is not defined
3. ✅ TypeScript: Property 'meals' does not exist on type 'DailyCheck'

---

## 해결 방법

### 1. types/index.ts 수정

**문제**: v3.0으로 업데이트하면서 속성명이 변경됨
- `meals` → `breakfastCompleted`, `lunchCompleted`, `dinnerCompleted`
- `water` → `waterIntake`
- `exercise` → `exerciseCompleted`

**해결**: 이전 버전 호환성 추가

```typescript
export interface DailyCheck {
  // v3.0 새 구조
  breakfastCompleted: boolean;
  lunchCompleted: boolean;
  dinnerCompleted: boolean;
  waterIntake: number;
  exerciseCompleted: boolean;
  
  // v2.0 호환성 (선택적)
  meals?: string;         // ⭐ 추가
  water?: number;         // ⭐ 추가
  exercise?: string;      // ⭐ 추가
  
  // 나머지...
}
```

---

### 2. eslint.config.mjs 수정

**문제**: `compat` 변수가 정의되지 않음

**해결**: 불필요한 플러그인 제거 및 globals 명시

```javascript
export default [
  {
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    // compat 관련 코드 모두 제거
  }
];
```

---

### 3. next.config.js 수정

**문제**: `experimental.images`는 Next.js 15에서 잘못된 위치

**해결**: 최상위로 이동

```javascript
const nextConfig = {
  // ✅ 올바른 위치
  images: {
    unoptimized: true,
  },
  
  // ❌ 여기 있으면 안 됨
  experimental: {
    // images: { ... }  // 제거!
  },
};
```

---

## 적용 순서

### Step 1: 파일 교체

```bash
# types/index.ts 백업 및 교체
cp types/index.ts types/index.ts.backup
cp types_v3_compatible.ts types/index.ts

# eslint.config.mjs 백업 및 교체
cp eslint.config.mjs eslint.config.mjs.backup
cp eslint.config_fixed.mjs eslint.config.mjs

# next.config.js 확인 (이미 수정했다면 skip)
# images가 experimental 밖에 있는지 확인
```

### Step 2: 로컬 테스트

```bash
# 타입 체크
npx tsc --noEmit

# ESLint 체크
npm run lint

# 빌드 테스트
npm run build
```

### Step 3: 결과 확인

모든 명령어가 성공하면:

```bash
git add .
git commit -m "Fix: GitHub Actions build errors
- Add backward compatibility to DailyCheck type
- Fix ESLint config (remove compat, add globals)
- Confirm next.config.js images location"
git push
```

---

## 버전 호환성 전략

### 데이터 접근 패턴

```typescript
// app/page.tsx에서 안전하게 접근
const mealCount = weekChecks.filter(check => 
  // v3.0 구조 시도
  check.breakfastCompleted || check.lunchCompleted || check.dinnerCompleted ||
  // v2.0 호환 (선택적 체이닝)
  check.meals
).length;

const waterAvg = weekChecks.reduce((sum, check) => 
  sum + (check.waterIntake || check.water || 0), 0
) / weekChecks.length;
```

### 데이터 저장 패턴

```typescript
// 새 데이터는 v3.0 구조로 저장
const newCheck: DailyCheck = {
  date: '2025-01-15',
  completed: true,
  breakfastCompleted: true,
  lunchCompleted: true,
  dinnerCompleted: true,
  waterIntake: 8,
  exerciseCompleted: true,
  // v2.0 호환 속성은 자동으로 optional
};
```

---

## 예상 결과

GitHub Actions에서:

```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Creating an optimized production build
✓ Collecting page data
✓ Generating static pages (10/10)
✓ Finalizing page optimization

Route (app)                              Size     First Load JS
┌ ○ /                                    5.2 kB         95.3 kB
├ ○ /login                               3.1 kB         93.2 kB
└ ○ /program                             4.8 kB         94.9 kB

Export successful!
```

---

## 체크리스트

수정 후 확인:

- [ ] types/index.ts에 meals, water, exercise 속성 있음
- [ ] eslint.config.mjs에 compat 없음
- [ ] next.config.js에서 images가 experimental 밖에 있음
- [ ] `npx tsc --noEmit` 성공
- [ ] `npm run lint` 성공
- [ ] `npm run build` 성공
- [ ] Git 커밋 & 푸시 완료

---

## 추가 정보

### v2.0 → v3.0 마이그레이션

기존 데이터가 있다면:

```typescript
// 마이그레이션 헬퍼 함수
function migrateDailyCheck(oldCheck: any): DailyCheck {
  return {
    ...oldCheck,
    // v2.0 속성을 v3.0으로 변환
    breakfastCompleted: oldCheck.meals?.includes('아침') || false,
    lunchCompleted: oldCheck.meals?.includes('점심') || false,
    dinnerCompleted: oldCheck.meals?.includes('저녁') || false,
    waterIntake: oldCheck.water || 0,
    exerciseCompleted: !!oldCheck.exercise,
    // v2.0 속성도 유지 (호환성)
    meals: oldCheck.meals,
    water: oldCheck.water,
    exercise: oldCheck.exercise,
  };
}
```

### TypeScript Strict Mode

더 엄격한 타입 체크를 원한다면 `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```
