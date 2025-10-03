// 파일 경로: app/program/page.tsx
// 설명: 주차별 운동/식단 프로그램 가이드 (로그인 필수)

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Container,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { ArrowBack, FitnessCenter, Restaurant } from '@mui/icons-material';
import { getCurrentUser } from '@/lib/localStorage';
import { getWeekNumber, getTodayString } from '@/lib/dateUtils';
import { getWeeklyProgram, PHASE_INFO, PHASE_COLORS, getPhaseFromWeek } from '@/lib/programData';
import type { User } from '@/types';

/**
 * ProgramPage
 * 
 * 주차별 프로그램 상세 정보:
 * - 운동 스케줄
 * - 식단 가이드
 * - 주간 목표
 * 
 * 로그인한 사용자만 접근 가능
 * ProtectedRoute에 의해 보호됨
 */
export default function ProgramPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    // ProtectedRoute가 이미 로그인을 검증했으므로
    // 여기서는 사용자 정보만 가져옴
    const loadUserData = () => {
      try {
        const currentUser = getCurrentUser();
        
        if (currentUser) {
          console.log('✅ 프로그램 페이지 - 사용자 정보 로드:', currentUser.email);
          setUser(currentUser);
          
          // 현재 주차 계산
          const currentWeek = getWeekNumber(currentUser.startDate, getTodayString()) || 1;
          console.log('📅 현재 주차:', currentWeek);
          setSelectedWeek(currentWeek);
        } else {
          console.warn('⚠️ 사용자 정보 없음 - ProtectedRoute에서 처리됨');
        }
      } catch (error) {
        console.error('❌ 사용자 정보 로드 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    // 약간의 지연을 주어 ProtectedRoute가 먼저 실행되도록 함
    const timer = setTimeout(loadUserData, 100);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // ProtectedRoute가 리다이렉트를 처리하므로 여기서는 null 반환만
  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const program = getWeeklyProgram(selectedWeek);
  const phase = getPhaseFromWeek(selectedWeek);
  const phaseInfo = PHASE_INFO[phase];

  return (
    <>
      {/* 상단 앱바 */}
      <AppBar position="sticky" elevation={2}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => router.push('/')}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', ml: 2 }}>
            12주 프로그램 가이드
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Phase 정보 */}
        <Paper
          elevation={3}
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 2,
            background: `linear-gradient(135deg, ${PHASE_COLORS[phase]} 0%, ${PHASE_COLORS[phase]}CC 100%)`,
            color: 'white',
          }}
        >
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {phaseInfo.title}
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {phaseInfo.description}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {phaseInfo.focusAreas.map((area) => (
              <Chip
                key={area}
                label={area}
                size="small"
                sx={{ bgcolor: 'rgba(255, 255, 255, 0.3)', color: 'white' }}
              />
            ))}
          </Box>
        </Paper>

        {/* 주차 선택 */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs
            value={selectedWeek - 1}
            onChange={(_, value) => setSelectedWeek(value + 1)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((week) => {
              const weekPhase = getPhaseFromWeek(week);
              return (
                <Tab
                  key={week}
                  label={`${week}주차`}
                  sx={{
                    fontWeight: week === selectedWeek ? 'bold' : 'normal',
                    color: PHASE_COLORS[weekPhase],
                  }}
                />
              );
            })}
          </Tabs>
        </Paper>

        {/* 운동 / 식단 탭 */}
        <Paper elevation={2} sx={{ mb: 3 }}>
          <Tabs value={tabValue} onChange={(_, value) => setTabValue(value)} centered>
            <Tab icon={<FitnessCenter />} label="운동 스케줄" />
            <Tab icon={<Restaurant />} label="식단 가이드" />
          </Tabs>
        </Paper>

        {/* 운동 스케줄 탭 */}
        {tabValue === 0 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {selectedWeek}주차 운동 프로그램
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>요일</strong></TableCell>
                    <TableCell><strong>운동</strong></TableCell>
                    <TableCell><strong>상세 설명</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {program.exerciseSchedule.map((schedule) => (
                    <TableRow key={schedule.day}>
                      <TableCell>{schedule.day}</TableCell>
                      <TableCell>
                        <Typography variant="body2" fontWeight="bold">
                          {schedule.exercise}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {schedule.description}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* 식단 가이드 탭 */}
        {tabValue === 1 && (
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {selectedWeek}주차 식단 가이드
            </Typography>
            {program.nutritionGuide.map((guide) => (
              <Box key={guide.day} sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                  {guide.day}
                </Typography>
                <Box sx={{ ml: 2 }}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>아침:</strong> {guide.meals.breakfast}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>점심:</strong> {guide.meals.lunch}
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>저녁:</strong> {guide.meals.dinner}
                  </Typography>
                  {guide.meals.snacks && guide.meals.snacks.length > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>간식:</strong> {guide.meals.snacks.join(', ')}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Paper>
        )}

        {/* 주간 목표 */}
        <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {selectedWeek}주차 목표
          </Typography>
          <List>
            {program.weeklyGoals.map((goal, index) => (
              <ListItem key={index}>
                <ListItemText
                  primary={goal}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* 안내 */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'warning.50', borderRadius: 1, border: '1px solid', borderColor: 'warning.200' }}>
          <Typography variant="body2" color="text.secondary">
            <strong>주의:</strong> 이 프로그램은 일반적인 가이드입니다. 개인의 건강 상태에 따라 조정이 필요할 수 있으며,
            운동 중 불편함이나 통증이 있다면 즉시 중단하고 의료 전문가와 상담하세요.
          </Typography>
        </Box>
      </Container>
    </>
  );
}