// E:\apps\12week-health-tracker\app\page.tsx

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Paper,
} from '@mui/material';
import Calendar from '@/components/Calendar';
import ProgressBar from '@/components/ProgressBar';
import WeeklyStats from '@/components/WeeklyStats';
import PhaseIndicator from '@/components/PhaseIndicator';
import HealthMetrics from '@/components/HealthMetrics';
import {
  onAuthStateChange,
  logOut,
  getUserProfile,
  subscribeToDailyChecks,
  saveDailyCheck,
} from '@/lib/firebase';
import { User, DailyCheck, ChartDataPoint, Phase } from '@/types';
import { getCurrentWeek, get12WeekDates, formatDate, getWeekDates } from '@/lib/dateUtils';
import { getPhaseFromWeek } from '@/lib/programData';

interface WeeklyStatsData {
  weekNumber: number;
  phase: Phase;
  achievementRate: number;
  mealCompletionRate: number;
  waterAverageIntake: number;
  exerciseDays: number;
  totalExerciseMinutes: number;
  weightChange?: number;
}

export default function HomePage() {
  const router = useRouter();
  
  const [user, setUser] = useState<User | null>(null);
  const [dailyChecks, setDailyChecks] = useState<Record<string, DailyCheck>>({});
  const [loading, setLoading] = useState(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'error'>('synced');

  const chartData = useMemo<ChartDataPoint[]>(() => {
    if (!user) return [];

    const data: ChartDataPoint[] = [];
    
    Object.keys(dailyChecks).forEach((date) => {
      const check = dailyChecks[date];
      if (check && (check.weight !== undefined || check.waist !== undefined)) {
        data.push({
          date,
          weight: check.weight,
          waist: check.waist,
        });
      }
    });

    return data.sort((a, b) => a.date.localeCompare(b.date));
  }, [user, dailyChecks]);

  // weeklyData useMemo 부분도 타입 캐스팅 추가
const weeklyData = useMemo<WeeklyStatsData[]>(() => {
  if (!user) return [];

  const stats: WeeklyStatsData[] = [];

  for (let week = 1; week <= 12; week++) {
    const weekDates = getWeekDates(
      typeof user.startDate === 'string' ? user.startDate : formatDate(user.startDate),
      week
    );
    
    const weekChecks = weekDates
      .map(date => dailyChecks[date])
      .filter(check => check !== undefined);

    const completedCount = weekChecks.filter(check => check.completed).length;
    
    // meals 호환성 처리
    const mealCompletedCount = weekChecks.filter(check => 
      check.meals || 
      check.breakfastCompleted || 
      check.lunchCompleted || 
      check.dinnerCompleted
    ).length;
    
    const mealRate = weekChecks.length > 0 ? (mealCompletedCount / weekChecks.length) * 100 : 0;
    
    // water 호환성 처리
    const waterTotal = weekChecks.reduce((sum, check) => 
      sum + (check.waterIntake || check.water || 0), 0
    );
    const waterAvg = weekChecks.length > 0 ? waterTotal / weekChecks.length : 0;
    
    // exercise 호환성 처리
    const exerciseDaysCount = weekChecks.filter(check => 
      check.exercise || check.exerciseCompleted
    ).length;
    
    const totalMinutes = weekChecks.reduce((sum, check) => {
      if (check.exerciseDuration) {
        return sum + check.exerciseDuration;
      }
      if (check.exercise) {
        const match = check.exercise.match(/(\d+)분/);
        return sum + (match ? parseInt(match[1]) : 0);
      }
      return sum;
    }, 0);

    const weekWeights = weekChecks
      .map(check => check.weight)
      .filter(w => w !== undefined) as number[];
    
    let weightChange: number | undefined;
    if (weekWeights.length >= 2) {
      weightChange = weekWeights[0] - weekWeights[weekWeights.length - 1];
    }

    const achievementRate = weekChecks.length > 0 ? (completedCount / weekChecks.length) * 100 : 0;

    stats.push({
      weekNumber: week,
      phase: getPhaseFromWeek(week) as Phase,  // ⭐ Phase 타입으로 캐스팅
      achievementRate,
      mealCompletionRate: mealRate,
      waterAverageIntake: waterAvg,
      exerciseDays: exerciseDaysCount,
      totalExerciseMinutes: totalMinutes,
      weightChange,
    });
  }

  return stats;
}, [user, dailyChecks]);

  // 인증 상태 및 실시간 동기화 - 로그아웃 시 리스너 정리
  useEffect(() => {
    let unsubscribeChecks: (() => void) | null = null;
    let isSubscribed = true; // 컴포넌트 마운트 상태 추적

    const unsubscribeAuth = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const userProfile = await getUserProfile(firebaseUser.uid);
          
          if (userProfile && isSubscribed) {
            setUser(userProfile);

            // 기존 구독 해제 (중복 방지)
            if (unsubscribeChecks) {
              console.log('🔄 기존 리스너 정리');
              unsubscribeChecks();
              unsubscribeChecks = null;
            }

            setSyncStatus('syncing');
            console.log('✅ Firestore 리스너 시작:', firebaseUser.uid);
            
            unsubscribeChecks = subscribeToDailyChecks(
              firebaseUser.uid,
              (checks) => {
                if (isSubscribed) {
                  setDailyChecks(checks);
                  setSyncStatus('synced');
                }
              }
            );
          } else if (!userProfile) {
            console.error('사용자 프로필을 찾을 수 없습니다');
            router.push('/login');
          }
        } catch (error) {
          console.error('사용자 정보 로딩 실패:', error);
          setSyncStatus('error');
        } finally {
          if (isSubscribed) {
            setLoading(false);
          }
        }
      } else {
        // 로그아웃 시: 리스너 즉시 정리
        console.log('🚪 로그아웃 감지 - 리스너 정리 시작');
        
        if (unsubscribeChecks) {
          unsubscribeChecks();
          unsubscribeChecks = null;
          console.log('✅ Firestore 리스너 정리 완료');
        }
        
        // 상태 초기화
        if (isSubscribed) {
          setUser(null);
          setDailyChecks({});
          setSyncStatus('synced');
          setLoading(false);
        }
        
        // 로그인 페이지로 이동
        router.push('/login');
      }
    });

    // Cleanup 함수: 컴포넌트 언마운트 시
    return () => {
      console.log('🧹 컴포넌트 언마운트 - 모든 리스너 정리');
      isSubscribed = false;
      
      unsubscribeAuth();
      
      if (unsubscribeChecks) {
        unsubscribeChecks();
        unsubscribeChecks = null;
      }
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      console.log('🚪 로그아웃 시작...');
      await logOut();
      // onAuthStateChange가 자동으로 리스너를 정리하고 리다이렉트함
      console.log('✅ 로그아웃 완료');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
  };

  // useCallback으로 메모이제이션 - date 파라미터 제거
  const handleSaveDailyCheck = useCallback(async (check: DailyCheck) => {
    if (!user) return;

    setSyncStatus('syncing');
    try {
      await saveDailyCheck(user.id, check);
    } catch (error) {
      console.error('⌛ 일일 체크 저장 실패:', error);
      setSyncStatus('error');
    }
  }, [user]);

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
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (!user) {
    return null;
  }

  const currentWeek = getCurrentWeek(user.startDate);
  const currentPhase = getPhaseFromWeek(currentWeek);

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            🏃‍♂️ 12주 건강개선 프로그램
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {user.email}
            {user.startDate && (
              <> • 시작일: {typeof user.startDate === 'string' ? user.startDate : formatDate(user.startDate)}</>
            )}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {syncStatus === 'syncing' && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CircularProgress size={16} />
              <Typography variant="body2" color="text.secondary">
                동기화 중...
              </Typography>
            </Box>
          )}
          {syncStatus === 'synced' && (
            <Typography variant="body2" color="success.main">
              ✓ 동기화 완료
            </Typography>
          )}
          {syncStatus === 'error' && (
            <Typography variant="body2" color="error.main">
              ⚠ 동기화 오류
            </Typography>
          )}
          
          <Button variant="outlined" onClick={() => router.push('/program')}>
            프로그램 가이드
          </Button>
          <Button variant="outlined" color="error" onClick={handleLogout}>
            로그아웃
          </Button>
        </Box>
      </Box>

      <Alert severity="info" sx={{ mb: 3 }}>
        <Typography variant="body2">
          <strong>🎉 v3.0 Firebase 클라우드 동기화 적용!</strong>
          <br />
          • 여러 기기에서 동일한 계정으로 접속 가능
          <br />
          • 데이터가 실시간으로 자동 동기화됩니다
          <br />
          • 안전한 클라우드 백업
        </Typography>
      </Alert>

      <PhaseIndicator currentWeek={currentWeek} currentPhase={currentPhase} />
      <ProgressBar 
        currentWeek={currentWeek} 
        totalWeeks={12}
        dailyChecks={dailyChecks}  // ⭐ 추가: dailyChecks 전달
      />

      <HealthMetrics user={user} chartData={chartData} />
      <WeeklyStats weeklyData={weeklyData} currentWeek={currentWeek} />

      {/* Calendar - 올바른 props 전달 */}
      <Calendar
        dates={get12WeekDates(
          typeof user.startDate === 'string' ? user.startDate : formatDate(user.startDate)
        )}
        dailyChecks={dailyChecks}
        onSaveCheck={handleSaveDailyCheck}
      />

      {/* DailyCheckForm 제거 - Calendar 내부 Dialog 사용 */}

      {process.env.NODE_ENV === 'development' && (
        <Paper sx={{ p: 2, mt: 3, bgcolor: 'grey.100' }}>
          <Typography variant="caption" component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
            Debug Info:
            {'\n'}User ID: {user.id}
            {'\n'}Start Date: {typeof user.startDate === 'string' ? user.startDate : formatDate(user.startDate)}
            {'\n'}Current Week: {currentWeek}
            {'\n'}Checks Count: {Object.keys(dailyChecks).length}
            {'\n'}Chart Data Points: {chartData.length}
            {'\n'}Weekly Stats Count: {weeklyData.length}
            {'\n'}Sync Status: {syncStatus}
          </Typography>
        </Paper>
      )}
    </Container>
  );
}