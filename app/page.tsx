// 파일 경로: app/page.tsx
// 설명: 메인 대시보드 페이지 - 12주 프로그램 전체 진행 상황 표시

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { AccountCircle, ExitToApp, FitnessCenter } from '@mui/icons-material';
import { getCurrentUser, getAllDailyChecks, logout, saveDailyCheck } from '@/lib/localStorage';
import { get12WeekDates, getWeekNumber, getWeekDates, getTodayString } from '@/lib/dateUtils';
import type { User, DailyCheck, WeeklyStats as WeeklyStatsType } from '@/types';
import Calendar from '@/components/Calendar';
import ProgressBar from '@/components/ProgressBar';
import WeeklyStats from '@/components/WeeklyStats';

/**
 * HomePage 컴포넌트 (메인 대시보드)
 * 
 * 기능:
 * - 로그인 체크 (로그인하지 않은 경우 로그인 페이지로 리디렉션)
 * - 12주 달력 표시
 * - 전체 진행률 표시
 * - 주차별 통계 표시
 * - 로그아웃 기능
 * 
 * 데이터 흐름:
 * 1. 로컬 스토리지에서 현재 사용자 정보 가져오기
 * 2. 사용자의 시작일로부터 12주 날짜 계산
 * 3. 모든 체크리스트 데이터 가져오기
 * 4. 주차별 통계 계산
 * 5. 컴포넌트에 데이터 전달하여 렌더링
 */
export default function HomePage() {
  const router = useRouter();

  // === 상태 관리 ===
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // === 로그인 체크 ===
  // useEffect는 컴포넌트가 마운트될 때 실행
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      // 로그인하지 않은 경우 로그인 페이지로 리디렉션
      router.push('/login');
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  }, [router]);

  /**
   * 로그아웃 핸들러
   */
  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  /**
   * 메뉴 열기/닫기
   */
  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /**
   * 체크리스트 저장 핸들러
   */
  const handleSaveCheck = (check: DailyCheck) => {
    if (!user) return;
    saveDailyCheck(user.id, check);
    // 상태 업데이트로 화면 재렌더링
    setUser({ ...user }); // 강제 리렌더링 트리거
  };

  // 로딩 중 화면
  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 사용자 정보가 없으면 렌더링하지 않음 (리디렉션 대기)
  if (!user) {
    return null;
  }

  // === 데이터 계산 ===
  // 12주 날짜 배열 생성
  const dates = get12WeekDates(user.startDate);
  
  // 모든 체크리스트 가져오기
  const dailyChecks = getAllDailyChecks(user.id);
  
  // 현재 주차 계산
  const currentWeek = getWeekNumber(user.startDate, getTodayString()) || 1;
  
  // 완료한 일수 계산 (모든 항목을 완료한 날)
  const completedDays = dates.filter((date) => {
    const check = dailyChecks[date];
    return check && check.exerciseCompleted && check.dietCompleted;
  }).length;

  // === 주차별 통계 계산 ===
  const weeklyStats: WeeklyStatsType[] = [];
  for (let week = 1; week <= 12; week++) {
    const weekDates = getWeekDates(user.startDate, week);
    
    let completedCount = 0;
    let partialCount = 0;
    
    weekDates.forEach((date) => {
      const check = dailyChecks[date];
      if (check) {
        if (check.exerciseCompleted && check.dietCompleted) {
          completedCount++;
        } else if (check.exerciseCompleted || check.dietCompleted) {
          partialCount++;
        }
      }
    });
    
    const achievementRate = (completedCount / 7) * 100;
    
    weeklyStats.push({
      weekNumber: week,
      totalDays: 7,
      completedDays: completedCount,
      partialDays: partialCount,
      achievementRate,
    });
  }

  return (
    <>
      {/* 상단 앱바 */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          {/* 로고 및 제목 */}
          <FitnessCenter sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            12주 건강관리
          </Typography>

          {/* 사용자 메뉴 */}
          <Box>
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem disabled>
                <Typography variant="body2">{user.email}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} fontSize="small" />
                로그아웃
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 메인 컨텐츠 */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* 환영 메시지 */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            안녕하세요! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {user.email}님의 건강 여정을 응원합니다
          </Typography>
        </Box>

        {/* 전체 진행률 */}
        <ProgressBar
          currentWeek={currentWeek}
          totalWeeks={12}
          completedDays={completedDays}
          totalDays={84}
        />

        {/* 12주 달력 */}
        <Box sx={{ mb: 4 }}>
          <Calendar
            dates={dates}
            dailyChecks={dailyChecks}
            onSaveCheck={handleSaveCheck}
          />
        </Box>

        {/* 주차별 통계 */}
        <WeeklyStats weeklyData={weeklyStats} />

        {/* 푸터 안내 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            💪 <strong>함께 시작한 날:</strong> {user.startDate}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            🎯 <strong>목표:</strong> 12주간 꾸준한 운동과 건강한 식단 유지하기
          </Typography>
        </Box>
      </Container>
    </>
  );
}