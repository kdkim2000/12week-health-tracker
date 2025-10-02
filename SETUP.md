# 🔥 Firebase 설정 완벽 가이드

v3.0 Firebase 연동을 위한 단계별 가이드입니다.

---

## 📋 전체 프로세스

```
1. Firebase 프로젝트 생성 (15분)
2. 로컬 개발 환경 설정 (10분)
3. 코드 작성 및 테스트 (30분)
4. GitHub 배포 설정 (10분)
5. 최종 배포 및 테스트 (10분)

총 소요 시간: 약 75분
```

---

## 1️⃣ Firebase 프로젝트 생성

### Step 1: Firebase Console 접속

1. **브라우저에서 Firebase Console 접속**
   ```
   https://console.firebase.google.com/
   ```

2. **Google 계정으로 로그인**
   - Gmail 계정 필요
   - 없다면 새로 만들기

### Step 2: 프로젝트 생성

1. **"프로젝트 추가" 또는 "Add project" 클릭**

2. **프로젝트 이름 입력**
   ```
   프로젝트 이름: 12week-health-tracker
   ```
   - 프로젝트 ID는 자동으로 생성됨
   - `12week-health-tracker-xxxxx` 형식

3. **"계속" 클릭**

4. **Google Analytics 설정**
   ```
   ☑️ Google Analytics 사용 설정 (권장)
   ```
   - "계정 선택" 또는 "새 계정 만들기"
   - 위치: 대한민국

5. **"프로젝트 만들기" 클릭**
   - 약 30초~1분 소요
   - "프로젝트가 준비되었습니다" 메시지 확인

6. **"계속" 클릭하여 프로젝트 콘솔로 이동**

### Step 3: 웹 앱 등록

1. **프로젝트 개요 페이지에서 웹 아이콘(</>)클릭**
   ```
   </> Web 앱에 Firebase 추가
   ```

2. **앱 정보 입력**
   ```
   앱 닉네임: 12Week Health Tracker
   ☑️ 이 앱의 Firebase Hosting도 설정합니다 (선택사항)
   ```

3. **"앱 등록" 클릭**

4. **Firebase SDK 설정 화면**
   
   ⚠️ **중요: 이 정보를 반드시 복사하세요!**

   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
     authDomain: "12week-health-tracker.firebaseapp.com",
     projectId: "12week-health-tracker",
     storageBucket: "12week-health-tracker.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456",
     measurementId: "G-XXXXXXXXXX"
   };
   ```

   📋 **체크리스트:**
   - [ ] apiKey 복사
   - [ ] authDomain 복사
   - [ ] projectId 복사
   - [ ] storageBucket 복사
   - [ ] messagingSenderId 복사
   - [ ] appId 복사
   - [ ] measurementId 복사

5. **"콘솔로 이동" 클릭**

### Step 4: Authentication 설정

1. **좌측 메뉴에서 "Authentication" 클릭**

2. **"시작하기" 버튼 클릭**

3. **로그인 방법 탭**

4. **"이메일/비밀번호" 항목 클릭**

5. **설정 활성화**
   ```
   ☑️ 사용 설정
   ☐ 이메일 링크(비밀번호가 없는 로그인) - 사용 안 함
   ```

6. **"저장" 클릭**

7. **확인**
   ```
   이메일/비밀번호 상태: "사용 설정됨" ✓
   ```

### Step 5: Firestore Database 생성

1. **좌측 메뉴에서 "Firestore Database" 클릭**

2. **"데이터베이스 만들기" 클릭**

3. **보안 규칙 선택**
   ```
   ⚫ 프로덕션 모드에서 시작 (권장)
   ☐ 테스트 모드에서 시작
   ```
   - 프로덕션 모드 선택!

4. **"다음" 클릭**

5. **Cloud Firestore 위치 선택**
   ```
   asia-northeast3 (서울)
   ```
   - ⚠️ 한 번 선택하면 변경 불가
   - 한국 사용자라면 서울 선택 권장

6. **"사용 설정" 클릭**
   - 약 1~2분 소요

7. **데이터베이스 생성 완료 확인**

### Step 6: Firestore 보안 규칙 설정

1. **"규칙" 탭 클릭**

2. **기본 규칙 삭제 후 다음 규칙 붙여넣기:**

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자 프로필: 본인만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // 일일 체크: 본인만 읽기/쓰기 가능
    match /dailyChecks/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. **"게시" 클릭**

4. **확인 메시지**
   ```
   규칙이 업데이트되었습니다 ✓
   ```

### Step 7: 승인된 도메인 추가

1. **Authentication → Settings 탭 클릭**

2. **"승인된 도메인" 섹션 찾기**

3. **기본으로 있어야 할 도메인:**
   ```
   localhost (개발용)
   12week-health-tracker.firebaseapp.com (Firebase Hosting)
   ```

4. **GitHub Pages 도메인 추가:**
   - "도메인 추가" 클릭
   - 입력: `kdkim2000.github.io`
   - "추가" 클릭

5. **최종 확인:**
   ```
   ✓ localhost
   ✓ 12week-health-tracker.firebaseapp.com
   ✓ kdkim2000.github.io
   ```

---

## 2️⃣ 로컬 개발 환경 설정

### Step 1: 저장소 클론 또는 초기화

```bash
# 기존 프로젝트가 있다면
cd 12week-health-tracker

