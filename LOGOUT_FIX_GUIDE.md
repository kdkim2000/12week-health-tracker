# 🔧 Firebase v3.0 로그아웃 오류 수정 가이드

## 📋 문제 상황

로그아웃 시 다음과 같은 오류가 발생했습니다:

```
❌ 일일 체크 실시간 동기화 오류: FirebaseError: Missing or insufficient permissions.
```

**원인**: 로그아웃 후에도 Firestore 실시간 리스너가 활성화되어 있어서, 권한이 없는 상태로 데이터베이스에 접근하려고 시도

## ✅ 해결 방법

### 1. Firestore 리스너 관리 시스템 추가

**수정된 파일**: `lib/firebase/firestore.ts`

#### 주요 변경사항:

```typescript
// 🆕 전역 리스너 관리
let activeListeners: Map<string, Unsubscribe> = new Map();

/**
 * 🆕 모든 활성 리스너 정리 (로그아웃 시 호출)
 */
export function unsubscribeAllListeners(): void {
  console.log('🔌 모든 Firestore 리스너 정리 중...');
  
  activeListeners.forEach((unsubscribe, key) => {
    console.log(`  - ${key} 리스너 해제`);
    unsubscribe();
  });
  
  activeListeners.clear();
  console.log('✅ 모든 리스너 정리 완료');
}
```

#### 리스너 함수 개선:

각 실시간 리스너 함수에 다음 기능 추가:

1. **리스너 등록 및 관리**
```typescript
export function subscribeToDailyChecks(
  userId: string,
  callback: (dailyChecks: Record<string, DailyCheck>) => void
): Unsubscribe {
  const listenerKey = `dailyChecks_${userId}`;
  
  // 리스너 생성...
  const unsubscribe = onSnapshot(/* ... */);
  
  // 🆕 활성 리스너 목록에 추가
  registerListener(listenerKey, unsubscribe);
  
  // 🆕 정리 함수 반환
  return () => {
    removeListener(listenerKey);
  };
}
```

2. **권한 오류 처리**
```typescript
onSnapshot(
  q,
  (snapshot) => {
    // 성공 콜백
  },
  (error) => {
    // 🆕 로그아웃 시 발생하는 권한 오류 무시
    if (error.code === 'permission-denied') {
      console.log('ℹ️ 권한 없음 (로그아웃됨) - 리스너 자동 해제');
      removeListener(listenerKey);
      return;
    }
    console.error('❌ 실시간 동기화 오류:', error);
  }
);
```

### 2. Auth 로그아웃 함수 수정

**수정된 파일**: `lib/firebase/auth.ts`

```typescript
import { unsubscribeAllListeners } from './firestore'; // 🆕 추가

/**
 * 🆕 로그아웃 (Firestore 리스너 정리 포함)
 */
export async function signOut(): Promise<void> {
  try {
    // 🆕 1단계: 모든 Firestore 리스너 정리
    console.log('🔌 로그아웃 준비: Firestore 리스너 정리 중...');
    unsubscribeAllListeners();
    
    // 2단계: Firebase 로그아웃
    await firebaseSignOut(auth);
    
    console.log('✅ 로그아웃 완료');
  } catch (error: any) {
    console.error('❌ 로그아웃 실패:', error);
    
    // 로그아웃은 대부분 성공하므로, 에러가 발생해도 리스너는 정리
    unsubscribeAllListeners();
    
    throw new Error('로그아웃에 실패했습니다.');
  }
}
```

### 3. React 컴포넌트에서 리스너 정리

실시간 리스너를 사용하는 컴포넌트에서 cleanup 함수 추가:

```typescript
import { subscribeToDailyChecks } from '@/lib/firebase/firestore';
import { useEffect } from 'react';

function DashboardPage() {
  useEffect(() => {
    if (!user?.uid) return;

    // 실시간 동기화 시작
    const unsubscribe = subscribeToDailyChecks(user.uid, (checks) => {
      setDailyChecks(checks);
    });

    // 🆕 컴포넌트 언마운트 시 리스너 정리
    return () => {
      console.log('🧹 컴포넌트 언마운트 - 리스너 정리');
      unsubscribe();
    };
  }, [user?.uid]);

  // ... 나머지 코드
}
```

## 📦 설치 및 적용

### 1. 수정된 파일 교체

```bash
# 1. firestore.ts 교체
cp /path/to/outputs/firestore.ts lib/firebase/firestore.ts

# 2. auth.ts 교체
cp /path/to/outputs/auth.ts lib/firebase/auth.ts
```

### 2. 빌드 및 테스트

```bash
# 의존성 설치 (필요시)
npm install

# 타입 체크
npm run type-check

# 빌드
npm run build

# 개발 서버 실행
npm run dev
```

### 3. 로그아웃 테스트

