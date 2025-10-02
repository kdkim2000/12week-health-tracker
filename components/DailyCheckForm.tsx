// 파일 경로: components/DailyCheckForm.tsx
// 설명: v2.0 일일 체크리스트 (12개 항목 입력)

'use client';

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  TextField,
  Button,
  Alert,
  Snackbar,
  Divider,
  Slider,
  Chip,
  Grid,
} from '@mui/material';
import {
  Save,
  Restaurant,
  LocalDrink,
  FitnessCenter,
  Bedtime,
  Scale,
  StraightenOutlined,
  SentimentSatisfied,
} from '@mui/icons-material';
import type { DailyCheck } from '@/types';
import { getDayName } from '@/lib/dateUtils';

interface DailyCheckFormProps {
  date: string;
  initialData: DailyCheck | null;
  onSave: (check: DailyCheck) => void;
  onCancel?: () => void;
}

/**
 * DailyCheckForm v2.0
 * 
 * 12개 체크 항목:
 * 1-3. 식사 (아침/점심/저녁) + 시간
 * 4. 물 섭취 (8잔)
 * 5-7. 운동 (완료/종류/시간)
 * 8. 수면 시간
 * 9-10. 체중/허리둘레
 * 11. 컨디션 (1-10)
 * 12. 메모
 */
