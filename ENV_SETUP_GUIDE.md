# 🔥 .env.local 파일 설정 완벽 가이드

## 📋 단계별 설정 방법

### 1️⃣ Firebase Console에서 설정값 가져오기

**Step 1: Firebase Console 접속**
```
https://console.firebase.google.com/
```

**Step 2: 프로젝트 선택**
- 생성한 프로젝트 클릭 (예: 12week-health-tracker)

**Step 3: 프로젝트 설정 열기**
- 좌측 상단 ⚙️(톱니바퀴) 아이콘 클릭
- "프로젝트 설정" 클릭

**Step 4: 웹 앱 설정 확인**
- "일반" 탭에서 아래로 스크롤
- "내 앱" 섹션 찾기
- 웹 앱 (</> 아이콘) 클릭

**Step 5: SDK 설정 확인**
- "Firebase SDK snippet" 선택
- "구성" 라디오 버튼 클릭
- 다음과 같은 코드가 보임:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567",
  authDomain: "12week-health-tracker.firebaseapp.com",
  projectId: "12week-health-tracker",
  storageBucket: "12week-health-tracker.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789",
  measurementId: "G-ABCD1234EF"
};
```

---

### 2️⃣ .env.local 파일 생성

**프로젝트 루트 디렉토리에서:**

```bash
# 방법 1: 터미널에서 파일 생성
touch .env.local

# 방법 2: 텍스트 에디터로 생성
# VS Code: File → New File → 저장할 때 이름을 '.env.local'로 지정
# 또는 프로젝트 폴더에서 직접 '.env.local' 파일 생성
```

**⚠️ 중요:**
- 파일 이름은 정확히 `.env.local` (점으로 시작)
- 프로젝트 최상위 폴더에 위치 (package.json과 같은 위치)

---

### 3️⃣ 환경 변수 입력

**.env.local 파일에 다음 내용을 복사하고 값을 교체:**

```env
# Firebase API Key
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyAbCdEfGhIjKlMnOpQrStUvWxYz1234567

# Firebase Auth Domain
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=12week-health-tracker.firebaseapp.com

# Firebase Project ID
NEXT_PUBLIC_FIREBASE_PROJECT_ID=12week-health-tracker

# Firebase Storage Bucket
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=12week-health-tracker.appspot.com

# Firebase Messaging Sender ID
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012

# Firebase App ID
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456ghi789

# Firebase Measurement ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABCD1234EF
```

**각 항목을 Firebase Console에서 복사한 실제 값으로 교체하세요!**

---

## 📝 실제 입력 예시

### Firebase Console의 값 (예시):
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyCx9Jk3mN5pQrStUvWxYz0123456789ABC",
  authDomain: "my-health-app-abc123.firebaseapp.com",
  projectId: "my-health-app-abc123",
  storageBucket: "my-health-app-abc123.appspot.com",
  messagingSenderId: "987654321012",
  appId: "1:987654321012:web:def456ghi789jkl012",
  measurementId: "G-XYZ9876543"
};
```

### .env.local 파일에 입력:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyCx9Jk3mN5pQrStUvWxYz0123456789ABC
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-health-app-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-health-app-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-health-app-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=987654321012
NEXT_PUBLIC_FIREBASE_APP_ID=1:987654321012:web:def456ghi789jkl012
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XYZ9876543
```

---

## ✅ 입력 규칙

### ✔️ 올바른 형식
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXX
```
- 등호(=) 양쪽에 공백 없음
- 따옴표 없음
- 값만 입력

### ❌ 잘못된 형식
```env
# 잘못됨: 따옴표 포함
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyXXXXXXX"

# 잘못됨: 공백 포함
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSyXXXXXXX

# 잘못됨: 쉼표 포함
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXX,

# 잘못됨: 세미콜론 포함
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXX;
```

---

## 🔍 설정 확인

### 1. 파일 위치 확인
```bash
# 터미널에서 실행
ls -la | grep .env

# 출력에 다음이 보여야 함:
# .env.local
```

### 2. 파일 내용 확인
```bash
# 터미널에서 실행 (Mac/Linux)
cat .env.local

# Windows PowerShell
type .env.local

# 모든 7개 변수가 설정되어 있는지 확인
```

### 3. 개발 서버 재시작
```bash
# 기존 서버 종료 (Ctrl+C)
# 서버 재시작
npm run dev
```

### 4. 브라우저 확인
```
1. http://localhost:3000 접속
2. F12 (개발자 도구)
3. Console 탭 확인
4. "✅ Firebase 초기화 완료" 메시지 확인
```

---

## 🐛 여전히 오류가 발생한다면?

### 체크리스트

- [ ] `.env.local` 파일이 프로젝트 루트에 있나요?
- [ ] 파일 이름이 정확히 `.env.local`인가요? (점으로 시작)
- [ ] 7개 변수가 모두 입력되었나요?
- [ ] 각 변수 이름이 정확한가요? (`NEXT_PUBLIC_FIREBASE_` 접두사)
- [ ] 등호(=) 양쪽에 공백이 없나요?
- [ ] 따옴표가 없나요?
- [ ] Firebase Console에서 복사한 실제 값인가요?
- [ ] 개발 서버를 재시작했나요?

### 오류별 해결 방법

**1. "Firebase 설정이 누락되었습니다"**
```
→ .env.local 파일 내용 확인
→ 변수 이름 오타 확인
→ 서버 재시작
```

**2. "Invalid API key"**
```
→ Firebase Console에서 API 키 다시 복사
→ 정확히 붙여넣기 (공백 없이)
```

**3. "Project not found"**
```
→ PROJECT_ID가 올바른지 확인
→ Firebase Console의 프로젝트 ID와 일치하는지 확인
```

---

## 📱 추가 팁

### VS Code 사용자
1. `.env.local` 파일 열기
2. 우측 하단 언어 모드를 "ENV" 또는 "Properties"로 변경
3. 문법 강조로 오타 확인 가능

### Git 커밋 전 확인
```bash
# .gitignore에 .env.local이 포함되어 있는지 확인
cat .gitignore | grep .env

# 출력: .env*.local 또는 .env.local
```

---

## 🎯 최종 확인

설정이 완료되면 다음 명령어로 확인:

```bash
# 개발 서버 실행
npm run dev

# 브라우저에서 접속
# http://localhost:3000

# 개발자 도구 콘솔에서 확인할 메시지:
# ✅ Firebase 초기화 완료
# ♻️ 기존 Firebase 앱 재사용
```

**이 메시지가 보이면 설정 완료! 🎉**

---

## 📞 여전히 문제가 있나요?

다음 정보와 함께 문의하세요:

1. 에러 메시지 전체
2. .env.local 파일 내용 (실제 값은 가리고 형식만)
3. Firebase Console 스크린샷
4. 브라우저 콘솔 로그

**보안상 실제 API 키는 절대 공유하지 마세요!**
