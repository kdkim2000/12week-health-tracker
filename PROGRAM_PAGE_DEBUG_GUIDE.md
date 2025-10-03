# 🔧 프로그램 페이지 로그인 리다이렉트 문제 해결

## 📋 문제 상황

로그인 상태에서 `/program` 페이지 접속 시:
- ❌ 로그인 페이지로 다시 리다이렉트됨
- ❌ 프로그램 페이지가 표시되지 않음

## 🔍 원인 분석

### 가능한 원인 3가지

#### 1. ProtectedRoute에서 `/program`이 보호 대상에 포함됨
```typescript
// ProtectedRoute.tsx에서
// /program이 PUBLIC_PATHS에 없으면 로그인 필요
```

#### 2. 페이지 내부와 ProtectedRoute에서 이중 체크
```typescript
// page.tsx에서 추가로 로그인 체크
// ProtectedRoute와 충돌
```

#### 3. getCurrentUser() 함수 문제
```typescript
// localStorage에서 사용자 정보를 제대로 가져오지 못함
```

## ✅ 해결 방법

### 방법 1: ProtectedRoute 설정 확인 (우선 확인)

`components/ProtectedRoute.tsx` 파일에서 `/program` 경로 처리 확인:

```typescript
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  // '/program',  // ← 이 줄이 있으면 제거!
];
```

**중요**: `/program`은 로그인 필수 페이지이므로 PUBLIC_PATHS에 **있으면 안 됩니다!**

### 방법 2: 개선된 page.tsx 사용

다운로드한 `program-page-final.tsx`를 사용하세요.

**주요 개선 사항:**
1. ProtectedRoute에 의존
2. 페이지 내부에서는 리다이렉트하지 않음
3. 안전한 사용자 정보 로드
4. 디버깅 로그 추가

```typescript
useEffect(() => {
  // ProtectedRoute가 이미 로그인을 검증했으므로
  // 여기서는 사용자 정보만 가져옴
  const loadUserData = () => {
    try {
      const currentUser = getCurrentUser();
      
      if (currentUser) {
        console.log('✅ 프로그램 페이지 - 사용자 정보 로드:', currentUser.email);
        setUser(currentUser);
        const currentWeek = getWeekNumber(currentUser.startDate, getTodayString()) || 1;
        setSelectedWeek(currentWeek);
      }
    } catch (error) {
      console.error('❌ 사용자 정보 로드 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 약간의 지연을 주어 ProtectedRoute가 먼저 실행되도록 함
  const timer = setTimeout(loadUserData, 100);
  
  return () => clearTimeout(timer);
}, []);
```

### 방법 3: 브라우저 콘솔 디버깅

브라우저 개발자 도구(F12) → Console에서 다음 확인:

#### 1. 로그인 상태 확인
```javascript
// 콘솔에 입력
localStorage.getItem('currentUserId')
// 결과: 사용자 ID가 출력되어야 함
```

#### 2. 사용자 정보 확인
```javascript
// 콘솔에 입력
JSON.parse(localStorage.getItem('users') || '{}')
// 결과: 사용자 객체가 출력되어야 함
```

#### 3. ProtectedRoute 로그 확인
```
✅ 공개 경로 접근: /
또는
✅ 인증 완료: /program
```

만약 다음 로그가 보이면 문제:
```
❌ 인증 필요: /program
```

## 📦 적용 순서

### 1단계: ProtectedRoute 확인 및 수정

```typescript
// components/ProtectedRoute.tsx

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  // ❌ '/program' 제거! (로그인 필수 페이지)
];
```

### 2단계: 개선된 page.tsx 적용

```bash
# 다운로드한 파일을 다음 위치로 복사
cp program-page-final.tsx app/program/page.tsx
```

### 3단계: 브라우저 캐시 삭제

```
F12 → Application → Clear storage → Clear site data
```

### 4단계: 개발 서버 재시작

```bash
# 터미널에서
Ctrl + C
npm run dev
```

### 5단계: 하드 리프레시