export default function DailyCheckForm({
  date,
  initialData,
  onSave,
  onCancel,
}: DailyCheckFormProps) {
  // 식사
  const [breakfastCompleted, setBreakfastCompleted] = useState(false);
  const [breakfastTime, setBreakfastTime] = useState('07:00');
  const [lunchCompleted, setLunchCompleted] = useState(false);
  const [lunchTime, setLunchTime] = useState('12:00');
  const [dinnerCompleted, setDinnerCompleted] = useState(false);
  const [dinnerTime, setDinnerTime] = useState('18:00');

  // 물 섭취 (0-8잔)
  const [waterIntake, setWaterIntake] = useState(0);

  // 운동
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [exerciseType, setExerciseType] = useState('');
  const [exerciseDuration, setExerciseDuration] = useState('');

  // 수면
  const [sleepHours, setSleepHours] = useState('');

  // 신체 측정
  const [weight, setWeight] = useState('');
  const [waistCircumference, setWaistCircumference] = useState('');

  // 컨디션 (1-10)
  const [condition, setCondition] = useState(5);

  // 메모
  const [memo, setMemo] = useState('');

  const [error, setError] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // 초기 데이터 로드
  useEffect(() => {
    if (initialData) {
      setBreakfastCompleted(initialData.breakfastCompleted);
      setBreakfastTime(initialData.breakfastTime || '07:00');
      setLunchCompleted(initialData.lunchCompleted);
      setLunchTime(initialData.lunchTime || '12:00');
      setDinnerCompleted(initialData.dinnerCompleted);
      setDinnerTime(initialData.dinnerTime || '18:00');
      setWaterIntake(initialData.waterIntake);
      setExerciseCompleted(initialData.exerciseCompleted);
      setExerciseType(initialData.exerciseType || '');
      setExerciseDuration(initialData.exerciseDuration ? String(initialData.exerciseDuration) : '');
      setSleepHours(initialData.sleepHours ? String(initialData.sleepHours) : '');
      setWeight(initialData.weight ? String(initialData.weight) : '');
      setWaistCircumference(initialData.waistCircumference ? String(initialData.waistCircumference) : '');
      setCondition(initialData.condition || 5);
      setMemo(initialData.memo || '');
    }
  }, [initialData]);

  /**
   * 저장 핸들러
   */
  const handleSave = () => {
    const checkData: DailyCheck = {
      date,
      breakfastCompleted,
      breakfastTime: breakfastCompleted ? breakfastTime : undefined,
      lunchCompleted,
      lunchTime: lunchCompleted ? lunchTime : undefined,
      dinnerCompleted,
      dinnerTime: dinnerCompleted ? dinnerTime : undefined,
      waterIntake,
      exerciseCompleted,
      exerciseType: exerciseCompleted ? exerciseType : undefined,
      exerciseDuration: exerciseCompleted && exerciseDuration ? parseFloat(exerciseDuration) : undefined,
      sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
      weight: weight ? parseFloat(weight) : undefined,
      waistCircumference: waistCircumference ? parseFloat(waistCircumference) : undefined,
      condition,
      memo: memo.trim() || undefined,
    };

    onSave(checkData);
    setShowSuccess(true);
    setError('');
  };

  /**
   * 완료율 계산 (12개 항목 중)
   */
  const calculateCompletionRate = (): number => {
    let completed = 0;
    if (breakfastCompleted) completed++;
    if (lunchCompleted) completed++;
    if (dinnerCompleted) completed++;
    if (waterIntake >= 8) completed++;
    if (exerciseCompleted) completed++;
    if (sleepHours) completed++;
    if (weight) completed++;
    if (waistCircumference) completed++;
    if (condition) completed++;
    if (memo) completed++;
    return Math.round((completed / 10) * 100); // 메모/컨디션은 선택이므로 10개 기준
  };

  const completionRate = calculateCompletionRate();

  return (
    <>
      <Box sx={{ py: 2 }}>
        {/* 헤더 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            {date} ({getDayName(date)})
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              완료율:
            </Typography>
            <Chip
              label={`${completionRate}%`}
              size="small"
              color={completionRate >= 80 ? 'success' : completionRate >= 50 ? 'warning' : 'default'}
            />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* 1. 식사 체크 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Restaurant sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              식사 체크
            </Typography>
          </Box>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={breakfastCompleted}
                    onChange={(e) => setBreakfastCompleted(e.target.checked)}
                  />
                }
                label="아침"
              />
              {breakfastCompleted && (
                <TextField
                  type="time"
                  size="small"
                  value={breakfastTime}
                  onChange={(e) => setBreakfastTime(e.target.value)}
                  sx={{ ml: 4, width: 120 }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={lunchCompleted}
                    onChange={(e) => setLunchCompleted(e.target.checked)}
                  />
                }
                label="점심"
              />
              {lunchCompleted && (
                <TextField
                  type="time"
                  size="small"
                  value={lunchTime}
                  onChange={(e) => setLunchTime(e.target.value)}
                  sx={{ ml: 4, width: 120 }}
                />
              )}
            </Grid>

            <Grid size={{ xs: 12, sm: 4 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={dinnerCompleted}
                    onChange={(e) => setDinnerCompleted(e.target.checked)}
                  />
                }
                label="저녁"
              />
              {dinnerCompleted && (
                <TextField
                  type="time"
                  size="small"
                  value={dinnerTime}
                  onChange={(e) => setDinnerTime(e.target.value)}
                  sx={{ ml: 4, width: 120 }}
                />
              )}
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 2. 물 섭취 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <LocalDrink sx={{ mr: 1, color: 'info.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              물 섭취: {waterIntake}/8잔
            </Typography>
          </Box>
          <Slider
            value={waterIntake}
            onChange={(_, value) => setWaterIntake(value as number)}
            min={0}
            max={8}
            marks
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 3. 운동 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <FitnessCenter sx={{ mr: 1, color: 'success.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              운동
            </Typography>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={exerciseCompleted}
                onChange={(e) => setExerciseCompleted(e.target.checked)}
              />
            }
            label="오늘 운동 완료"
            sx={{ mb: 2 }}
          />

          {exerciseCompleted && (
            <Box sx={{ ml: 4 }}>
              <TextField
                fullWidth
                label="운동 종류"
                value={exerciseType}
                onChange={(e) => setExerciseType(e.target.value)}
                placeholder="예: 유산소 30분, 근력운동"
                size="small"
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="운동 시간 (분)"
                type="number"
                value={exerciseDuration}
                onChange={(e) => setExerciseDuration(e.target.value)}
                placeholder="예: 40"
                size="small"
                inputProps={{ min: 1, max: 300 }}
              />
            </Box>
          )}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 4. 수면 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Bedtime sx={{ mr: 1, color: 'secondary.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              수면
            </Typography>
          </Box>
          <TextField
            fullWidth
            label="수면 시간 (시간)"
            type="number"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            placeholder="예: 7.5"
            size="small"
            inputProps={{ step: 0.5, min: 0, max: 24 }}
            helperText="소수점 입력 가능 (예: 7.5시간)"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 5. 신체 측정 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            신체 측정
          </Typography>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="체중 (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="예: 78.5"
                type="number"
                size="small"
                inputProps={{ step: 0.1, min: 1, max: 300 }}
                InputProps={{
                  startAdornment: <Scale sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="허리둘레 (cm)"
                value={waistCircumference}
                onChange={(e) => setWaistCircumference(e.target.value)}
                placeholder="예: 85.5"
                type="number"
                size="small"
                inputProps={{ step: 0.1, min: 1, max: 200 }}
                InputProps={{
                  startAdornment: <StraightenOutlined sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 6. 컨디션 */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <SentimentSatisfied sx={{ mr: 1, color: 'warning.main' }} />
            <Typography variant="subtitle1" fontWeight="bold">
              오늘의 컨디션: {condition}/10
            </Typography>
          </Box>
          <Slider
            value={condition}
            onChange={(_, value) => setCondition(value as number)}
            min={1}
            max={10}
            marks
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 7. 메모 */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
            오늘의 메모
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            placeholder="오늘 하루 어떠셨나요? 특별한 일이나 느낌을 기록해보세요."
          />
        </Box>

        {/* 버튼 */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            fullWidth
            startIcon={<Save />}
            onClick={handleSave}
            sx={{ py: 1.5, fontWeight: 'bold' }}
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
      </Box>

      {/* 성공 메시지 */}
      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ width: '100%' }}>
          저장되었습니다!
        </Alert>
      </Snackbar>
    </>
  );
}