# 🔍 프로그램 페이지 문제 진단 가이드

## 📋 현재 상황

- ProtectedRoute 컴포넌트가 없음
- 기본 Next.js 라우팅 사용
- 로그인 상태에서 `/program` 접근 시 로그인 페이지로 리다이렉트됨

## 🔍 문제 원인 진단

### 확인 사항 1: app/program/page.tsx 내부 로직

현재 `app/program/page.tsx` 파일에 다음 코드가 있는지 확인:

```typescript
useEffect(() => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    router.push('/login');  // ← 이 코드 때문에 리다이렉트!
  }
}, [router]);
```

### 확인 사항 2: Layout 파일 체크

다음 파일들이 있는지 확인:
- `app/layout.tsx`
- `app/program/layout.tsx`
- `app/(auth)/layout.tsx` 등

이 파일들에 인증 로직이 있을 수 있습니다.

### 확인 사항 3: Middleware 체크

`middleware.ts` 또는 `middleware.js` 파일 확인:
- 프로젝트 루트
- `app/middleware.ts`
- `src/middleware.ts`

## 🎯 해결 방법

### 방법 1: page.tsx에서 로그인 체크 로직 제거/수정

현재 문제는 `app/program/page.tsx`의 useEffect에서 발생합니다.

**문제 코드:**
```typescript
useEffect(() => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    router.push('/login');  // ← 문제!
    return;
  }
  setUser(currentUser);
  const currentWeek = getWeekNumber(currentUser.startDate, getTodayString()) || 1;
  setSelectedWeek(currentWeek);
  setLoading(false);
}, [router]);
```

**해결 코드:**
```typescript
useEffect(() => {
  console.log('🔍 프로그램 페이지 로드 시작');
  
  const currentUser = getCurrentUser();
  console.log('📊 getCurrentUser 결과:', currentUser ? '사용자 있음' : '사용자 없음');
  
  if (!currentUser) {
    console.log('❌ 사용자 없음 → 로그인 페이지로 이동');
    router.push('/login');
    return;
  }
  
  console.log('✅ 사용자 확인:', currentUser.email);
  setUser(currentUser);
  
  const currentWeek = getWeekNumber(currentUser.startDate, getTodayString()) || 1;
  console.log('📅 현재 주차:', currentWeek);
  setSelectedWeek(currentWeek);
  setLoading(false);
}, [router]);
```

## 🧪 디버깅 단계

### 1단계: 브라우저 콘솔에서 확인

로그인한 상태에서 프로그램 페이지 접속 후 F12 콘솔 확인:

```javascript
// 1. localStorage 확인
console.log('currentUserId:', localStorage.getItem('currentUserId'));
console.log('users:', localStorage.getItem('users'));

// 2. getCurrentUser 함수 직접 실행
// (프로젝트에서 import 경로 확인 필요)
```

### 2단계: getCurrentUser 함수 확인

`lib/localStorage.ts` 파일의 getCurrentUser 함수 확인:

```typescript
export function getCurrentUser(): User | null {
  console.log('🔍 getCurrentUser 호출');
  
  if (typeof window === 'undefined') {
    console.log('⚠️ 서버 사이드 렌더링 - window 없음');
    return null;
  }
  
  const currentUserId = localStorage.getItem('currentUserId');
  console.log('📊 currentUserId:', currentUserId);
  
  if (!currentUserId) {
    console.log('❌ currentUserId 없음');
    return null;
  }
  
  const usersData = localStorage.getItem('users');
  console.log('📊 usersData:', usersData ? '있음' : '없음');
  
  if (!usersData) {
    console.log('❌ users 데이터 없음');
    return null;
  }
  
  const users = JSON.parse(usersData);
  const user = users[currentUserId];
  console.log('✅ 사용자 찾음:', user?.email);
  
  return user || null;
}
```

### 3단계: 로그인 함수 확인

로그인 시 localStorage에 제대로 저장되는지 확인:

