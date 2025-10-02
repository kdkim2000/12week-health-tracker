# 🧪 v3.0 Firebase 테스트 가이드

## 📋 테스트 체크리스트

### 1️⃣ 환경 설정 확인

```bash
# .env.local 파일 존재 확인
ls -la .env.local

# Firebase 설정값 확인 (값이 "your-xxx"가 아닌지 확인)
cat .env.local
```

### 2️⃣ 로컬 개발 서버 시작

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### 3️⃣ 회원가입 테스트

**시나리오:**
1. `/signup` 페이지 접속
2. 이메일/비밀번호 입력
3. "다음 단계" 클릭
4. 신체 정보 입력 (체중, 허리둘레, 목표)
5. "회원가입 완료" 클릭

**예상 결과:**
- ✅ Firebase Console → Authentication에 사용자 추가됨
- ✅ Firebase Console → Firestore → users 컬렉션에 문서 생성됨
- ✅ 자동으로 메인 페이지로 이동

**확인 방법:**
```
Firebase Console → Authentication
→ 새 사용자가 목록에 나타나는지 확인

Firebase Console → Firestore Database → users
→ 사용자 ID로 된 문서가 생성되었는지 확인
```

### 4️⃣ 로그인 테스트

**시나리오:**
1. 로그아웃 후 `/login` 페이지 접속
2. 가입한 이메일/비밀번호로 로그인

**예상 결과:**
- ✅ 메인 페이지로 이동
- ✅ 사용자 정보 표시
- ✅ 기존 데이터 로드됨

### 5️⃣ 일일 체크 저장 테스트

**시나리오:**
1. 달력에서 오늘 날짜 클릭
2. 체크 항목 입력 (식사, 물, 운동 등)
3. "저장" 클릭

**예상 결과:**
- ✅ Firebase Console → Firestore → dailyChecks/[userId]/checks에 날짜 문서 생성
- ✅ 달력 색상 변경 (완료율에 따라)
- ✅ "동기화 완료" 메시지 표시

**확인 방법:**
```
Firebase Console → Firestore Database
→ dailyChecks → [userId] → checks → [날짜]
→ 입력한 데이터가 저장되었는지 확인
```

### 6️⃣ 실시간 동기화 테스트

**시나리오:**
1. 같은 계정으로 2개의 브라우저(또는 탭) 열기
2. 한쪽에서 일일 체크 저장
3. 다른 쪽에서 자동으로 업데이트되는지 확인

**예상 결과:**
- ✅ 저장한 쪽: "동기화 중..." → "동기화 완료"
- ✅ 다른 쪽: 자동으로 데이터 업데이트됨 (새로고침 불필요)
- ✅ 달력 색상 실시간 반영

### 7️⃣ 다중 기기 테스트

**시나리오:**
1. PC에서 데이터 입력
2. 모바일에서 같은 계정으로 로그인
3. PC에서 입력한 데이터가 보이는지 확인

**예상 결과:**
- ✅ 모든 기기에서 동일한 데이터 표시
- ✅ 실시간 동기화 작동

### 8️⃣ 에러 처리 테스트

**테스트 케이스:**

1. **잘못된 이메일 형식**
   - 입력: `test@` (도메인 없음)
   - 예상: "유효하지 않은 이메일 형식입니다" 에러

2. **짧은 비밀번호**
   - 입력: `12345` (6자 미만)
   - 예상: "비밀번호는 6자 이상이어야 합니다" 에러

3. **이미 존재하는 이메일**
   - 기존 계정으로 다시 가입 시도
   - 예상: "이미 사용 중인 이메일입니다" 에러

4. **잘못된 로그인 정보**
   - 틀린 비밀번호 입력
   - 예상: "이메일 또는 비밀번호가 올바르지 않습니다" 에러

---

## 🐛 문제 해결

### 문제 1: "Firebase is not defined" 에러

**원인:** 환경 변수 미설정

**해결:**
```bash
# .env.local 파일 확인
cat .env.local

# 파일이 없으면 .env.local.example 복사
cp .env.local.example .env.local

# Firebase Console에서 받은 실제 값으로 수정
nano .env.local
```

### 문제 2: "Permission denied" 에러

**원인:** Firestore 보안 규칙 미설정

**해결:**
```
Firebase Console → Firestore Database → 규칙

다음 규칙으로 수정:
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /dailyChecks/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}

"게시" 클릭
```

### 문제 3: 실시간 동기화가 안 됨

**원인:** 네트워크 연결 또는 리스너 미등록

**해결:**
```javascript
// 브라우저 콘솔에서 확인
console.log('Firebase initialized:', firebase.apps.length > 0);

// 네트워크 탭에서 Firestore 요청 확인
// wss://firestore.googleapis.com 연결 확인
```

### 문제 4: 배포 후 환경 변수 인식 안 됨

**원인:** GitHub Secrets 미설정

**해결:**
```
GitHub Repository → Settings → Secrets and variables → Actions
→ New repository secret 클릭

각 환경 변수를 Secret으로 추가:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- ...
```

---

## ✅ 테스트 통과 기준

- [ ] 회원가입 성공 (Firebase Console에서 확인)
- [ ] 로그인 성공
- [ ] 일일 체크 저장 성공
- [ ] 실시간 동기화 작동
- [ ] 다중 기기에서 동일 데이터 확인
- [ ] 에러 메시지 정상 표시
- [ ] 로그아웃 정상 작동

모든 항목이 통과하면 배포 준비 완료! 🎉
