// 파일 경로: components/DailyCheckForm.tsx
// 설명: 일일 체크리스트 입력 폼 컴포넌트

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save, FitnessCenter, Restaurant, Scale } from '@mui/icons-material';
import type { DailyCheck } from '@/types';
import { validateWeight } from '@/lib/auth';
import { getDayName } from '@/lib/dateUtils';

/**
 * DailyCheckForm 컴포넌트의 props 타입
 */
interface DailyCheckFormProps {
  date: string;                           // 기록할 날짜 (YYYY-MM-DD)
  initialData: DailyCheck | null;         // 기존 데이터 (수정 모드일 때)
  onSave: (check: DailyCheck) => void;    // 저장 완료 콜백
  onCancel?: () => void;                  // 취소 콜백
}

/**
 * DailyCheckForm 컴포넌트
 * 
 * 기능:
 * - 운동 완료 여부 체크박스
 * - 식단 준수 여부 체크박스
 * - 체중 입력 필드
 * - 저장/취소 버튼
 * - 입력값 유효성 검사
 * 
 * React Hooks 사용:
 * - useState: 폼 상태 관리
 * - useEffect: 초기 데이터 로드
 */
export default function DailyCheckForm({
  date,
  initialData,
  onSave,
  onCancel,
}: DailyCheckFormProps) {
  // === 상태 관리 ===
  // useState는 컴포넌트의 상태를 관리하는 React Hook입니다
  
  // 운동 완료 여부
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  
  // 식단 준수 여부
  const [dietCompleted, setDietCompleted] = useState(false);
  
  // 체중 (문자열로 관리, 입력 중 빈 값 허용)
  const [weight, setWeight] = useState('');
  
  // 오류 메시지
  const [error, setError] = useState('');
  
  // 성공 메시지 표시 여부
  const [showSuccess, setShowSuccess] = useState(false);

  // === 초기 데이터 로드 ===
  // useEffect는 컴포넌트가 렌더링될 때 실행되는 React Hook입니다
  useEffect(() => {
    if (initialData) {
      // 기존 데이터가 있으면 폼에 채우기
      setExerciseCompleted(initialData.exerciseCompleted);
      setDietCompleted(initialData.dietCompleted);
      setWeight(initialData.weight !== null ? String(initialData.weight) : '');
    }
  }, [initialData]); // initialData가 변경될 때마다 실행

  /**
   * 저장 버튼 클릭 핸들러
   * 
   * 동작 순서:
   * 1. 체중 유효성 검사
   * 2. DailyCheck 객체 생성
   * 3. onSave 콜백 호출
   * 4. 성공 메시지 표시
   */
  const handleSave = () => {
    // 1. 체중 입력값 처리
    const weightValue = weight.trim() === '' ? null : parseFloat(weight);
    
    // 2. 체중 유효성 검사
    const validation = validateWeight(weightValue);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    // 3. DailyCheck 객체 생성
    const checkData: DailyCheck = {
      date,
      exerciseCompleted,
      dietCompleted,
      weight: weightValue,
    };

    // 4. 부모 컴포넌트에 데이터 전달
    onSave(checkData);
    
    // 5. 성공 메시지 표시
    setShowSuccess(true);
    setError('');
  };

  /**
   * 체중 입력 핸들러
   * - 숫자와 소수점만 허용
   */
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // 숫자와 소수점만 허용하는 정규표현식
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setWeight(value);
      setError(''); // 오류 메시지 초기화
    }
  };

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        {/* 헤더: 날짜 표시 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            {date} ({getDayName(date)})
          </Typography>
          <Typography variant="body2" color="text.secondary">
            오늘의 건강 기록을 입력해주세요
          </Typography>
        </Box>

        {/* 오류 메시지 */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* 체크박스들 */}
        <Box sx={{ mb: 3 }}>
          {/* 운동 완료 체크박스 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={exerciseCompleted}
                onChange={(e) => setExerciseCompleted(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FitnessCenter sx={{ mr: 1, color: 'primary.main' }} />
                <Typography>운동 완료</Typography>
              </Box>
            }
            sx={{ mb: 2, display: 'flex', width: '100%' }}
          />

          {/* 식단 준수 체크박스 */}
          <FormControlLabel
            control={
              <Checkbox
                checked={dietCompleted}
                onChange={(e) => setDietCompleted(e.target.checked)}
                color="success"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Restaurant sx={{ mr: 1, color: 'success.main' }} />
                <Typography>식단 준수</Typography>
              </Box>
            }
            sx={{ display: 'flex', width: '100%' }}
          />
        </Box>

        {/* 체중 입력 */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="체중 (kg)"
            value={weight}
            onChange={handleWeightChange}
            placeholder="예: 70.5"
            type="text"
            inputMode="decimal"
            InputProps={{
              startAdornment: <Scale sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            helperText="체중을 입력하지 않으려면 비워두세요"
          />
        </Box>

        {/* 버튼들 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Save />}
            onClick={handleSave}
            sx={{
              py: 1.5,
              fontWeight: 'bold',
            }}
          >
            저장하기
          </Button>
          
          {onCancel && (
            <Button
              variant="outlined"
              fullWidth
              onClick={onCancel}
              sx={{ py: 1.5 }}
            >
              취소
            </Button>
          )}
        </Box>

        {/* 안내 문구 */}
        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            💡 <strong>팁:</strong> 모든 항목을 완료하면 달력에 초록색으로 표시됩니다!
          </Typography>
        </Box>
      </Paper>

      {/* 성공 메시지 스낵바 */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          저장되었습니다! 🎉
        </Alert>
      </Snackbar>
    </>
  );
}