# 새 프로젝트라면
git clone https://github.com/kdkim2000/12week-health-tracker.git
cd 12week-health-tracker
```

### Step 2: Firebase 패키지 설치

```bash
# Firebase SDK 설치
npm install firebase

# 타입 정의 설치
npm install --save-dev @types/firebase

# 날짜 처리 라이브러리 (선택사항)
npm install date-fns
```

### Step 3: 환경 변수 파일 생성

```bash
# .env.local.example 복사
cp .env.local.example .env.local

# 파일 편집 (VS Code 사용 시)
code .env.local

# 또는 nano 사용
nano .env.local
```

### Step 4: Firebase 설정값 입력

`.env.local` 파일에 Step 1-3에서 복사한 값을 붙여넣기:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=12week-health-tracker.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=12week-health-tracker
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=12week-health-tracker.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

⚠️ **주의:**
- 따옴표 없이 값만 입력
- 띄어쓰기 없이 입력
- 실제 Firebase Console의 값으로 교체

### Step 5: 개발 서버 실행

```bash
# 개발 서버 시작
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

### Step 6: Firebase 연결 확인

1. **브라우저 개발자 도구 열기 (F12)**

2. **Console 탭 확인**

3. **다음 메시지가 나타나야 함:**
   ```
   ✅ Firebase 초기화 완료
   ```

4. **에러가 있다면:**
   ```javascript
   // 에러 예시
   ❌ Firebase: Error (auth/invalid-api-key)
   
   // 해결: .env.local 파일의 API 키 확인
   ```

---

## 3️⃣ 기능 테스트

### 테스트 1: 회원가입

```bash
1. http://localhost:3000/signup 접속
2. 이메일 입력: test@example.com
3. 비밀번호 입력: test1234
4. "다음 단계" 클릭
5. 신체 정보 입력:
   - 현재 체중: 80kg
   - 목표 체중: 75kg
   - 현재 허리둘레: 90cm
   - 목표 허리둘레: 85cm
6. "회원가입 완료" 클릭
```

**확인:**
```
Firebase Console → Authentication
→ Users 탭
→ test@example.com이 추가되었는지 확인 ✓
```

### 테스트 2: 데이터 저장

```bash
1. 메인 페이지에서 오늘 날짜 클릭
2. 체크 항목 입력:
   - 아침 식사 체크 ☑️
   - 물 섭취 5잔 선택
   - 운동 완료 체크 ☑️
3. "저장" 클릭
```

**확인:**
```
Firebase Console → Firestore Database
→ dailyChecks → [userId] → checks → [today]
→ 입력한 데이터가 저장되었는지 확인 ✓
```

### 테스트 3: 실시간 동기화

```bash
1. 브라우저에서 2개 탭 열기 (둘 다 로그인)
2. 탭 1: 데이터 입력 및 저장
3. 탭 2: 자동으로 업데이트되는지 확인
```

**예상 결과:**
```
탭 1: "동기화 완료" 메시지
탭 2: 자동으로 데이터 반영 (새로고침 불필요) ✓
```

---

## 4️⃣ GitHub 배포 설정

### Step 1: GitHub Repository Settings

```
1. GitHub 저장소 페이지 접속
2. Settings 탭 클릭
3. Secrets and variables → Actions 클릭
```

### Step 2: Secrets 추가

**총 7개의 Secret 추가 필요**

각 Secret 추가 방법:
1. "New repository secret" 클릭
2. Name 입력
3. Secret 값 붙여넣기
4. "Add secret" 클릭

