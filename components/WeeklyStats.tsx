// 파일 경로: components/WeeklyStats.tsx
// 설명: 주차별 달성률 통계를 표시하는 컴포넌트

'use client';

import React from 'react';
import { Box, Paper, Typography, Grid, Chip } from '@mui/material';
import { TrendingUp, CheckCircle, Cancel } from '@mui/icons-material';
import type { WeeklyStats as WeeklyStatsType } from '@/types';

/**
 * WeeklyStats 컴포넌트의 props 타입
 */
interface WeeklyStatsProps {
  weeklyData: WeeklyStatsType[]; // 12주간의 통계 데이터 배열
}

/**
 * WeeklyStats 컴포넌트
 * 
 * 기능:
 * - 각 주차별 달성률 표시
 * - 완료/미완료 일수 표시
 * - 색상으로 달성도 시각화
 * 
 * 사용하는 MUI 컴포넌트:
 * - Grid: 반응형 레이아웃 (모바일에서는 1열, 태블릿 이상에서는 다열)
 * - Chip: 작은 정보 표시용 칩
 * - Paper: 카드 형태 컨테이너
 */
export default function WeeklyStats({ weeklyData }: WeeklyStatsProps) {
  /**
   * 달성률에 따른 색상 반환
   * - 80% 이상: 초록색 (성공)
   * - 50% 이상: 노란색 (양호)
   * - 50% 미만: 빨간색 (주의)
   */
  const getColorByRate = (rate: number): 'success' | 'warning' | 'error' => {
    if (rate >= 80) return 'success';
    if (rate >= 50) return 'warning';
    return 'error';
  };

  /**
   * 달성률에 따른 아이콘 반환
   */
  const getIconByRate = (rate: number) => {
    if (rate >= 80) return <CheckCircle sx={{ fontSize: 20 }} />;
    return <Cancel sx={{ fontSize: 20 }} />;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <TrendingUp sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
        <Typography variant="h6" fontWeight="bold">
          주차별 달성 현황
        </Typography>
      </Box>

      {/* 주차별 카드 그리드 */}
      <Grid container spacing={2}>
        {weeklyData.map((week) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={week.weekNumber}>
            <Paper
              elevation={1}
              sx={{
                p: 2,
                borderRadius: 2,
                border: 2,
                borderColor: `${getColorByRate(week.achievementRate)}.main`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              {/* 주차 번호 */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {week.weekNumber}주차
                </Typography>
                {getIconByRate(week.achievementRate)}
              </Box>

              {/* 달성률 */}
              <Typography
                variant="h5"
                fontWeight="bold"
                color={`${getColorByRate(week.achievementRate)}.main`}
                sx={{ mb: 1.5 }}
              >
                {week.achievementRate.toFixed(0)}%
              </Typography>

              {/* 상세 정보 */}
              <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                {/* 완료 일수 */}
                <Chip
                  label={`완료 ${week.completedDays}일`}
                  size="small"
                  color="success"
                  variant="outlined"
                />
                {/* 일부 완료 */}
                {week.partialDays > 0 && (
                  <Chip
                    label={`일부 ${week.partialDays}일`}
                    size="small"
                    color="warning"
                    variant="outlined"
                  />
                )}
                {/* 미완료 일수 */}
                {week.totalDays - week.completedDays - week.partialDays > 0 && (
                  <Chip
                    label={`미완료 ${week.totalDays - week.completedDays - week.partialDays}일`}
                    size="small"
                    color="error"
                    variant="outlined"
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* 설명 */}
      <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="body2" color="text.secondary">
          💡 <strong>팁:</strong> 각 주차를 클릭하면 해당 주의 상세 기록을 볼 수 있습니다.
          80% 이상 달성하면 초록색으로 표시됩니다!
        </Typography>
      </Box>
    </Paper>
  );
}