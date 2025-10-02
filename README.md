# 🏃‍♂️ 12주 건강개선 프로그램 v3.0

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://kdkim2000.github.io/12week-health-tracker/)
[![Next.js](https://img.shields.io/badge/Next.js-15.1.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0.0-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6+-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.7.1-orange)](https://firebase.google.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

> **🎉 v3.0 - Firebase 클라우드 동기화!**  
> 여러 기기에서 실시간으로 동기화되는 건강관리 앱

---

## ⭐ v3.0 새로운 기능

### 🔥 Firebase 백엔드 연동

**이제 가능한 것들:**
- ✅ **클라우드 저장**: 로컬스토리지 → Firebase Firestore
- ✅ **실시간 동기화**: 여러 기기에서 즉시 반영
- ✅ **안전한 인증**: Firebase Authentication
- ✅ **데이터 백업**: 자동 클라우드 백업
- ✅ **다중 기기 지원**: PC, 태블릿, 모바일

### 📱 사용 시나리오

```
시나리오 1: 출근길 지하철
📱 모바일에서 아침 식사 체크

시나리오 2: 점심시간
💻 회사 PC에서 점심 식사 체크

시나리오 3: 퇴근 후 헬스장
📱 모바일에서 운동 기록

시나리오 4: 집 도착 후
💻 집 PC에서 모든 기록 확인
→ 모든 데이터가 실시간 동기화! 🎉
```

---

## 🆚 버전 비교

| 기능 | v1.0 | v2.0 | v3.0 |
|-----|------|------|------|
| **데이터 저장** | 로컬스토리지 | 로컬스토리지 | ☁️ Firebase |
| **체크 항목** | 3개 | 12개 | 12개 |
| **차트** | ❌ | ✅ | ✅ |
| **Phase 시스템** | ❌ | ✅ | ✅ |
| **다중 기기** | ❌ | ❌ | ✅ |
| **실시간 동기화** | ❌ | ❌ | ✅ |
| **클라우드 백업** | ❌ | ❌ | ✅ |
| **보안 인증** | 로컬 | 로컬 | Firebase Auth |

---

## 🚀 빠른 시작

### 1️⃣ 사전 요구사항

```bash
# Node.js 18.17.0 이상 필요
node --version

# npm 9.0.0 이상 필요
npm --version
```

### 2️⃣ Firebase 프로젝트 생성

**자세한 가이드는 `SETUP.md` 참조**

1. [Firebase Console](https://console.firebase.google.com/) 접속
2. "프로젝트 추가" 클릭
3. Authentication 활성화 (이메일/비밀번호)
4. Firestore Database 생성
5. 웹 앱 등록 및 설정 정보 복사

### 3️⃣ 로컬 설정

```bash
# 저장소 클론
git clone https://github.com/kdkim2000/12week-health-tracker.git
cd 12week-health-tracker

# 의존성 설치
npm install

# 환경 변수 파일 생성
cp .env.local.example .env.local

# .env.local 파일 편집 (Firebase 설정 값 입력)
nano .env.local
```

**`.env.local` 파일 내용:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123
```

### 4️⃣ 개발 서버 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 📚 문서

- **[SETUP.md](SETUP.md)** - Firebase 프로젝트 생성 완벽 가이드
- **[TESTING.md](TESTING.md)** - 테스트 체크리스트
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - GitHub Pages 배포 가이드
- **[MIGRATION.md](MIGRATION.md)** - v2.0 → v3.0 마이그레이션

---

## 🏗️ 프로젝트 구조

```
12week-health-tracker-v3/
├── app/
│   ├── page.tsx                 ⚡ 메인 (실시간 동기화)
│   ├── login/page.tsx           🔐 로그인 (Firebase Auth)
│   ├── signup/page.tsx          ✍️ 회원가입 (2단계)
│   └── program/page.tsx         📋 프로그램 가이드
│
├── components/
│   ├── Calendar.tsx             🗓️ 12주 달력
│   ├── DailyCheckForm.tsx       📝 일일 체크 (12개 항목)
│   ├── PhaseIndicator.tsx       🎯 Phase 표시
│   ├── HealthMetrics.tsx        📊 건강 지표 차트
│   ├── WeeklyStats.tsx          📈 주간 통계
│   └── ProgressBar.tsx          ⏳ 진행률
│
├── lib/
│   ├── firebase/
│   │   ├── config.ts            🔧 Firebase 초기화
│   │   ├── auth.ts              🔐 인증 함수
│   │   ├── firestore.ts         💾 데이터베이스 CRUD
│   │   └── index.ts             📦 통합 내보내기
│   ├── dateUtils.ts             📅 날짜 유틸리티
│   └── programData.ts           📋 프로그램 데이터
│
├── .env.local                   🔑 환경 변수 (Git 제외)
├── .env.local.example           📄 환경 변수 템플릿
├── next.config.ts               ⚙️ Next.js 설정
└── package.json                 📦 의존성 관리
```

---

## 🎓 학습 포인트 (v3.0)

### 1️⃣ Firebase 인증 구현

```typescript
// 회원가입
import { signUp } from '@/lib/firebase';

await signUp(email, password, {
  initialWeight: 80,
  targetWeight: 75,
  // ...
});

// 로그인
import { signIn } from '@/lib/firebase';

await signIn(email, password);
```

**배울 수 있는 것:**
- Firebase Authentication API
- 이메일/비밀번호 인증
- 사용자 세션 관리
- 에러 처리

### 2️⃣ Firestore 데이터베이스

```typescript
// 데이터 저장
import { saveDailyCheck } from '@/lib/firebase';

await saveDailyCheck(userId, {
  date: '2025-01-01',
  breakfastCompleted: true,
  // ...
});

// 데이터 조회
import { getAllDailyChecks } from '@/lib/firebase';

const checks = await getAllDailyChecks(userId);
```

**배울 수 있는 것:**
- NoSQL 데이터베이스 구조
- CRUD 작업
- 쿼리 및 필터링
- 보안 규칙

### 3️⃣ 실시간 동기화

```typescript
// 실시간 리스너 등록
import { subscribeToDailyChecks } from '@/lib/firebase';

const unsubscribe = subscribeToDailyChecks(userId, (checks) => {
  setDailyChecks(checks);  // 자동 업데이트!
});

// cleanup
return () => unsubscribe();
```

**배울 수 있는 것:**
- Firestore 실시간 리스너
- React useEffect cleanup
- 메모리 누수 방지
- 최적화 기법

### 4️⃣ 환경 변수 관리

```typescript
// lib/firebase/config.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  // ...
};
```

**배울 수 있는 것:**
- 환경 변수 사용법
- 민감한 정보 보호
- GitHub Secrets 활용
- 프로덕션 배포 설정

---

## 🔒 보안

### Firestore 보안 규칙

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 본인 데이터만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == userId;
    }
    
    match /dailyChecks/{userId}/{document=**} {
      allow read, write: if request.auth != null 
                        && request.auth.uid == userId;
    }
  }
}
```

**보안 특징:**
- ✅ 인증된 사용자만 접근
- ✅ 본인 데이터만 읽기/쓰기
- ✅ 타 사용자 데이터 접근 불가
- ✅ API 키 노출 방지

---

## 📊 성능 최적화

### 1. 실시간 동기화 최적화

```typescript
// 특정 기간만 구독 (불필요한 데이터 제외)
const unsubscribe = subscribeToDailyChecksByRange(
  userId,
  startDate,
  endDate,
  (checks) => setDailyChecks(checks)
);
```

### 2. 메모이제이션

```typescript
// 비용이 큰 계산은 useMemo로
const chartData = useMemo(() => {
  return prepareChartData(dailyChecks);
}, [dailyChecks]);
```

### 3. 조건부 렌더링

```typescript
// 데이터가 있을 때만 차트 렌더링
{chartData.length > 0 && (
  <HealthMetrics data={chartData} />
)}
```

---

## 🧪 테스트

### 로컬 테스트

```bash
# 개발 서버 실행
npm run dev

# 회원가입 테스트
→ http://localhost:3000/signup

# Firebase Console에서 확인
→ Authentication: 사용자 추가 확인
→ Firestore: 데이터 저장 확인
```

### 실시간 동기화 테스트

```bash
# 2개의 브라우저 탭 열기
1. Tab 1: 데이터 입력
2. Tab 2: 자동 업데이트 확인
```

**자세한 테스트 가이드: [TESTING.md](TESTING.md)**

---

## 🚀 배포

### GitHub Pages 자동 배포

```bash
# 1. GitHub Secrets 설정 (7개)
Repository → Settings → Secrets → Actions
→ Firebase 환경 변수 7개 추가

# 2. 코드 푸시
git add .
git commit -m "feat: v3.0 Firebase 연동"
git push origin main

# 3. GitHub Actions 자동 실행
Actions 탭에서 진행 상황 확인

# 4. 배포 완료
https://kdkim2000.github.io/12week-health-tracker/
```

**자세한 배포 가이드: [DEPLOYMENT.md](DEPLOYMENT.md)**

---

## ❓ FAQ

### Q1. 로컬스토리지 데이터를 Firebase로 이전할 수 있나요?

A. 네! `MIGRATION.md` 문서의 마이그레이션 스크립트를 참조하세요.

### Q2. Firebase 무료 플랜으로 충분한가요?

A. 네! 무료 플랜(Spark)으로 충분히 사용 가능합니다:
- Firestore: 하루 50,000 읽기
- Authentication: 무제한
- 스토리지: 1GB

### Q3. 여러 기기에서 동시 사용 가능한가요?

A. 네! 같은 계정으로 PC, 태블릿, 모바일에서 동시 사용 가능하며 실시간으로 동기화됩니다.

### Q4. 데이터 백업은 어떻게 하나요?

A. Firebase가 자동으로 백업합니다. 추가로 Firebase Console에서 수동 내보내기도 가능합니다.

### Q5. 오프라인에서도 사용할 수 있나요?

A. v3.0에서는 온라인 연결이 필요합니다. v3.1에서 오프라인 지원 예정입니다.

---

## 🔮 향후 계획 (v3.1+)

### v3.1 - 오프라인 지원
- [ ] Firestore 오프라인 캐싱
- [ ] 오프라인 모드 UI
- [ ] 온라인 복귀 시 자동 동기화

### v3.2 - AI 코칭
- [ ] OpenAI API 연동
- [ ] 개인 맞춤 조언
- [ ] 자동 식단 생성

### v3.3 - 소셜 기능
- [ ] 친구 추가
- [ ] 그룹 챌린지
- [ ] 리더보드

---

## 🤝 기여

이 프로젝트는 Next.js/React 학습용으로 제작되었습니다.

**버그 제보 및 기능 제안:**
- [Issues](https://github.com/kdkim2000/12week-health-tracker/issues)
- [Discussions](https://github.com/kdkim2000/12week-health-tracker/discussions)

---

## 📄 라이선스

MIT License - 자유롭게 사용하세요!

---

## 🙏 감사합니다

**사용된 기술:**
- [Next.js](https://nextjs.org/) - React 프레임워크
- [Firebase](https://firebase.google.com/) - 백엔드 서비스
- [Material-UI](https://mui.com/) - UI 컴포넌트
- [Recharts](https://recharts.org/) - 차트 라이브러리

**Made with ❤️ and ☁️**  
**v3.0 - Firebase Edition**  
**Last Updated: 2025-01-XX**

---

⭐ **도움이 되셨다면 Star를 눌러주세요!** ⭐
