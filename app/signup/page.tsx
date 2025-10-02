// app/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
  Alert,
  Stepper,
  Step,
  StepLabel,
  CircularProgress,
} from '@mui/material';
import { signUp, isValidEmail, validatePassword } from '@/lib/firebase';

/**
 * 회원가입 페이지 (v3.0 Firebase 연동)
 * - 2단계 프로세스: 계정 정보 → 신체 정보
 * - Firebase Authentication 사용
 * - Firestore에 사용자 프로필 저장
 */
export default function SignUpPage() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: 계정 정보
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Step 2: 신체 정보
  const [initialWeight, setInitialWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [initialWaist, setInitialWaist] = useState('');
  const [targetWaist, setTargetWaist] = useState('');

  const steps = ['계정 정보', '신체 정보 & 목표'];

  // Step 1 유효성 검사
  const validateStep1 = (): boolean => {
    if (!email || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요');
      return false;
    }

    if (!isValidEmail(email)) {
      setError('유효하지 않은 이메일 형식입니다');
      return false;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      setError(passwordValidation.message);
      return false;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return false;
    }

    return true;
  };

  // Step 2 유효성 검사
  const validateStep2 = (): boolean => {
    if (!initialWeight || !targetWeight || !initialWaist || !targetWaist) {
      setError('모든 항목을 입력해주세요');
      return false;
    }

    const iWeight = parseFloat(initialWeight);
    const tWeight = parseFloat(targetWeight);
    const iWaist = parseFloat(initialWaist);
    const tWaist = parseFloat(targetWaist);

    if (iWeight <= 0 || tWeight <= 0 || iWaist <= 0 || tWaist <= 0) {
      setError('0보다 큰 값을 입력해주세요');
      return false;
    }

    if (iWeight <= tWeight) {
      setError('목표 체중은 현재 체중보다 작아야 합니다');
      return false;
    }

    if (iWaist <= tWaist) {
      setError('목표 허리둘레는 현재 허리둘레보다 작아야 합니다');
      return false;
    }

    return true;
  };

  // 다음 단계로
  const handleNext = () => {
    if (!validateStep1()) return;
    setError('');
    setActiveStep(1);
  };

  // 이전 단계로
  const handleBack = () => {
    setError('');
    setActiveStep(0);
  };

  // 회원가입 제출
  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setLoading(true);
    setError('');

    try {
      // Firebase 회원가입
      await signUp(email, password, {
        initialWeight: parseFloat(initialWeight),
        targetWeight: parseFloat(targetWeight),
        initialWaist: parseFloat(initialWaist),
        targetWaist: parseFloat(targetWaist),
        startDate: new Date().toISOString().split('T')[0],
      });

      // 메인 페이지로 이동
      router.push('/');
    } catch (err: any) {
      setError(err.message || '회원가입에 실패했습니다');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🏃‍♂️ 12주 건강개선 프로그램
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            v3.0 - Firebase 클라우드 동기화
          </Typography>

          {/* 진행 단계 표시 */}
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* Step 1: 계정 정보 */}
          {activeStep === 0 && (
            <Box>
              <TextField
                label="이메일"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                autoComplete="email"
              />
              <TextField
                label="비밀번호"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                helperText="6자 이상 입력해주세요"
                autoComplete="new-password"
              />
              <TextField
                label="비밀번호 확인"
                type="password"
                fullWidth
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                sx={{ mb: 3 }}
                autoComplete="new-password"
              />

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleNext}
                sx={{ mb: 2 }}
              >
                다음 단계
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => router.push('/login')}
              >
                이미 계정이 있으신가요? 로그인
              </Button>
            </Box>
          )}

          {/* Step 2: 신체 정보 */}
          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                📊 현재 상태
              </Typography>
              <TextField
                label="현재 체중 (kg)"
                type="number"
                fullWidth
                required
                value={initialWeight}
                onChange={(e) => setInitialWeight(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ step: '0.1', min: '0' }}
              />
              <TextField
                label="현재 허리둘레 (cm)"
                type="number"
                fullWidth
                required
                value={initialWaist}
                onChange={(e) => setInitialWaist(e.target.value)}
                sx={{ mb: 3 }}
                inputProps={{ step: '0.1', min: '0' }}
              />

              <Typography variant="h6" gutterBottom>
                🎯 12주 후 목표
              </Typography>
              <TextField
                label="목표 체중 (kg)"
                type="number"
                fullWidth
                required
                value={targetWeight}
                onChange={(e) => setTargetWeight(e.target.value)}
                sx={{ mb: 2 }}
                inputProps={{ step: '0.1', min: '0' }}
              />
              <TextField
                label="목표 허리둘레 (cm)"
                type="number"
                fullWidth
                required
                value={targetWaist}
                onChange={(e) => setTargetWaist(e.target.value)}
                sx={{ mb: 3 }}
                inputProps={{ step: '0.1', min: '0' }}
              />

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={handleBack}
                  disabled={loading}
                >
                  이전
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleSubmit}
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} />}
                >
                  {loading ? '가입 중...' : '회원가입 완료'}
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Container>
  );
}