1. 로그인
2. 대시보드에서 데이터 확인 (실시간 리스너 활성화)
3. 로그아웃 버튼 클릭
4. 브라우저 콘솔 확인:

```
🔌 로그아웃 준비: Firestore 리스너 정리 중...
  - dailyChecks_USER_ID 리스너 해제
  - userProfile_USER_ID 리스너 해제
✅ 모든 리스너 정리 완료
✅ 로그아웃 완료
```

## 🔍 동작 원리

### 리스너 생명주기

```
┌─────────────────────────────────────────────────────────────┐
│                       로그인 성공                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              실시간 리스너 등록 및 활성화                        │
│  - subscribeToDailyChecks()                                │
│  - subscribeToUserProfile()                                │
│  → activeListeners Map에 저장                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    데이터 실시간 동기화                         │
│  - Firestore 변경사항 자동 반영                               │
│  - UI 자동 업데이트                                           │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                     로그아웃 버튼 클릭                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              unsubscribeAllListeners() 호출                  │
│  1. activeListeners Map 순회                               │
│  2. 각 리스너의 unsubscribe() 호출                           │
│  3. Map 초기화                                              │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Firebase 로그아웃 실행                       │
│  - auth.signOut()                                          │
│  - 인증 토큰 제거                                            │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   로그아웃 완료 (오류 없음)                     │
└─────────────────────────────────────────────────────────────┘
```

## 🎯 개선 효과

### Before (수정 전)
```
❌ 로그아웃 → 리스너 활성화 유지 → 권한 오류 발생
```

### After (수정 후)
```
✅ 로그아웃 → 리스너 자동 정리 → 깨끗한 로그아웃
```

## 📊 테스트 체크리스트

- [ ] 로그인 후 실시간 데이터 동기화 정상 작동
- [ ] 로그아웃 시 권한 오류 없이 정상 완료
- [ ] 브라우저 콘솔에 리스너 정리 로그 출력
- [ ] 재로그인 시 실시간 동기화 정상 작동
- [ ] 여러 번 로그인/로그아웃 반복해도 정상 작동
- [ ] 메모리 누수 없음 (개발자 도구 - Performance)

## 🚀 배포

수정 사항이 확인되면 다음 명령어로 배포:

```bash
# GitHub에 푸시
git add lib/firebase/firestore.ts lib/firebase/auth.ts
git commit -m "Fix: 로그아웃 시 Firestore 리스너 정리 기능 추가"
git push origin main

# GitHub Actions가 자동으로 배포
```

## 📝 관련 코드 변경 사항

### 영향받는 파일
1. ✅ `lib/firebase/firestore.ts` - 리스너 관리 시스템 추가
2. ✅ `lib/firebase/auth.ts` - 로그아웃 시 리스너 정리 호출
3. ⚠️ `app/*/page.tsx` - 컴포넌트에서 cleanup 함수 사용 권장

### 추가된 함수
- `unsubscribeAllListeners()` - 모든 리스너 정리
- `registerListener()` - 리스너 등록
- `removeListener()` - 특정 리스너 제거

### 수정된 함수
- `subscribeToDailyChecks()` - 리스너 관리 추가
- `subscribeToUserProfile()` - 리스너 관리 추가
- `subscribeToDailyCheck()` - 리스너 관리 추가
- `signOut()` - 리스너 정리 로직 추가

## 🔐 보안 고려사항

이 수정사항으로 다음이 보장됩니다:

1. ✅ **권한 관리**: 로그아웃 후 데이터 접근 시도 차단
2. ✅ **메모리 관리**: 리스너 정리로 메모리 누수 방지
3. ✅ **에러 처리**: 권한 오류를 조용히 처리하여 UX 개선
4. ✅ **리소스 최적화**: 불필요한 네트워크 요청 방지

## 💡 추가 개선 사항 (선택)

### 1. 리스너 상태 모니터링

```typescript
// lib/firebase/firestore.ts에 추가
export function getActiveListenersCount(): number {
  return activeListeners.size;
}

export function getActiveListenerKeys(): string[] {
  return Array.from(activeListeners.keys());
}
```

### 2. 디버그 모드

```typescript
// 개발 환경에서만 상세 로그 출력
const DEBUG = process.env.NODE_ENV === 'development';

if (DEBUG) {
  console.log('[DEBUG] 활성 리스너:', getActiveListenerKeys());
}
```

## 🎉 완료!

이제 로그아웃 시 Firestore 권한 오류가 발생하지 않습니다.

문제가 지속되면 다음을 확인하세요:
1. Firebase 보안 규칙이 올바르게 설정되었는지
2. 브라우저 콘솔에서 리스너 정리 로그가 출력되는지
3. 네트워크 탭에서 로그아웃 후 Firestore 요청이 없는지
