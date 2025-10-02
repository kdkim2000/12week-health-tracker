// E:\apps\12week-health-tracker\components\DailyCheckForm.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Typography,
  Slider,
  Rating,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DailyCheck } from '@/types';

interface DailyCheckFormProps {
  date: string;
  initialData?: DailyCheck | null;
  onSave: (check: DailyCheck) => void; // 수정: date 파라미터 제거
  onCancel: () => void;
}

/**
 * 일일 체크 입력 폼 (v3.0)
 * - Firebase에 데이터 저장
 * - 실시간 동기화 지원
 */
export default function DailyCheckForm({
  date,
  initialData,
  onSave,
  onCancel,
}: DailyCheckFormProps) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // 식사
  const [breakfastCompleted, setBreakfastCompleted] = useState(false);
  const [breakfastTime, setBreakfastTime] = useState('');
  const [lunchCompleted, setLunchCompleted] = useState(false);
  const [lunchTime, setLunchTime] = useState('');
  const [dinnerCompleted, setDinnerCompleted] = useState(false);
  const [dinnerTime, setDinnerTime] = useState('');

  // 물 섭취
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

  // 컨디션 & 메모
  const [condition, setCondition] = useState<number>(5);
  const [memo, setMemo] = useState('');

  // 기존 데이터 로드
  useEffect(() => {
    if (initialData) {
      setBreakfastCompleted(initialData.breakfastCompleted || false);
      setBreakfastTime(initialData.breakfastTime || '');
      setLunchCompleted(initialData.lunchCompleted || false);
      setLunchTime(initialData.lunchTime || '');
      setDinnerCompleted(initialData.dinnerCompleted || false);
      setDinnerTime(initialData.dinnerTime || '');
      setWaterIntake(initialData.waterIntake || 0);
      setExerciseCompleted(initialData.exerciseCompleted || false);
      setExerciseType(initialData.exerciseType || '');
      setExerciseDuration(initialData.exerciseDuration?.toString() || '');
      setSleepHours(initialData.sleepHours?.toString() || '');
      setWeight(initialData.weight?.toString() || '');
      setWaistCircumference(initialData.waistCircumference?.toString() || '');
      setCondition(initialData.condition || 5);
      setMemo(initialData.memo || '');
    }
  }, [initialData]);

  // handleSave 함수 수정