**추가할 Secrets:**

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Secret: AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Secret: 12week-health-tracker.firebaseapp.com

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Secret: 12week-health-tracker

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Secret: 12week-health-tracker.appspot.com

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Secret: 123456789012

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Secret: 1:123456789012:web:abcdef123456

Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Secret: G-XXXXXXXXXX
```

### Step 3: Secrets 확인

**모든 Secret이 추가되었는지 확인:**

```
✓ NEXT_PUBLIC_FIREBASE_API_KEY
✓ NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
✓ NEXT_PUBLIC_FIREBASE_PROJECT_ID
✓ NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
✓ NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
✓ NEXT_PUBLIC_FIREBASE_APP_ID
✓ NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID

총 7개
```

---

## 5️⃣ 최종 배포

### Step 1: 코드 푸시

```bash
# 변경사항 커밋
git add .
git commit -m "feat: v3.0 Firebase 연동 완료"

# GitHub에 푸시
git push origin main
```

### Step 2: GitHub Actions 확인

```
1. GitHub Repository → Actions 탭
2. 최신 Workflow 실행 확인
3. 각 단계가 녹색 체크마크(✓)인지 확인:
   - Checkout ✓
   - Setup Node ✓
   - Install dependencies ✓
   - Build with Next.js ✓
   - Deploy to GitHub Pages ✓
```

**예상 소요 시간: 2~3분**

### Step 3: 배포 확인

```
1. 배포 완료 후 URL 접속:
   https://kdkim2000.github.io/12week-health-tracker/

2. 회원가입 테스트
3. 로그인 테스트
4. 데이터 저장 테스트
```

---

## ✅ 최종 체크리스트

### Firebase 설정
- [ ] Firebase 프로젝트 생성 완료
- [ ] 웹 앱 등록 완료
- [ ] Firebase 설정값 복사 완료
- [ ] Authentication 활성화 (이메일/비밀번호)
- [ ] Firestore Database 생성 완료
- [ ] 보안 규칙 설정 완료
- [ ] 승인된 도메인 3개 확인 (localhost, Firebase, GitHub Pages)

### 로컬 개발
- [ ] Firebase 패키지 설치 완료
- [ ] .env.local 파일 생성 및 설정
- [ ] 개발 서버 실행 확인
- [ ] Firebase 초기화 메시지 확인
- [ ] 회원가입 테스트 성공
- [ ] 데이터 저장 테스트 성공
- [ ] 실시간 동기화 테스트 성공

### 배포
- [ ] GitHub Secrets 7개 모두 추가
- [ ] GitHub Actions Workflow 파일 확인
- [ ] 코드 푸시 완료
- [ ] GitHub Actions 빌드 성공
- [ ] 배포된 사이트 접속 확인
- [ ] 배포 환경에서 회원가입 테스트
- [ ] 배포 환경에서 데이터 저장 테스트

---

## 🆘 문제 해결

### 자주 발생하는 에러

#### 1. "Firebase: Error (auth/invalid-api-key)"

**원인:** API 키가 잘못됨

**해결:**
```bash
1. Firebase Console에서 API 키 다시 복사
2. .env.local 파일에 올바르게 붙여넣기
3. 서버 재시작: npm run dev
```

#### 2. "Permission denied" (Firestore)

**원인:** 보안 규칙 미설정

**해결:**
```
Firebase Console → Firestore Database → 규칙
→ 위의 보안 규칙 코드 붙여넣기
→ "게시" 클릭
```

#### 3. "Auth domain not whitelisted"

**원인:** 도메인 미승인

**해결:**
```
Firebase Console → Authentication → Settings
→ 승인된 도메인에 도메인 추가
```

#### 4. GitHub Actions 빌드 실패

**원인:** GitHub Secrets 미설정

**해결:**
```
Repository → Settings → Secrets
→ 7개 Secret 모두 추가했는지 확인
→ Secret 이름 오타 확인
```

---

## 📞 지원

문제가 계속되면:

1. **GitHub Issues 작성**
   ```
   https://github.com/kdkim2000/12week-health-tracker/issues
   ```

2. **포함할 정보:**
   - 에러 메시지 전체
   - 브라우저 콘솔 로그
   - 수행한 단계
   - 환경 (OS, Node 버전 등)

---

**설정 완료! 🎉**

이제 Firebase로 구동되는 v3.0 건강관리 앱을 사용할 수 있습니다!
