# ⚡ Firebase API 키 오류 - 빠른 해결 체크리스트

## 🎯 3분 안에 해결하기

### ✅ 1단계: Firebase Console에서 설정 복사 (1분)

1. 브라우저에서 열기: https://console.firebase.google.com/
2. 프로젝트 선택
3. 왼쪽 상단 **톱니바퀴** 아이콘 → **프로젝트 설정**
4. **일반** 탭 → 아래로 스크롤 → **내 앱** 섹션
5. 웹 앱 **</>** 아이콘 클릭
6. **SDK 설정 및 구성** → **구성** 선택
7. 모든 설정 값 복사

### ✅ 2단계: .env.local 파일 생성 (1분)

프로젝트 루트 폴더(`package.json`이 있는 위치)에 `.env.local` 파일 생성:

```bash
# Windows
type nul > .env.local

# Mac/Linux
touch .env.local
```

VSCode나 메모장으로 `.env.local` 파일 열고 아래 내용 붙여넣기:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=실제_API_키_여기에_붙여넣기
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=실제_도메인_여기에
NEXT_PUBLIC_FIREBASE_PROJECT_ID=실제_프로젝트_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=실제_스토리지
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=실제_센더_ID
NEXT_PUBLIC_FIREBASE_APP_ID=실제_앱_ID
```

### ✅ 3단계: 개발 서버 재시작 (30초)

```bash
# 터미널에서 Ctrl + C로 서버 중지

# 서버 재시작
npm run dev
```

### ✅ 4단계: 확인 (30초)

브라우저 콘솔(F12)에서 확인:

**성공 시:**
```
✅ API Key: AIzaSyBxxx...
✅ Auth Domain: your-project.firebaseapp.com
✅ Firebase 초기화 완료
```

**실패 시:**
```
❌ API Key: Missing (Required)
또는
❌ API Key: Placeholder value detected
```

---

## 🔍 문제별 해결

### 문제: "your-api-key-here" 오류

**원인:** 환경 변수가 설정되지 않았거나 placeholder 값 사용

**해결:**
1. `.env.local` 파일이 프로젝트 **루트**에 있는지 확인
2. 파일 내용에 실제 Firebase 값이 들어있는지 확인
3. `NEXT_PUBLIC_` 접두사가 있는지 확인
4. 개발 서버 재시작

### 문제: undefined 오류

**원인:** Next.js에서 환경 변수가 로드되지 않음

**해결:**
```bash
# ❌ 잘못된 예
FIREBASE_API_KEY=...

# ✅ 올바른 예 (NEXT_PUBLIC_ 접두사 필수!)
NEXT_PUBLIC_FIREBASE_API_KEY=...
```

### 문제: 서버 재시작 후에도 오류

**해결:**
1. 브라우저 **하드 리프레시**: `Ctrl + Shift + R`
2. 브라우저 캐시 삭제: F12 → Application → Clear storage
3. `.env.local` 파일 위치 재확인
4. 터미널에서 서버 완전 종료 후 재시작

---

## 📝 .env.local 예시

```bash
# 실제 예시 (값은 여러분의 프로젝트 값으로 교체)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-health-tracker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-health-tracker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-health-tracker.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890abcdef
```

---

## 🎉 테스트

로그인 페이지에서 로그인 시도:

**성공:**
```
✅ 로그인 성공
```

**여전히 실패:**
1. 브라우저 콘솔 확인
2. Network 탭에서 요청 URL 확인
3. `.env.local` 파일 내용 재확인
4. Firebase Console에서 API 키 재복사

---

## 💡 자주 하는 실수

1. ❌ `.env` 파일 생성 (`.env.local`이어야 함)
2. ❌ `NEXT_PUBLIC_` 접두사 누락
3. ❌ 파일을 잘못된 위치에 생성 (package.json과 같은 폴더에 있어야 함)
4. ❌ 개발 서버를 재시작하지 않음
5. ❌ placeholder 값(`your-api-key-here`)을 그대로 사용

---

## 🚀 완료 후

- [x] .env.local 파일 생성
- [x] Firebase 설정 값 입력
- [x] 개발 서버 재시작
- [x] 브라우저 콘솔 확인
- [x] 로그인 테스트 성공

이제 Firebase 인증이 정상 작동합니다! 🎉
