// 파일 경로: components/Calendar.tsx
// 설명: 12주(84일) 전체를 시각화하는 달력 컴포넌트

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
import DailyCheckForm from './DailyCheckForm';

/**
 * Calendar 컴포넌트의 props 타입
 */
interface CalendarProps {
  dates: string[];                              // 12주간의 모든 날짜 배열 (84개)
  dailyChecks: { [date: string]: DailyCheck };  // 날짜별 체크리스트 데이터
  onSaveCheck: (check: DailyCheck) => void;     // 체크리스트 저장 콜백
}

/**
 * Calendar 컴포넌트
 * 
 * 기능:
 * - 12주(84일)를 주 단위로 표시
 * - 각 날짜의 달성 상태를 색상으로 표시
 * - 날짜 클릭 시 상세 입력 폼 다이얼로그 표시
 * - 오늘 날짜 강조
 * 
 * 색상 코딩:
 * - 초록색: 모든 항목 완료
 * - 노란색: 일부 항목만 완료
 * - 회색: 미래 날짜 (아직 도달 안 함)
 * - 빨간색/흰색: 과거 날짜이지만 미완료
 */
export default function Calendar({ dates, dailyChecks, onSaveCheck }: CalendarProps) {
  // === 상태 관리 ===
  // 선택된 날짜 (다이얼로그 표시용)
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /**
   * 날짜의 달성 상태 계산
   * @param date - 확인할 날짜
   * @returns 'completed' | 'partial' | 'incomplete' | 'future'
   * 
   * 로직:
   * 1. 미래 날짜 → 'future'
   * 2. 체크리스트 없음 → 'incomplete'
   * 3. 운동, 식단 모두 완료 → 'completed'
   * 4. 하나만 완료 → 'partial'
   * 5. 모두 미완료 → 'incomplete'
   */
  const getDateStatus = (date: string): CalendarDay['status'] => {
    // 미래 날짜
    if (isFuture(date)) {
      return 'future';
    }

    // 체크리스트 데이터 확인
    const check = dailyChecks[date];
    if (!check) {
      return 'incomplete'; // 기록 없음
    }

    // 달성 상태 계산
    const { exerciseCompleted, dietCompleted } = check;
    
    if (exerciseCompleted && dietCompleted) {
      return 'completed'; // 모두 완료
    } else if (exerciseCompleted || dietCompleted) {
      return 'partial'; // 일부 완료
    } else {
      return 'incomplete'; // 미완료
    }
  };

  /**
   * 상태에 따른 배경색 반환
   */
  const getStatusColor = (status: CalendarDay['status']): string => {
    switch (status) {
      case 'completed':
        return '#4CAF50'; // 초록색
      case 'partial':
        return '#FFC107'; // 노란색
      case 'incomplete':
        return '#F44336'; // 빨간색
      case 'future':
        return '#E0E0E0'; // 회색
    }
  };

  /**
   * 상태에 따른 아이콘 반환
   */
  const getStatusIcon = (status: CalendarDay['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle sx={{ fontSize: 16, color: 'white' }} />;
      case 'partial':
        return <RadioButtonUnchecked sx={{ fontSize: 16, color: 'white' }} />;
      case 'incomplete':
        return <Cancel sx={{ fontSize: 16, color: 'white' }} />;
      case 'future':
        return null;
    }
  };

  /**
   * 날짜 클릭 핸들러
   * - 미래 날짜는 클릭 불가
   */
  const handleDateClick = (date: string) => {
    if (!isFuture(date)) {
      setSelectedDate(date);
    }
  };

  /**
   * 다이얼로그 닫기
   */
  const handleCloseDialog = () => {
    setSelectedDate(null);
  };

  /**
   * 체크리스트 저장 핸들러
   */
  const handleSaveCheck = (check: DailyCheck) => {
    onSaveCheck(check);
    // 다이얼로그는 열어둠 (사용자가 직접 닫도록)
  };

  // === 주차별로 날짜 그룹화 ===
  // 84일을 7일씩 나누어 12개의 주 배열 생성
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
            label="완료"
            size="small"
            sx={{ bgcolor: '#4CAF50', color: 'white' }}
          />
          <Chip
            icon={<RadioButtonUnchecked sx={{ fontSize: 16 }} />}
            label="일부 완료"
            size="small"
            sx={{ bgcolor: '#FFC107', color: 'white' }}
          />
          <Chip
            icon={<Cancel sx={{ fontSize: 16 }} />}
            label="미완료"
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
        {weeks.map((week, weekIndex) => (
          <Box key={weekIndex} sx={{ mb: 3 }}>
            {/* 주차 제목 */}
            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>
              {weekIndex + 1}주차
            </Typography>

            {/* 7일 그리드 */}
            <Grid container spacing={1}>
              {week.map((date) => {
                const status = getDateStatus(date);
                const today = isToday(date);

                return (
                  <Grid size="auto" sx={{ width: `${100/8}%` }} key={date}>
                    <Tooltip
                      title={`${date} (${getDayName(date)})`}
                      arrow
                    >
                      <Paper
                        elevation={today ? 4 : 1}
                        sx={{
                          aspectRatio: '1', // 정사각형
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          bgcolor: getStatusColor(status),
                          cursor: isFuture(date) ? 'not-allowed' : 'pointer',
                          transition: 'all 0.2s',
                          border: today ? '3px solid #2196F3' : 'none',
                          '&:hover': {
                            transform: isFuture(date) ? 'none' : 'scale(1.1)',
                            boxShadow: isFuture(date) ? 1 : 6,
                          },
                          position: 'relative',
                        }}
                        onClick={() => handleDateClick(date)}
                      >
                        {/* 날짜 숫자 (일자만 표시) */}
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
        ))}

        {/* 안내 문구 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" color="text.secondary">
            💡 <strong>팁:</strong> 날짜를 클릭하면 그 날의 운동, 식단, 체중을 기록할 수 있습니다.
            파란색 테두리는 오늘을 나타냅니다.
          </Typography>
        </Box>
      </Paper>

      {/* 상세 입력 다이얼로그 */}
      {/* 상세 입력 다이얼로그 */}
      <Dialog
        open={selectedDate !== null}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        // 모바일 최적화: 전체 화면
        fullScreen={false}
        PaperProps={{
          sx: {
            borderRadius: { xs: 0, sm: 2 },
          },
        }}
      >
        {/* ⚠️ 수정된 부분: DialogTitle에서 중첩 Typography 제거 */}
        <DialogTitle 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            fontWeight: 'bold', // Typography 대신 여기서 스타일 적용
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