```typescript
// app/login/page.tsx 또는 관련 파일

const handleLogin = async (email: string, password: string) => {
  // ... 로그인 로직
  
  // localStorage 저장 확인
  localStorage.setItem('currentUserId', user.id);
  console.log('✅ currentUserId 저장:', user.id);
  
  const users = JSON.parse(localStorage.getItem('users') || '{}');
  users[user.id] = user;
  localStorage.setItem('users', JSON.stringify(users));
  console.log('✅ users 저장:', users);
};
```

## 📝 체크리스트

다음을 순서대로 확인하세요:

1. [ ] 로그인 후 localStorage에 `currentUserId` 저장되는지 확인
2. [ ] 로그인 후 localStorage에 `users` 객체 저장되는지 확인
3. [ ] getCurrentUser() 함수가 제대로 작동하는지 확인
4. [ ] app/program/page.tsx의 useEffect가 실행되는지 확인
5. [ ] 브라우저 콘솔에서 로그 확인

## 🎯 가능한 원인별 해결책

### 원인 A: localStorage가 비어있음

**증상**: 로그인해도 localStorage에 저장 안 됨

**해결**: 로그인 함수에서 localStorage 저장 로직 추가

```typescript
// 로그인 성공 후
localStorage.setItem('currentUserId', user.id);
const users = JSON.parse(localStorage.getItem('users') || '{}');
users[user.id] = user;
localStorage.setItem('users', JSON.stringify(users));
```

### 원인 B: getCurrentUser가 항상 null 반환

**증상**: localStorage에 데이터는 있지만 함수가 null 반환

**해결**: getCurrentUser 함수 수정 또는 디버깅

### 원인 C: useEffect가 너무 빨리 실행됨

**증상**: localStorage에 저장되기 전에 체크함

**해결**: 로그인 후 프로그램 페이지로 이동하는 로직 확인

```typescript
// 로그인 후
await saveToLocalStorage();
await new Promise(resolve => setTimeout(resolve, 100)); // 약간의 지연
router.push('/program');
```

### 원인 D: 페이지 새로고침 시 로그인 상태 유실

**증상**: 페이지 새로고침하면 로그인 풀림

**해결**: localStorage 데이터 영속성 확인

## 💡 임시 해결책 (디버깅용)

문제를 찾기 위해 임시로 로그인 체크를 비활성화:

```typescript
// app/program/page.tsx
useEffect(() => {
  const currentUser = getCurrentUser();
  
  // ⚠️ 임시: 로그인 체크 비활성화
  if (!currentUser) {
    console.warn('⚠️ 임시: 로그인 체크 비활성화');
    // router.push('/login'); // 주석 처리
    // return;
    
    // 더미 사용자 생성
    const dummyUser = {
      id: 'temp-user',
      email: 'test@test.com',
      password: '',
      startDate: getTodayString(),
      createdAt: new Date().toISOString(),
      initialWeight: 70,
      targetWeight: 65,
      initialWaist: 85,
      targetWaist: 75,
    };
    setUser(dummyUser);
    setSelectedWeek(1);
    setLoading(false);
    return;
  }
  
  setUser(currentUser);
  const currentWeek = getWeekNumber(currentUser.startDate, getTodayString()) || 1;
  setSelectedWeek(currentWeek);
  setLoading(false);
}, [router]);
```

이렇게 하면 페이지가 표시되는지 확인할 수 있습니다.

## 🔄 다음 단계

1. 위의 디버깅 단계를 순서대로 실행
2. 브라우저 콘솔 로그 확인
3. 어느 단계에서 문제가 발생하는지 파악
4. 해당 원인에 맞는 해결책 적용

정확한 문제를 파악하기 위해 다음 정보를 공유해주세요:
- 브라우저 콘솔의 로그 메시지
- localStorage의 내용 (currentUserId, users)
- getCurrentUser() 함수의 반환값
