// 파일 경로: app/page.tsx
// 설명: v2.0 메인 대시보드 - Phase별 프로그레스, 차트, 통계

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  CircularProgress,
  Button,
} from '@mui/material';
import { AccountCircle, ExitToApp, FitnessCenter, MenuBook } from '@mui/icons-material';
import { getCurrentUser, getAllDailyChecks, logout, saveDailyCheck } from '@/lib/localStorage';
import { get12WeekDates, getWeekNumber, getTodayString } from '@/lib/dateUtils';
import { getPhaseFromWeek } from '@/lib/programData';
import type { User, DailyCheck, WeeklyStats as WeeklyStatsType, ChartDataPoint } from '@/types';
import Calendar from '@/components/Calendar';
import PhaseIndicator from '@/components/PhaseIndicator';
import HealthMetrics from '@/components/HealthMetrics';
import WeeklyStats from '@/components/WeeklyStats';

/**
 * HomePage v2.0
 * 
 * 새로운 구조:
 * 1. Phase Indicator (현재 Phase 표시)
 * 2. Health Metrics (체중/허리둘레 차트)
 * 3. Calendar (12주 달력)
 * 4. Weekly Stats (주차별 통계)
 */
export default function HomePage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push('/login');
    } else {
      setUser(currentUser);
      setLoading(false);
    }
  }, [router]);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSaveCheck = (check: DailyCheck) => {
    if (!user) return;
    saveDailyCheck(user.id, check);
    setUser({ ...user });
  };

  // 로딩
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return null;

  // 데이터 계산
  const dates = get12WeekDates(user.startDate);
  const dailyChecks = getAllDailyChecks(user.id);
  const currentWeek = getWeekNumber(user.startDate, getTodayString()) || 1;
  const currentPhase = getPhaseFromWeek(currentWeek);

  // 차트 데이터 생성 (체중/허리둘레가 있는 날짜만)
  const chartData: ChartDataPoint[] = dates
    .filter((date) => {
      const check = dailyChecks[date];
      return check && (check.weight || check.waistCircumference);
    })
    .map((date) => {
      const check = dailyChecks[date];
      const [, month, day] = date.split('-');
      return {
        date: `${parseInt(month)}/${parseInt(day)}`,
        weight: check.weight,
        waist: check.waistCircumference,
        targetWeight: user.targetWeight,
        targetWaist: user.targetWaist,
      };
    });

  // 주차별 통계 계산
  const weeklyStats: WeeklyStatsType[] = [];
  for (let week = 1; week <= 12; week++) {
    const weekStart = (week - 1) * 7;
    const weekDates = dates.slice(weekStart, weekStart + 7);
    const phase = getPhaseFromWeek(week);

    let totalMeals = 0;
    let completedMeals = 0;
    let totalWater = 0;
    let exerciseDays = 0;
    let totalExerciseMinutes = 0;
    let weightMeasurements: number[] = [];
    let waistMeasurements: number[] = [];
    let totalCompletionRate = 0;

    weekDates.forEach((date) => {
      const check = dailyChecks[date];
      if (check) {
        // 식사
        totalMeals += 3;
        if (check.breakfastCompleted) completedMeals++;
        if (check.lunchCompleted) completedMeals++;
        if (check.dinnerCompleted) completedMeals++;

        // 물
        totalWater += check.waterIntake;

        // 운동
        if (check.exerciseCompleted) {
          exerciseDays++;
          if (check.exerciseDuration) {
            totalExerciseMinutes += check.exerciseDuration;
          }
        }

        // 신체 측정
        if (check.weight) weightMeasurements.push(check.weight);
        if (check.waistCircumference) waistMeasurements.push(check.waistCircumference);

        // 완료율 계산
        let itemsCompleted = 0;
        if (check.breakfastCompleted) itemsCompleted++;
        if (check.lunchCompleted) itemsCompleted++;
        if (check.dinnerCompleted) itemsCompleted++;
        if (check.waterIntake >= 8) itemsCompleted++;
        if (check.exerciseCompleted) itemsCompleted++;
        if (check.sleepHours) itemsCompleted++;
        if (check.weight) itemsCompleted++;
        if (check.waistCircumference) itemsCompleted++;
        totalCompletionRate += (itemsCompleted / 8) * 100;
      }
    });

    const daysWithData = weekDates.filter((d) => dailyChecks[d]).length;
    const achievementRate = daysWithData > 0 ? totalCompletionRate / daysWithData : 0;

    weeklyStats.push({
      weekNumber: week,
      phase,
      mealCompletionRate: totalMeals > 0 ? (completedMeals / totalMeals) * 100 : 0,
      waterAverageIntake: daysWithData > 0 ? totalWater / 7 : 0,
      exerciseDays,
      totalExerciseMinutes,
      averageWeight: weightMeasurements.length > 0
        ? weightMeasurements.reduce((a, b) => a + b, 0) / weightMeasurements.length
        : undefined,
      averageWaist: waistMeasurements.length > 0
        ? waistMeasurements.reduce((a, b) => a + b, 0) / waistMeasurements.length
        : undefined,
      weightChange: weightMeasurements.length > 0
        ? user.initialWeight - weightMeasurements[weightMeasurements.length - 1]
        : undefined,
      waistChange: waistMeasurements.length > 0
        ? user.initialWaist - waistMeasurements[waistMeasurements.length - 1]
        : undefined,
      achievementRate,
    });
  }

  return (
    <>
      {/* 상단 앱바 */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <FitnessCenter sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            12주 건강개선 v2.0
          </Typography>

          {/* 프로그램 보기 버튼 */}
          <Button
            color="inherit"
            startIcon={<MenuBook />}
            onClick={() => router.push('/program')}
            sx={{ mr: 2 }}
          >
            프로그램
          </Button>

          {/* 사용자 메뉴 */}
          <Box>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <AccountCircle />
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
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
            안녕하세요, {user.email.split('@')[0]}님!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentWeek}주차를 맞이했습니다. 오늘도 건강한 하루 보내세요!
          </Typography>
        </Box>

        {/* Phase Indicator */}
        <PhaseIndicator currentWeek={currentWeek} currentPhase={currentPhase} />

        {/* Health Metrics (차트) */}
        <HealthMetrics user={user} chartData={chartData} />

        {/* 12주 달력 */}
        <Box sx={{ mb: 4 }}>
          <Calendar dates={dates} dailyChecks={dailyChecks} onSaveCheck={handleSaveCheck} />
        </Box>

        {/* 주차별 통계 */}
        <WeeklyStats weeklyData={weeklyStats} currentWeek={currentWeek} />

        {/* 푸터 */}
        <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            시작일: {user.startDate} | 목표: 체중 {user.targetWeight}kg, 허리둘레 {user.targetWaist}cm
          </Typography>
        </Box>
      </Container>
    </>
  );
}