// app/login/page.tsx
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
  CircularProgress,
  Link as MuiLink,
} from '@mui/material';
import Link from 'next/link';
import { signIn } from '@/lib/firebase';

/**
 * 로그인 페이지 (v3.0 Firebase 연동)
 * - Firebase Authentication 사용
 * - 자동 로그인 상태 유지
 */
export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Firebase 로그인
      await signIn(email, password);
      
      // 메인 페이지로 이동
      router.push('/');
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다');
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>
            🏃‍♂️ 로그인
          </Typography>
          <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 4 }}>
            12주 건강개선 프로그램 v3.0
          </Typography>

          {/* 에러 메시지 */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="이메일"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ mb: 2 }}
              autoComplete="email"
              disabled={loading}
            />
            <TextField
              label="비밀번호"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ mb: 3 }}
              autoComplete="current-password"
              disabled={loading}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
              sx={{ mb: 2 }}
            >
              {loading ? '로그인 중...' : '로그인'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2">
                계정이 없으신가요?{' '}
                <MuiLink component={Link} href="/signup" sx={{ cursor: 'pointer' }}>
                  회원가입
                </MuiLink>
              </Typography>
            </Box>
          </form>

          {/* Firebase 연동 안내 */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
            <Typography variant="body2" color="info.contrastText">
              💡 <strong>v3.0 새로운 기능</strong>
              <br />
              • 클라우드 동기화 (여러 기기에서 접속 가능)
              <br />
              • 실시간 데이터 업데이트
              <br />
              • 안전한 데이터 백업
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
