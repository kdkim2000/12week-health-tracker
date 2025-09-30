// 파일 경로: app/login/page.tsx
// 설명: 로그인 페이지

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
import { Email, Lock, Visibility, VisibilityOff, Login as LoginIcon } from '@mui/icons-material';
import Link from 'next/link';
import { login } from '@/lib/auth';

/**
 * LoginPage 컴포넌트
 * 
 * 기능:
 * - 이메일/비밀번호 입력
 * - 로그인 처리
 * - 회원가입 페이지로 이동
 * - 비밀번호 표시/숨김 토글
 * 
 * Next.js의 useRouter를 사용하여 페이지 이동
 */
export default function LoginPage() {
  // === Next.js 라우터 ===
  // useRouter는 Next.js의 페이지 이동을 위한 Hook
  const router = useRouter();

  // === 상태 관리 ===
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /**
   * 로그인 폼 제출 핸들러
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // 폼 기본 동작(페이지 새로고침) 방지
    
    // 입력값 검증
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    // 로그인 처리
    const result = login(email, password);

    if (result.success) {
      // 로그인 성공 - 메인 페이지로 이동
      router.push('/');
    } else {
      // 로그인 실패 - 오류 메시지 표시
      setError(result.message);
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
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
          <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            로그인
          </Typography>
          <Typography variant="body2" color="text.secondary">
            12주 건강관리를 시작하세요
          </Typography>
        </Box>

        {/* 오류 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* 로그인 폼 */}
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          {/* 로그인 버튼 */}
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
            {loading ? '로그인 중...' : '로그인'}
          </Button>

          {/* 회원가입 링크 */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              계정이 없으신가요?{' '}
              <MuiLink
                component={Link}
                href="/signup"
                sx={{
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                회원가입
              </MuiLink>
            </Typography>
          </Box>
        </form>

        {/* 데모 계정 안내 (개발용) */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 <strong>개발 팁:</strong> 실제 서비스에서는 비밀번호를 암호화(해시)하여 저장해야 합니다.
            현재는 학습 목적으로 평문 저장을 사용하고 있습니다.
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}