// 파일 경로: components/HealthMetrics.tsx
// 설명: 체중/허리둘레 추이 차트 (recharts 사용)

'use client';

import React from 'react';
import { Box, Paper, Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { TrendingDown, ShowChart } from '@mui/icons-material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ChartDataPoint, User } from '@/types';

interface HealthMetricsProps {
  user: User;
  chartData: ChartDataPoint[];
}

/**
 * HealthMetrics 컴포넌트
 * 
 * 기능:
 * - 체중 추이 그래프
 * - 허리둘레 추이 그래프
 * - 목표선 표시
 * - 토글로 체중/허리둘레 전환
 */
export default function HealthMetrics({ user, chartData }: HealthMetricsProps) {
  const [metric, setMetric] = React.useState<'weight' | 'waist'>('weight');

  const handleMetricChange = (
    _: React.MouseEvent<HTMLElement>,
    newMetric: 'weight' | 'waist' | null,
  ) => {
    if (newMetric !== null) {
      setMetric(newMetric);
    }
  };

  // 차트 데이터 필터링 (값이 있는 것만)
  const filteredData = chartData.filter((d) =>
    metric === 'weight' ? d.weight !== undefined : d.waist !== undefined
  );

  // 최신 측정값
  const latestData = filteredData[filteredData.length - 1];
  const currentValue = metric === 'weight' ? latestData?.weight : latestData?.waist;
  const targetValue = metric === 'weight' ? user.targetWeight : user.targetWaist;
  const initialValue = metric === 'weight' ? user.initialWeight : user.initialWaist;

  // 변화량 계산
  const change = currentValue ? (initialValue - currentValue).toFixed(1) : '0';
  const remaining = currentValue ? (currentValue - targetValue).toFixed(1) : '0';

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      {/* 헤더 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <ShowChart sx={{ fontSize: 28, mr: 1, color: 'primary.main' }} />
          <Typography variant="h6" fontWeight="bold">
            건강 지표 추이
          </Typography>
        </Box>

        {/* 토글 버튼 */}
        <ToggleButtonGroup
          value={metric}
          exclusive
          onChange={handleMetricChange}
          size="small"
        >
          <ToggleButton value="weight">체중</ToggleButton>
          <ToggleButton value="waist">허리둘레</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* 현재 상태 요약 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            현재 {metric === 'weight' ? '체중' : '허리둘레'}
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="primary.main">
            {currentValue || initialValue}
            {metric === 'weight' ? 'kg' : 'cm'}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'success.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            변화량
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="success.main">
            {change > '0' ? '-' : '+'}{Math.abs(parseFloat(change))}
            {metric === 'weight' ? 'kg' : 'cm'}
          </Typography>
        </Box>

        <Box sx={{ flex: 1, minWidth: 150, p: 2, bgcolor: 'warning.50', borderRadius: 1 }}>
          <Typography variant="caption" color="text.secondary">
            목표까지
          </Typography>
          <Typography variant="h5" fontWeight="bold" color="warning.main">
            {remaining}
            {metric === 'weight' ? 'kg' : 'cm'}
          </Typography>
        </Box>
      </Box>

      {/* 차트 */}
      {filteredData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={[
                metric === 'weight'
                  ? Math.floor(targetValue - 2)
                  : Math.floor(targetValue - 5),
                metric === 'weight'
                  ? Math.ceil(initialValue + 2)
                  : Math.ceil(initialValue + 5),
              ]}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />

            {/* 목표선 */}
            <ReferenceLine
              y={targetValue}
              stroke="#FF9800"
              strokeDasharray="5 5"
              label={{ value: '목표', position: 'right', fill: '#FF9800' }}
            />

            {/* 실제 측정값 */}
            <Line
              type="monotone"
              dataKey={metric === 'weight' ? 'weight' : 'waist'}
              stroke="#2196F3"
              strokeWidth={2}
              dot={{ r: 4 }}
              name={metric === 'weight' ? '체중 (kg)' : '허리둘레 (cm)'}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <Box
          sx={{
            height: 300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.50',
            borderRadius: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            아직 측정 데이터가 없습니다. 체중과 허리둘레를 기록해보세요!
          </Typography>
        </Box>
      )}

      {/* 안내 */}
      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💡 <strong>팁:</strong> 매주 같은 시간(아침 공복)에 측정하면 정확한 추이를 확인할 수 있습니다.
        </Typography>
      </Box>
    </Paper>
  );
}