```
Ctrl + Shift + R (Windows/Linux)
Cmd + Shift + R (Mac)
```

## 🧪 테스트 방법

### 테스트 1: 로그아웃 상태
```
1. 로그아웃
2. 브라우저 주소창에 직접 입력: http://localhost:3000/program
3. 예상 결과: ✅ 로그인 페이지로 리다이렉트
```

### 테스트 2: 로그인 상태
```
1. 로그인
2. 메인 페이지에서 "프로그램" 버튼 클릭
3. 예상 결과: ✅ 프로그램 페이지 정상 표시
4. 브라우저 콘솔 확인:
   ✅ 프로그램 페이지 - 사용자 정보 로드: user@example.com
   📅 현재 주차: 1
```

### 테스트 3: 직접 URL 접근
```
1. 로그인 상태 유지
2. 브라우저 주소창에 직접 입력: http://localhost:3000/program
3. 예상 결과: ✅ 프로그램 페이지 정상 표시
4. ❌ 로그인 페이지로 리다이렉트되면 안 됨
```

## 🔍 여전히 문제가 있는 경우

### 시나리오 A: localStorage가 비어있음

**증상**: 로그인 후에도 사용자 정보가 없음

**해결**:
```javascript
// 브라우저 콘솔에서 확인
console.log('currentUserId:', localStorage.getItem('currentUserId'));
console.log('users:', localStorage.getItem('users'));

// 비어있다면 다시 로그인
```

### 시나리오 B: ProtectedRoute가 작동하지 않음

**증상**: 모든 페이지에서 로그인 요구

**확인**:
```typescript
// ProtectedRoute.tsx
console.log('Current pathname:', pathname);
console.log('Is public?', isPublicPath(pathname));
console.log('User:', user);
```

### 시나리오 C: 무한 리다이렉트 루프

**증상**: 로그인 페이지 ↔ 프로그램 페이지 반복

**해결**:
1. 브라우저 캐시 완전 삭제
2. 시크릿/프라이빗 모드에서 테스트
3. localStorage 완전 초기화:
```javascript
localStorage.clear();
// 그 후 다시 로그인
```

## 📊 디버깅 체크리스트

프로그램 페이지 접근 시 브라우저 콘솔에서 확인:

- [ ] `✅ 프로그램 페이지 - 사용자 정보 로드: user@example.com`
- [ ] `📅 현재 주차: 1` (또는 실제 주차)
- [ ] localStorage에 currentUserId 존재
- [ ] localStorage에 users 객체 존재
- [ ] ProtectedRoute에서 `/program`이 PUBLIC_PATHS에 없음
- [ ] 페이지가 정상적으로 렌더링됨

## 🎯 핵심 포인트

### ✅ 올바른 설정

```typescript
// ProtectedRoute.tsx
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  // '/program' ← 이 줄 없어야 함!
];

// app/program/page.tsx
useEffect(() => {
  // ❌ 페이지 내부에서 리다이렉트하지 않음
  // ✅ ProtectedRoute에 위임
  const currentUser = getCurrentUser();
  if (currentUser) {
    setUser(currentUser);
  }
  setLoading(false);
}, []);
```

### ❌ 잘못된 설정

```typescript
// ProtectedRoute.tsx
const PUBLIC_PATHS = [
  '/',
  '/login',
  '/register',
  '/program',  // ❌ 이렇게 하면 로그인 없이 접근 가능
];

// app/program/page.tsx
useEffect(() => {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    router.push('/login');  // ❌ ProtectedRoute와 충돌
  }
}, []);
```

## 🎉 완료!

올바르게 설정하면:
- ✅ 로그인 상태에서 프로그램 페이지 정상 접근
- ✅ 로그아웃 상태에서는 로그인 페이지로 리다이렉트
- ✅ 현재 주차 자동 표시
- ✅ 무한 리다이렉트 루프 없음

문제가 지속되면 위의 디버깅 체크리스트를 순서대로 확인하세요!
