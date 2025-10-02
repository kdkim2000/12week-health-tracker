// scripts/check-env.js
/**
 * 환경 변수 설정 확인 스크립트
 * 
 * 실행 방법:
 * node scripts/check-env.js
 */

const requiredEnvVars = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
  'NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID',
];

console.log('🔍 환경 변수 설정 확인 중...\n');

let allPresent = true;
const missing = [];
const present = [];

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName];
  
  if (!value || value === '' || value.startsWith('your-')) {
    missing.push(varName);
    allPresent = false;
    console.log(`❌ ${varName}: 누락됨`);
  } else {
    present.push(varName);
    // 값의 처음 10자만 표시 (보안)
    const maskedValue = value.substring(0, 10) + '...';
    console.log(`✅ ${varName}: ${maskedValue}`);
  }
});

console.log('\n' + '='.repeat(60));

if (allPresent) {
  console.log('✅ 모든 환경 변수가 설정되었습니다!');
  console.log('\n다음 단계:');
  console.log('1. npm run dev 실행');
  console.log('2. http://localhost:3000 접속');
  console.log('3. Firebase 연동 테스트');
  process.exit(0);
} else {
  console.log('❌ 누락된 환경 변수가 있습니다:');
  missing.forEach((varName) => {
    console.log(`   - ${varName}`);
  });
  
  console.log('\n해결 방법:');
  console.log('1. .env.local 파일이 프로젝트 루트에 있는지 확인');
  console.log('2. ENV_SETUP_GUIDE.md 문서 참조');
  console.log('3. Firebase Console에서 설정값 복사');
  console.log('4. .env.local 파일에 붙여넣기');
  console.log('5. 이 스크립트를 다시 실행');
  
  process.exit(1);
}
