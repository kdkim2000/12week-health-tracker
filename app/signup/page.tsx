// 파일 경로: app/signup/page.tsx
// 설명: 회원가입 페이지

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
} from '@mui/material';
import {
  PersonAdd,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';
import Link from 'next/link';
import { signup } from '@/lib/auth';

/**
 * SignupPage 컴포넌트
 * 
 * 기능:
 * - 이메일/비밀번호/비밀번호 확인 입력
 * - 회원가입 처리
 * - 로그인 페이지로 이동
 * - 회원가입 시 자동으로 12주 프로그램 시작
 */
export default function SignupPage() {
  const router = useRouter();

  // === 상태 관리 ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * 회원가입 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 입력값 검증
    if (!email || !password || !confirmPassword) {
      setError('모든 항목을 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    // 회원가입 처리
    const result = signup(email, password, confirmPassword);

    if (result.success) {
      // 회원가입 성공 - 메인 페이지로 이동
      // (회원가입 시 자동 로그인됨)
      router.push('/');
    } else {
      // 회원가입 실패 - 오류 메시지 표시
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          borderRadius: 3,
        }}
      >
        {/* 헤더 */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <PersonAdd sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            회원가입
          </Typography>
          <Typography variant="body2" color="text.secondary">
            12주 건강 여정을 함께 시작해요!
          </Typography>
        </Box>

        {/* 오류 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* 회원가입 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 이메일 입력 */}
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

          {/* 비밀번호 입력 */}
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
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            helperText="6자 이상 입력해주세요"
          />

          {/* 비밀번호 확인 입력 */}
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
                  <IconButton
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* 회원가입 버튼 */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              fontWeight: 'bold',
              mb: 2,
            }}
          >
            {loading ? '가입 중...' : '회원가입'}
          </Button>

          {/* 로그인 링크 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              이미 계정이 있으신가요?{' '}
              <MuiLink
                component={Link}
                href="/login"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                로그인
              </MuiLink>
            </Typography>
          </Box>
        </form>

        {/* 안내 문구 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'info.50', borderRadius: 1, border: '1px solid', borderColor: 'info.200' }}>
          <Typography variant="caption" color="text.secondary">
            ℹ️ <strong>알림:</strong> 회원가입과 동시에 12주 건강관리 프로그램이 시작됩니다.
            오늘이 1일차가 됩니다!
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}