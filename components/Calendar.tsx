// 파일 경로: components/Calendar.tsx
// 설명: v2.0 달력 - Phase별 색상 구분, 완료율 기반 상태

'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Tooltip,
} from '@mui/material';
import { Close, CheckCircle, Cancel, RadioButtonUnchecked } from '@mui/icons-material';
import type { DailyCheck, CalendarDay } from '@/types';
import { getDayName, isToday, isPast, isFuture } from '@/lib/dateUtils';
import { getPhaseFromWeek, PHASE_COLORS } from '@/lib/programData';
import DailyCheckForm from './DailyCheckForm';

interface CalendarProps {
  dates: string[];
  dailyChecks: { [date: string]: DailyCheck };
  onSaveCheck: (check: DailyCheck) => void;
}

/**
 * Calendar v2.0
 * 
 * 변경사항:
 * - Phase별 색상 구분 (Phase 1: 초록, Phase 2: 주황, Phase 3: 파랑)
 * - 완료율 기반 상태 표시 (80% 이상: excellent, 50-79%: good, etc.)
 * - 12개 항목 기반 완료율 계산
 */
export default function Calendar({ dates, dailyChecks, onSaveCheck }: CalendarProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /**
   * 날짜의 완료율 계산 (0-100%)
   */
  const calculateCompletionRate = (date: string): number => {
    const check = dailyChecks[date];
    if (!check) return 0;

    let completed = 0;
    const total = 10; // 필수 항목 10개 (메모 제외)

    // 식사 3개
    if (check.breakfastCompleted) completed++;
    if (check.lunchCompleted) completed++;
    if (check.dinnerCompleted) completed++;

    // 물 섭취 (8잔 이상)
    if (check.waterIntake >= 8) completed++;

    // 운동
    if (check.exerciseCompleted) completed++;

    // 수면
    if (check.sleepHours) completed++;

    // 신체 측정 2개
    if (check.weight) completed++;
    if (check.waistCircumference) completed++;

    // 컨디션 (항상 입력되므로 카운트)
    if (check.condition) completed++;

    // 메모는 선택사항이므로 제외
    if (check.memo) completed++; // 보너스

    return Math.round((completed / total) * 100);
  };

  /**
   * 날짜의 상태 결정
   */
  const getDateStatus = (date: string): CalendarDay['status'] => {
    if (isFuture(date)) return 'future';

    const completionRate = calculateCompletionRate(date);

    if (completionRate >= 80) return 'excellent';  // 80% 이상
    if (completionRate >= 50) return 'good';       // 50-79%
    if (completionRate >= 20) return 'partial';    // 20-49%
    return 'incomplete';                           // 20% 미만
  };

  /**
   * 상태별 색상 (Phase 고려)
   */
  const getStatusColor = (status: CalendarDay['status'], weekNumber: number): string => {
    const phase = getPhaseFromWeek(weekNumber);
    const baseColor = PHASE_COLORS[phase];

    switch (status) {
      case 'excellent':
        return baseColor; // Phase 색상 (진한 색)
      case 'good':
        return `${baseColor}AA`; // 80% 투명도
      case 'partial':
        return '#FFC107'; // 노란색
      case 'incomplete':
        return '#F44336'; // 빨간색
      case 'future':
        return '#E0E0E0'; // 회색
    }
  };

  /**
   * 상태별 아이콘
   */
  const getStatusIcon = (status: CalendarDay['status']) => {
    switch (status) {
      case 'excellent':
        return <CheckCircle sx={{ fontSize: 16, color: 'white' }} />;
      case 'good':
        return <RadioButtonUnchecked sx={{ fontSize: 16, color: 'white' }} />;
      case 'partial':
        return <RadioButtonUnchecked sx={{ fontSize: 16, color: 'white' }} />;
      case 'incomplete':
        return <Cancel sx={{ fontSize: 16, color: 'white' }} />;
      case 'future':
        return null;
    }
  };

  /**
   * 날짜 클릭
   */
  const handleDateClick = (date: string) => {
    if (!isFuture(date)) {
      setSelectedDate(date);
    }
  };

  const handleCloseDialog = () => {
    setSelectedDate(null);
  };

  const handleSaveCheck = (check: DailyCheck) => {
    onSaveCheck(check);
  };

  // 주차별 그룹화
  const weeks: string[][] = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <>
      <Paper elevation={2} sx={{ p: 3 }}>
        {/* 헤더 */}
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          12주 달력
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          날짜를 클릭하면 해당 날의 기록을 입력/수정할 수 있습니다
        </Typography>

        {/* 범례 */}
        <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
          <Chip
            icon={<CheckCircle sx={{ fontSize: 16 }} />}
            label="완벽 (80%+)"
            size="small"
            sx={{ bgcolor: '#4CAF50', color: 'white' }}
          />
          <Chip
            icon={<RadioButtonUnchecked sx={{ fontSize: 16 }} />}
            label="좋음 (50-79%)"
            size="small"
            sx={{ bgcolor: '#4CAF50AA', color: 'white' }}
          />
          <Chip
            icon={<RadioButtonUnchecked sx={{ fontSize: 16 }} />}
            label="일부 (20-49%)"
            size="small"
            sx={{ bgcolor: '#FFC107', color: 'white' }}
          />
          <Chip
            icon={<Cancel sx={{ fontSize: 16 }} />}
            label="미흡 (<20%)"
            size="small"
            sx={{ bgcolor: '#F44336', color: 'white' }}
          />
          <Chip
            label="미래"
            size="small"
            sx={{ bgcolor: '#E0E0E0', color: 'text.secondary' }}
          />
        </Box>

        {/* 주차별 달력 */}
        {weeks.map((week, weekIndex) => {
          const weekNumber = weekIndex + 1;
          const phase = getPhaseFromWeek(weekNumber);

          return (
            <Box key={weekIndex} sx={{ mb: 3 }}>
              {/* 주차 제목 */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="subtitle2" fontWeight="bold">
                  {weekNumber}주차
                </Typography>
                <Chip
                  label={`Phase ${phase}`}
                  size="small"
                  sx={{
                    bgcolor: PHASE_COLORS[phase],
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.7rem',
                  }}
                />
              </Box>

              {/* 7일 그리드 */}
              <Grid container spacing={1}>
                {week.map((date) => {
                  const status = getDateStatus(date);
                  const today = isToday(date);
                  const completionRate = calculateCompletionRate(date);

                  return (
                    <Grid size="auto" sx={{ width: `${100/8}%` }} key={date}>
                      <Tooltip
                        title={
                          <Box>
                            <Typography variant="caption">
                              {date} ({getDayName(date)})
                            </Typography>
                            {!isFuture(date) && (
                              <Typography variant="caption" display="block">
                                완료율: {completionRate}%
                              </Typography>
                            )}
                          </Box>
                        }
                        arrow
                      >
                        <Paper
                          elevation={today ? 4 : 1}
                          sx={{
                            aspectRatio: '1',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: getStatusColor(status, weekNumber),
                            cursor: isFuture(date) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            border: today ? '3px solid #2196F3' : 'none',
                            position: 'relative',
                            '&:hover': {
                              transform: isFuture(date) ? 'none' : 'scale(1.1)',
                              boxShadow: isFuture(date) ? 1 : 6,
                            },
                          }}
                          onClick={() => handleDateClick(date)}
                        >
                          {/* 날짜 숫자 */}
                          <Typography
                            variant="caption"
                            fontWeight="bold"
                            sx={{
                              color: status === 'future' ? 'text.secondary' : 'white',
                              fontSize: { xs: '0.7rem', sm: '0.8rem' },
                            }}
                          >
                            {new Date(date).getDate()}
                          </Typography>

                          {/* 상태 아이콘 */}
                          {getStatusIcon(status)}

                          {/* 완료율 표시 (과거 날짜만) */}
                          {!isFuture(date) && status !== 'future' && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: '0.6rem',
                                color: 'white',
                                mt: 0.5,
                              }}
                            >
                              {completionRate}%
                            </Typography>
                          )}

                          {/* 오늘 표시 */}
                          {today && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 2,
                                right: 2,
                                width: 6,
                                height: 6,
                                borderRadius: '50%',
                                bgcolor: '#2196F3',
                              }}
                            />
                          )}
                        </Paper>
                      </Tooltip>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          );
        })}

        {/* 안내 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>Phase별 색상:</strong> Phase 1(초록), Phase 2(주황), Phase 3(파랑)으로 구분됩니다.
            날짜를 클릭하여 12개 항목을 체크하세요!
          </Typography>
        </Box>
      </Paper>

      {/* 상세 입력 다이얼로그 */}
      <Dialog
        open={selectedDate !== null}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: { xs: 0, sm: 2 } },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontWeight: 'bold',
          }}
        >
          일일 기록 입력
          <IconButton onClick={handleCloseDialog} size="small">
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedDate && (
            <DailyCheckForm
              date={selectedDate}
              initialData={dailyChecks[selectedDate] || null}
              onSave={handleSaveCheck}
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}