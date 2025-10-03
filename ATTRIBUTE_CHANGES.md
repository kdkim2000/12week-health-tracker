# 속성명 변경 비교표

## DailyCheck 인터페이스 변경 사항

| 기능 | v2.0 (기존) | v3.0 (신규) | 호환성 |
|------|-------------|-------------|--------|
| **식단** | `meals?: string` | `breakfastCompleted: boolean`<br>`lunchCompleted: boolean`<br>`dinnerCompleted: boolean` | 둘 다 사용 가능 |
| **수분** | `water?: number` | `waterIntake: number` | 둘 다 사용 가능 |
| **운동** | `exercise?: string` | `exerciseCompleted: boolean`<br>`exerciseType?: string`<br>`exerciseDuration?: number` | 둘 다 사용 가능 |
| **체중** | `weight?: number` | `weight?: number` | 동일 |
| **허리** | `waist?: number` | `waist?: number` | 동일 |
| **완료** | `completed: boolean` | `completed: boolean` | 동일 |

## 코드 예시

### v2.0 스타일 (여전히 작동)
```typescript
const check: DailyCheck = {
  date: '2025-01-15',
  completed: true,
  meals: '아침: 계란, 점심: 샐러드, 저녁: 닭가슴살',
  water: 8,
  exercise: '유산소 30분',
  weight: 70,
};
```

### v3.0 스타일 (권장)
```typescript
const check: DailyCheck = {
  date: '2025-01-15',
  completed: true,
  breakfastCompleted: true,
  lunchCompleted: true,
  dinnerCompleted: true,
  waterIntake: 8,
  exerciseCompleted: true,
  exerciseType: '유산소',
  exerciseDuration: 30,
  weight: 70,
};
```

### 혼합 사용 (호환성)
```typescript
const check: DailyCheck = {
  date: '2025-01-15',
  completed: true,
  // v3.0 속성
  breakfastCompleted: true,
  waterIntake: 8,
  // v2.0 속성도 같이 사용 가능
  meals: '아침: 계란',
  water: 8,
};
```

## app/page.tsx 코드 수정 예시

### 현재 코드 (오류 발생)
```typescript
const mealCompletedCount = weekChecks.filter(check => check.meals).length;
// ❌ 오류: Property 'meals' does not exist
```

### 수정 옵션 1: 호환성 있게 수정 (권장)
```typescript
const mealCompletedCount = weekChecks.filter(check => 
  check.meals ||  // v2.0 호환
  check.breakfastCompleted || check.lunchCompleted || check.dinnerCompleted  // v3.0
).length;
```

### 수정 옵션 2: v3.0만 사용
```typescript
const mealCompletedCount = weekChecks.filter(check => 
  check.breakfastCompleted || check.lunchCompleted || check.dinnerCompleted
).length;
```

## 물 섭취량 코드 수정

### 현재 코드 (오류 발생)
```typescript
const waterTotal = weekChecks.reduce((sum, check) => sum + (check.water || 0), 0);
// ❌ 오류: Property 'water' does not exist
```

### 수정: 호환성 있게 수정
```typescript
const waterTotal = weekChecks.reduce((sum, check) => 
  sum + (check.waterIntake || check.water || 0), 0
);
```
