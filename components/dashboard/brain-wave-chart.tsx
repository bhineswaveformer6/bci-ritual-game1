
'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface BrainWaveData {
  timestamp: number;
  deltaWave: number;
  thetaWave: number;
  alphaWave: number;
  betaWave: number;
  gammaWave: number;
}

interface BrainWaveChartProps {
  data: BrainWaveData[];
  maxPoints?: number;
  className?: string;
}

export function BrainWaveChart({ 
  data, 
  maxPoints = 50,
  className 
}: BrainWaveChartProps) {
  
  const chartData = useMemo(() => {
    const recentData = data.slice(-maxPoints);
    return recentData.map((point, index) => ({
      time: index,
      Delta: Math.abs(point.deltaWave),
      Theta: Math.abs(point.thetaWave),
      Alpha: Math.abs(point.alphaWave),
      Beta: Math.abs(point.betaWave),
      Gamma: Math.abs(point.gammaWave),
    }));
  }, [data, maxPoints]);

  const waveConfig = [
    { key: 'Delta', color: '#8B5CF6', label: 'Delta (0.5-4Hz)' },
    { key: 'Theta', color: '#06B6D4', label: 'Theta (4-8Hz)' },
    { key: 'Alpha', color: '#10B981', label: 'Alpha (8-13Hz)' },
    { key: 'Beta', color: '#F59E0B', label: 'Beta (13-30Hz)' },
    { key: 'Gamma', color: '#EF4444', label: 'Gamma (30-100Hz)' },
  ];

  return (
    <div className={cn('w-full h-64 bg-gray-900/50 rounded-lg p-4', className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">EEG Frequency Bands</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          {waveConfig.map((wave) => (
            <div key={wave.key} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: wave.color }}
              />
              <span className="text-gray-300">{wave.label}</span>
            </div>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
        >
          <XAxis 
            dataKey="time" 
            hide
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            hide
            axisLine={false}
            tickLine={false}
            domain={[0, 'dataMax']}
          />
          
          {waveConfig.map((wave) => (
            <Line
              key={wave.key}
              type="monotone"
              dataKey={wave.key}
              stroke={wave.color}
              strokeWidth={2}
              dot={false}
              strokeOpacity={0.9}
              style={{
                filter: `drop-shadow(0 0 4px ${wave.color}40)`
              }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
