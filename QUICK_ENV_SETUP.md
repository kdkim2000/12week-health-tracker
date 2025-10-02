# 🚀 .env.local 빠른 설정 가이드

## 📋 체크리스트 (5분 완료)

### ✅ Step 1: Firebase Console 접속
```
https://console.firebase.google.com/
→ 프로젝트 선택
→ ⚙️ 프로젝트 설정
→ 일반 탭 → 내 앱 → 웹 앱
→ Firebase SDK snippet → 구성
```

### ✅ Step 2: .env.local 파일 생성
```bash
# 프로젝트 루트 디렉토리에서
touch .env.local

# 또는 텍스트 에디터로 생성
```

### ✅ Step 3: 아래 템플릿 복사
```env
NEXT_PUBLIC_FIREBASE_API_KEY=여기에_API_키_붙여넣기
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=여기에_Auth_Domain_붙여넣기
NEXT_PUBLIC_FIREBASE_PROJECT_ID=여기에_Project_ID_붙여넣기
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=여기에_Storage_Bucket_붙여넣기
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=여기에_Sender_ID_붙여넣기
NEXT_PUBLIC_FIREBASE_APP_ID=여기에_App_ID_붙여넣기
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=여기에_Measurement_ID_붙여넣기
```

### ✅ Step 4: Firebase 값으로 교체
```
Firebase Console에서 복사 → .env.local에 붙여넣기
```

### ✅ Step 5: 서버 재시작
```bash
npm run dev
```

---

## 📖 실제 예시

### Firebase Console에 보이는 값:
```javascript
apiKey: "AIzaSyABC123DEF456GHI789JKL012MNO345PQR"
authDomain: "my-app-abc123.firebaseapp.com"
projectId: "my-app-abc123"
storageBucket: "my-app-abc123.appspot.com"
messagingSenderId: "123456789012"
appId: "1:123456789012:web:abc123def456"
measurementId: "G-ABC1234567"
```

### .env.local에 입력:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyABC123DEF456GHI789JKL012MNO345PQR
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=my-app-abc123.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=my-app-abc123
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=my-app-abc123.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC1234567
```

---

## ⚠️ 주의사항

### ❌ 하지 말아야 할 것
```env
# 따옴표 사용 (X)
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSy..."

# 공백 포함 (X)
NEXT_PUBLIC_FIREBASE_API_KEY = AIzaSy...

# 쉼표나 세미콜론 (X)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...,
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...;
```

### ✅ 올바른 형식
```env
# 등호 양쪽에 공백 없이, 따옴표 없이
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
```

---

## 🔍 설정 확인

### 방법 1: 파일 확인
```bash
# Mac/Linux
ls -la | grep .env
cat .env.local

# Windows
dir | findstr .env
type .env.local
```

### 방법 2: 스크립트 실행
```bash
node scripts/check-env.js
```

### 방법 3: 브라우저 확인
```
1. npm run dev
2. http://localhost:3000
3. F12 → Console
4. "✅ Firebase 초기화 완료" 확인
```

---

## 🐛 오류 해결

### "Firebase 설정이 누락되었습니다"
```
1. .env.local 파일 위치 확인 (프로젝트 루트)
2. 파일 이름 확인 (.env.local, 점으로 시작)
3. 7개 변수 모두 입력했는지 확인
4. 서버 재시작
```

### "Invalid API key"
```
1. Firebase Console에서 API 키 다시 복사
2. 정확히 붙여넣기 (공백 제거)
3. 따옴표 제거
```

---

## 🎯 완료 확인

### 성공 시 콘솔 메시지:
```
✅ Firebase 초기화 완료
```

### 이 메시지가 보이면:
```
✓ 회원가입 테스트
✓ 로그인 테스트
✓ 데이터 저장 테스트
```

---

## 📞 추가 도움

**상세 가이드:**
- ENV_SETUP_GUIDE.md

**문제 해결:**
- TESTING.md

**전체 설정:**
- SETUP.md

---

**빠른 설정 완료! 🎉**
