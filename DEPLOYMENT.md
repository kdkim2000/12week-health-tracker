# 🚀 GitHub Pages 배포 가이드 (v3.0)

## 📋 배포 준비

### 1️⃣ GitHub Secrets 설정

Firebase 환경 변수를 GitHub Secrets에 등록해야 합니다.

**단계:**

1. **GitHub Repository 접속**
   ```
   https://github.com/kdkim2000/12week-health-tracker
   ```

2. **Settings → Secrets and variables → Actions 클릭**

3. **"New repository secret" 버튼 클릭**

4. **다음 Secret들을 하나씩 추가:**

```
Name: NEXT_PUBLIC_FIREBASE_API_KEY
Value: (Firebase Console에서 복사한 apiKey)

Name: NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
Value: (Firebase Console에서 복사한 authDomain)

Name: NEXT_PUBLIC_FIREBASE_PROJECT_ID
Value: (Firebase Console에서 복사한 projectId)

Name: NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
Value: (Firebase Console에서 복사한 storageBucket)

Name: NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
Value: (Firebase Console에서 복사한 messagingSenderId)

Name: NEXT_PUBLIC_FIREBASE_APP_ID
Value: (Firebase Console에서 복사한 appId)

Name: NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
Value: (Firebase Console에서 복사한 measurementId)
```

5. **모든 Secret 추가 완료 확인**

---

### 2️⃣ GitHub Actions Workflow 수정

`.github/workflows/deploy.yml` 파일을 수정하여 환경 변수를 빌드에 포함시킵니다.

---

### 3️⃣ Firebase 설정 (Hosting)

**옵션 1: GitHub Pages 사용 (현재 방식 유지)**
- 별도 설정 불필요
- 위의 GitHub Secrets만 설정하면 됨

**옵션 2: Firebase Hosting 사용 (권장)**

Firebase Hosting을 사용하면 더 빠른 로딩과 자동 SSL을 제공합니다.

```bash
# Firebase CLI 설치
npm install -g firebase-tools

# Firebase 로그인
firebase login

# Firebase 초기화
firebase init hosting

# 설정:
# - Public directory: out
# - Configure as SPA: Yes
# - Automatic builds with GitHub: No (나중에 설정)

# 배포
npm run build
firebase deploy
```

---

## 🔄 배포 프로세스

### 자동 배포 (Push 시)

```bash
# 코드 수정 후
git add .
git commit -m "feat: v3.0 Firebase 연동 완료"
git push origin main
```

GitHub Actions가 자동으로:
1. 의존성 설치
2. Firebase 환경 변수 주입
3. 빌드 실행
4. GitHub Pages에 배포

---

## ⚙️ next.config.ts 수정

v3.0에서는 추가 설정이 필요합니다:

```typescript
// next.config.ts
import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const repoName = '12week-health-tracker';

const nextConfig: NextConfig = {
  output: 'export',
  basePath: isProd ? `/${repoName}` : '',
  assetPrefix: isProd ? `/${repoName}/` : '',
  images: {
    unoptimized: true,
  },
  // 환경 변수 빌드 시 포함
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
  },
};

export default nextConfig;
```

---

## 🌐 Firebase OAuth Redirect 설정

GitHub Pages 도메인을 Firebase 인증 허용 목록에 추가해야 합니다.

**단계:**

1. **Firebase Console → Authentication → Settings 탭**

2. **"승인된 도메인" 섹션 찾기**

3. **"도메인 추가" 클릭**

4. **GitHub Pages 도메인 입력:**
   ```
   kdkim2000.github.io
   ```

5. **"추가" 클릭**

6. **localhost도 확인** (개발용):
   - `localhost`가 이미 목록에 있어야 함

---

## 🔍 배포 확인

### 1. GitHub Actions 확인

```
Repository → Actions 탭
→ 최신 Workflow 실행 확인
→ 모든 단계가 ✅ 녹색인지 확인
```

### 2. 배포된 사이트 접속

```
https://kdkim2000.github.io/12week-health-tracker/
```

### 3. 브라우저 콘솔 확인

```javascript
// F12 → Console
// 에러가 없어야 함

// Firebase 초기화 확인
console.log('Firebase apps:', firebase.apps.length);
```

---

## 🐛 배포 문제 해결

### 문제 1: "Firebase is not defined" (배포 후)

**원인:** GitHub Secrets 미설정 또는 빌드 시 환경 변수 미주입

**해결:**
1. GitHub Secrets 모두 설정했는지 확인
2. next.config.ts의 env 섹션 확인
3. 다시 빌드 & 배포

### 문제 2: "Auth domain not whitelisted"

**원인:** Firebase 승인된 도메인에 GitHub Pages 미추가

**해결:**
1. Firebase Console → Authentication → Settings
2. 승인된 도메인에 `kdkim2000.github.io` 추가

### 문제 3: 페이지가 로드되지 않음

**원인:** basePath 설정 오류

**해결:**
```typescript
// next.config.ts
basePath: isProd ? '/12week-health-tracker' : '',
                    // ⬆️ 정확한 리포지토리 이름
```

---

## ✅ 배포 체크리스트

배포 전 확인:
- [ ] .env.local 파일 작성 (로컬 테스트용)
- [ ] GitHub Secrets 7개 모두 설정
- [ ] Firebase 승인된 도메인에 GitHub Pages 추가
- [ ] next.config.ts 환경 변수 설정 확인
- [ ] 로컬에서 `npm run build` 성공
- [ ] Firestore 보안 규칙 설정 완료

배포 후 확인:
- [ ] GitHub Actions 빌드 성공 (녹색)
- [ ] 배포된 사이트 접속 가능
- [ ] 회원가입 테스트 성공
- [ ] 로그인 테스트 성공
- [ ] 데이터 저장 테스트 성공
- [ ] 브라우저 콘솔 에러 없음

모두 완료되면 v3.0 배포 성공! 🎉
