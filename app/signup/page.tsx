// 파일 경로: app/signup/page.tsx
// 설명: v2.0 회원가입 - 초기 체중/허리둘레/목표 입력 추가

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  Stepper,
  Step,
  StepLabel,
} from '@mui/material';
import {
  PersonAdd,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  FitnessCenter,
  ArrowForward,
  ArrowBack,
} from '@mui/icons-material';
import Link from 'next/link';
import { signup } from '@/lib/auth';
import { getTodayString } from '@/lib/dateUtils';

/**
 * SignupPage v2.0
 * 
 * 2단계 회원가입:
 * Step 1: 이메일/비밀번호
 * Step 2: 초기 체중/허리둘레, 목표 설정
 */
export default function SignupPage() {
  const router = useRouter();

  // 단계 관리 (0: 계정정보, 1: 신체정보)
  const [activeStep, setActiveStep] = useState(0);

  // Step 1: 계정 정보
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: 신체 정보
  const [initialWeight, setInitialWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState('');
  const [initialWaist, setInitialWaist] = useState('');
  const [targetWaist, setTargetWaist] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const steps = ['계정 정보', '신체 정보 & 목표'];

  /**
   * Step 1 다음 버튼
   */
  const handleNextStep = () => {
    // 입력값 검증
    if (!email || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요');
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }

    setError('');
    setActiveStep(1);
  };

  /**
   * Step 2 회원가입 완료
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 신체 정보 검증
    const weight = parseFloat(initialWeight);
    const target = parseFloat(targetWeight);
    const waist = parseFloat(initialWaist);
    const targetW = parseFloat(targetWaist);

    if (!weight || !target || !waist || !targetW) {
      setError('모든 신체 정보를 입력해주세요');
      return;
    }

    if (weight <= 0 || weight > 300) {
      setError('현재 체중을 올바르게 입력해주세요 (1-300kg)');
      return;
    }

    if (target <= 0 || target > 300) {
      setError('목표 체중을 올바르게 입력해주세요 (1-300kg)');
      return;
    }

    if (waist <= 0 || waist > 200) {
      setError('현재 허리둘레를 올바르게 입력해주세요 (1-200cm)');
      return;
    }

    if (targetW <= 0 || targetW > 200) {
      setError('목표 허리둘레를 올바르게 입력해주세요 (1-200cm)');
      return;
    }

    if (target >= weight) {
      setError('목표 체중은 현재 체중보다 작아야 합니다');
      return;
    }

    if (targetW >= waist) {
      setError('목표 허리둘레는 현재 허리둘레보다 작아야 합니다');
      return;
    }

    setLoading(true);
    setError('');

    // 회원가입 처리
    const result = signup(
      email,
      password,
      confirmPassword,
      getTodayString(), // 시작일: 오늘
      weight,
      target,
      waist,
      targetW
    );

    if (result.success) {
      router.push('/');
    } else {
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 3 }}>
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            회원가입
          </Typography>
          <Typography variant="body2" color="text.secondary">
            12주 건강 여정을 시작합니다
          </Typography>
        </Box>

        {/* 진행 단계 표시 */}
        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* 오류 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Step 1: 계정 정보 */}
        {activeStep === 0 && (
          <Box>
            <TextField
              fullWidth
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="비밀번호"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="최소 6자 이상"
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="6자 이상 입력해주세요"
            />

            <TextField
              fullWidth
              label="비밀번호 확인"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="비밀번호를 다시 입력하세요"
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              variant="contained"
              fullWidth
              size="large"
              endIcon={<ArrowForward />}
              onClick={handleNextStep}
              sx={{ py: 1.5, fontWeight: 'bold' }}
            >
              다음 단계
            </Button>
          </Box>
        )}

        {/* Step 2: 신체 정보 */}
        {activeStep === 1 && (
          <form onSubmit={handleSubmit}>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              현재 신체 정보
            </Typography>

            <TextField
              fullWidth
              label="현재 체중 (kg)"
              value={initialWeight}
              onChange={(e) => setInitialWeight(e.target.value)}
              placeholder="예: 83.6"
              type="number"
              inputProps={{ step: '0.1', min: '1', max: '300' }}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FitnessCenter color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="현재 허리둘레 (cm)"
              value={initialWaist}
              onChange={(e) => setInitialWaist(e.target.value)}
              placeholder="예: 87.7"
              type="number"
              inputProps={{ step: '0.1', min: '1', max: '200' }}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ mb: 2 }}>
              12주 후 목표
            </Typography>

            <TextField
              fullWidth
              label="목표 체중 (kg)"
              value={targetWeight}
              onChange={(e) => setTargetWeight(e.target.value)}
              placeholder="예: 78"
              type="number"
              inputProps={{ step: '0.1', min: '1', max: '300' }}
              sx={{ mb: 2 }}
              helperText="현재 체중보다 낮게 설정하세요"
            />

            <TextField
              fullWidth
              label="목표 허리둘레 (cm)"
              value={targetWaist}
              onChange={(e) => setTargetWaist(e.target.value)}
              placeholder="예: 85"
              type="number"
              inputProps={{ step: '0.1', min: '1', max: '200' }}
              sx={{ mb: 3 }}
              helperText="현재 허리둘레보다 낮게 설정하세요"
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                startIcon={<ArrowBack />}
                onClick={() => setActiveStep(0)}
                sx={{ py: 1.5 }}
              >
                이전
              </Button>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ py: 1.5, fontWeight: 'bold' }}
              >
                {loading ? '가입 중...' : '회원가입 완료'}
              </Button>
            </Box>
          </form>
        )}

        {/* 로그인 링크 */}
        <Box sx={{ textAlign: 'center', mt: 3 }}>
          <Typography variant="body2" color="text.secondary">
            이미 계정이 있으신가요?{' '}
            <MuiLink
              component={Link}
              href="/login"
              sx={{
                fontWeight: 'bold',
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              로그인
            </MuiLink>
          </Typography>
        </Box>

        {/* 안내 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.main', borderRadius: 1, color: 'white' }}>
          <Typography variant="caption">
            회원가입과 동시에 12주 프로그램이 시작됩니다. 오늘이 1주차 1일차입니다!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}