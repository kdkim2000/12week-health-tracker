// 파일 경로: components/ProgressBar.tsx
// 설명: 12주 프로그램 전체 진행률을 시각화하는 컴포넌트
// 수정: dailyChecks를 받아서 자동으로 완료 일수 계산

'use client'; // Next.js App Router: 클라이언트 컴포넌트 선언

import React from 'react';
import { Box, LinearProgress, Typography, Paper } from '@mui/material';
import { CheckCircle, RadioButtonUnchecked } from '@mui/icons-material';
import type { DailyCheck } from '@/types';

/**
 * ProgressBar 컴포넌트의 props 타입
 */
interface ProgressBarProps {
  currentWeek: number;                           // 현재 주차 (1-12)
  totalWeeks: number;                            // 전체 주차 (12)
  dailyChecks?: Record<string, DailyCheck>;     // 일일 체크 데이터 (선택적)
}

/**
 * ProgressBar 컴포넌트
 * 
 * 기능:
 * - 현재 몇 주차인지 표시
 * - 전체 진행률을 퍼센트로 표시
 * - 시각적 프로그레스 바
 * - dailyChecks에서 자동으로 완료 일수 계산
 * 
 * MUI 컴포넌트 사용:
 * - Paper: 카드 형태의 컨테이너
 * - LinearProgress: 진행률 바
 * - Typography: 텍스트 표시
 */
export default function ProgressBar({
  currentWeek,
  totalWeeks,
  dailyChecks = {},
}: ProgressBarProps) {
  // 전체 일수 계산
  const totalDays = totalWeeks * 7; // 12주 = 84일

  // 완료된 일수 계산 (completed가 true인 날짜 개수)
  const completedDays = Object.values(dailyChecks).filter(
    (check) => check.completed === true
  ).length;

  // 진행률 계산 (0-100)
  const progress = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  // 현재 주차 기준 진행률 (주차 기반)
  const weekProgress = totalWeeks > 0 ? (currentWeek / totalWeeks) * 100 : 0;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        // 그라데이션 배경
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}
    >
      {/* 헤더: 아이콘과 제목 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <CheckCircle sx={{ fontSize: 32, mr: 1.5 }} />
        <Typography variant="h5" fontWeight="bold">
          나의 12주 건강 여정
        </Typography>
      </Box>

      {/* 현재 주차 표시 */}
      <Typography variant="h6" sx={{ mb: 2 }}>
        {currentWeek}주차 / {totalWeeks}주 진행 중
      </Typography>

      {/* 진행률 바 */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 12,
            borderRadius: 6,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              backgroundColor: '#4CAF50', // 초록색
            },
          }}
        />
      </Box>

      {/* 상세 통계 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        {/* 완료 일수 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CheckCircle sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="body2">
            완료: {completedDays}일
          </Typography>
        </Box>

        {/* 남은 일수 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <RadioButtonUnchecked sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="body2">
            남은: {totalDays - completedDays}일
          </Typography>
        </Box>

        {/* 진행률 퍼센트 */}
        <Typography variant="h6" fontWeight="bold">
          {progress.toFixed(1)}%
        </Typography>
      </Box>

      {/* 주차 기반 진행률 (보조 정보) */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
        <Typography variant="body2" sx={{ opacity: 0.9 }}>
          📅 주차 진행률: {weekProgress.toFixed(1)}% ({currentWeek}/{totalWeeks}주)
        </Typography>
      </Box>
    </Paper>
  );
}