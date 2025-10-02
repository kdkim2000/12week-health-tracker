// 파일 경로: components/PhaseIndicator.tsx
// 설명: 현재 Phase 표시 컴포넌트

'use client';

import React from 'react';
import { Box, Paper, Typography, Chip, LinearProgress } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { PHASE_INFO, PHASE_COLORS } from '@/lib/programData';
import type { Phase } from '@/types';

interface PhaseIndicatorProps {
  currentWeek: number;
  currentPhase: Phase;
}

/**
 * PhaseIndicator 컴포넌트
 * 
 * 현재 Phase 정보 표시:
 * - Phase 1/2/3 표시
 * - 진행률 바
 * - 집중 영역 표시
 */
export default function PhaseIndicator({ currentWeek, currentPhase }: PhaseIndicatorProps) {
  const phaseInfo = PHASE_INFO[currentPhase];
  
  // Phase별 주차 범위
  const phaseWeekRanges = {
    1: { start: 1, end: 4 },
    2: { start: 5, end: 8 },
    3: { start: 9, end: 12 },
  };
  
  const range = phaseWeekRanges[currentPhase];
  const weekInPhase = currentWeek - range.start + 1;
  const phaseProgress = (weekInPhase / 4) * 100;

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${PHASE_COLORS[currentPhase]} 0%, ${PHASE_COLORS[currentPhase]}CC 100%)`,
        color: 'white',
      }}
    >
      {/* 헤더 */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TrendingUp sx={{ fontSize: 32, mr: 1.5 }} />
          <Typography variant="h5" fontWeight="bold">
            {phaseInfo.title}
          </Typography>
        </Box>
        <Chip
          label={`${weekInPhase}/4주`}
          sx={{ bgcolor: 'white', color: PHASE_COLORS[currentPhase], fontWeight: 'bold' }}
        />
      </Box>

      {/* Phase 진행률 */}
      <Box sx={{ mb: 2 }}>
        <LinearProgress
          variant="determinate"
          value={phaseProgress}
          sx={{
            height: 10,
            borderRadius: 5,
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            '& .MuiLinearProgress-bar': {
              borderRadius: 5,
              backgroundColor: 'white',
            },
          }}
        />
      </Box>

      {/* 설명 */}
      <Typography variant="body1" sx={{ mb: 2 }}>
        {phaseInfo.description}
      </Typography>

      {/* 집중 영역 */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {phaseInfo.focusAreas.map((area) => (
          <Chip
            key={area}
            label={area}
            size="small"
            sx={{ bgcolor: 'rgba(255, 255, 255, 0.2)', color: 'white' }}
          />
        ))}
      </Box>

      {/* 목표 */}
      <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255, 255, 255, 0.3)' }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          <strong>운동 목표:</strong> {phaseInfo.exerciseGoal}
        </Typography>
        <Typography variant="body2">
          <strong>식단 목표:</strong> {phaseInfo.nutritionGoal}
        </Typography>
      </Box>
    </Paper>
  );
}