const handleSave = () => {
  try {
    // 기본 필드
    const checkData: any = {
      date,
      completed: true,
      breakfastCompleted,
      lunchCompleted,
      dinnerCompleted,
      waterIntake,
      exerciseCompleted,
      condition,
    };

    // 조건부 필드 추가 (undefined가 아닐 때만)
    if (breakfastCompleted && breakfastTime) {
      checkData.breakfastTime = breakfastTime;
    }
    if (lunchCompleted && lunchTime) {
      checkData.lunchTime = lunchTime;
    }
    if (dinnerCompleted && dinnerTime) {
      checkData.dinnerTime = dinnerTime;
    }
    if (exerciseCompleted && exerciseType) {
      checkData.exerciseType = exerciseType;
    }
    if (exerciseCompleted && exerciseDuration) {
      checkData.exerciseDuration = parseFloat(exerciseDuration);
    }
    if (sleepHours) {
      checkData.sleepHours = parseFloat(sleepHours);
    }
    if (weight) {
      checkData.weight = parseFloat(weight);
    }
    if (waistCircumference) {
      checkData.waistCircumference = parseFloat(waistCircumference);
    }
    if (memo.trim()) {
      checkData.memo = memo.trim();
    }

    onSave(checkData as DailyCheck);
  } catch (err: any) {
    setError(err.message || '저장에 실패했습니다');
  }
};

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* 식사 관리 */}
      <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
        🍽️ 식사 관리
      </Typography>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={breakfastCompleted}
              onChange={(e) => setBreakfastCompleted(e.target.checked)}
            />
          }
          label="아침 식사"
        />
        {breakfastCompleted && (
          <TextField
            type="time"
            size="small"
            value={breakfastTime}
            onChange={(e) => setBreakfastTime(e.target.value)}
            sx={{ ml: 2 }}
          />
        )}
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={lunchCompleted}
              onChange={(e) => setLunchCompleted(e.target.checked)}
            />
          }
          label="점심 식사"
        />
        {lunchCompleted && (
          <TextField
            type="time"
            size="small"
            value={lunchTime}
            onChange={(e) => setLunchTime(e.target.value)}
            sx={{ ml: 2 }}
          />
        )}
        <br />
        <FormControlLabel
          control={
            <Checkbox
              checked={dinnerCompleted}
              onChange={(e) => setDinnerCompleted(e.target.checked)}
            />
          }
          label="저녁 식사"
        />
        {dinnerCompleted && (
          <TextField
            type="time"
            size="small"
            value={dinnerTime}
            onChange={(e) => setDinnerTime(e.target.value)}
            sx={{ ml: 2 }}
          />
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 물 섭취 */}
      <Typography variant="h6" gutterBottom>
        💧 물 섭취 (0-8잔)
      </Typography>
      <Box sx={{ px: 2, mb: 3 }}>
        <Slider
          value={waterIntake}
          onChange={(_, value) => setWaterIntake(value as number)}
          min={0}
          max={8}
          marks
          step={1}
          valueLabelDisplay="on"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 운동 */}
      <Typography variant="h6" gutterBottom>
        💪 운동
      </Typography>
      <Box sx={{ mb: 3 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={exerciseCompleted}
              onChange={(e) => setExerciseCompleted(e.target.checked)}
            />
          }
          label="오늘 운동 완료"
        />
        {exerciseCompleted && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="운동 종류"
              fullWidth
              value={exerciseType}
              onChange={(e) => setExerciseType(e.target.value)}
              placeholder="예: 조깅, 수영, 헬스 등"
              sx={{ mb: 2 }}
            />
            <TextField
              label="운동 시간 (분)"
              type="number"
              fullWidth
              value={exerciseDuration}
              onChange={(e) => setExerciseDuration(e.target.value)}
              inputProps={{ min: 0 }}
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 수면 */}
      <Typography variant="h6" gutterBottom>
        😴 수면
      </Typography>
      <TextField
        label="수면 시간 (시간)"
        type="number"
        fullWidth
        value={sleepHours}
        onChange={(e) => setSleepHours(e.target.value)}
        inputProps={{ min: 0, max: 24, step: 0.5 }}
        sx={{ mb: 3 }}
      />

      <Divider sx={{ my: 2 }} />

      {/* 신체 측정 */}
      <Typography variant="h6" gutterBottom>
        ⚖️ 신체 측정
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          label="체중 (kg)"
          type="number"
          fullWidth
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          inputProps={{ step: 0.1, min: 0 }}
          sx={{ mb: 2 }}
        />
        <TextField
          label="허리둘레 (cm)"
          type="number"
          fullWidth
          value={waistCircumference}
          onChange={(e) => setWaistCircumference(e.target.value)}
          inputProps={{ step: 0.1, min: 0 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 컨디션 */}
      <Typography variant="h6" gutterBottom>
        😊 오늘의 컨디션
      </Typography>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Rating
          value={condition}
          max={10}
          onChange={(_, value) => setCondition(value || 5)}
          size="large"
        />
        <Typography variant="body1">{condition}/10</Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 메모 */}
      <Typography variant="h6" gutterBottom>
        📝 메모
      </Typography>
      <TextField
        multiline
        rows={3}
        fullWidth
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        placeholder="오늘의 느낌, 특이사항 등을 기록하세요"
      />

      {/* 버튼 영역 */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
        <Button onClick={onCancel} disabled={saving}>
          취소
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
        >
          저장
        </Button>
      </Box>
    </Box>
  );
}