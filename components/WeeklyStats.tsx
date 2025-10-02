// 파일 경로: components/WeeklyStats.tsx
// 설명: v2.0 주차별 통계 (Phase별 색상, 새로운 지표)

'use client';

import React from 'react';
import { Box, Paper, Typography, Grid, Chip, LinearProgress } from '@mui/material';
import { TrendingUp, Restaurant, LocalDrink, FitnessCenter, Scale } from '@mui/icons-material';
import { PHASE_COLORS } from '@/lib/programData';
import type { WeeklyStats as WeeklyStatsType } from '@/types';

interface WeeklyStatsProps {
  weeklyData: WeeklyStatsType[];
  currentWeek: number;
}

export default function WeeklyStats({ weeklyData, currentWeek }: WeeklyStatsProps) {
  const getColorByRate = (rate: number): 'success' | 'warning' | 'error' => {
    if (rate >= 80) return 'success';
    if (rate >= 50) return 'warning';
    return 'error';
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUp sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          주차별 상세 통계
        </Typography>
      </Box>

      {/* 주차별 카드 */}
      <Grid container spacing={2}>
        {weeklyData.map((week) => {
          const isCurrentWeek = week.weekNumber === currentWeek;
          const phaseColor = PHASE_COLORS[week.phase];

          return (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={week.weekNumber}>
              <Paper
                elevation={isCurrentWeek ? 4 : 1}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: 2,
                  borderColor: isCurrentWeek ? 'primary.main' : phaseColor,
                  bgcolor: isCurrentWeek ? 'primary.50' : 'white',
                  transition: 'all 0.3s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4,
                  },
                }}
              >
                {/* 헤더 */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {week.weekNumber}주차
                  </Typography>
                  <Chip
                    label={`Phase ${week.phase}`}
                    size="small"
                    sx={{ bgcolor: phaseColor, color: 'white', fontWeight: 'bold' }}
                  />
                </Box>

                {/* 달성률 */}
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      전체 달성률
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" color={`${getColorByRate(week.achievementRate)}.main`}>
                      {week.achievementRate.toFixed(0)}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={week.achievementRate}
                    color={getColorByRate(week.achievementRate)}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                {/* 상세 지표 */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {/* 식사 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Restaurant sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption">
                      식사: {week.mealCompletionRate.toFixed(0)}%
                    </Typography>
                  </Box>

                  {/* 물 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocalDrink sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption">
                      물: {week.waterAverageIntake.toFixed(1)}잔/일
                    </Typography>
                  </Box>

                  {/* 운동 */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <FitnessCenter sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="caption">
                      운동: {week.exerciseDays}일 ({week.totalExerciseMinutes}분)
                    </Typography>
                  </Box>

                  {/* 체중 변화 */}
                  {week.weightChange !== undefined && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Scale sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="caption" color="success.main" fontWeight="bold">
                        체중: -{week.weightChange.toFixed(1)}kg
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      {/* 안내 */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          현재 진행 중인 주차는 파란색 테두리로 표시됩니다. Phase별로 색상이 구분됩니다.
        </Typography>
      </Box>
    </Paper>
  );
}