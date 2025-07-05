
'use client';

import React from 'react';
import { Play, Square, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { TargetState } from '@/lib/bci-simulation';

interface SessionControlsProps {
  isSessionActive: boolean;
  currentState: TargetState;
  onStartSession: () => void;
  onStopSession: () => void;
  onStateChange: (state: TargetState) => void;
  onResetSession: () => void;
  sessionDuration?: number;
  className?: string;
}

const targetStates = [
  { value: TargetState.NEUTRAL, label: 'Neutral', description: 'Baseline state' },
  { value: TargetState.DEEP_MEDITATION, label: 'Deep Meditation', description: 'High Theta, Alpha' },
  { value: TargetState.RELAXATION, label: 'Relaxation', description: 'High Alpha, low Beta' },
  { value: TargetState.FOCUS, label: 'Focus', description: 'High Beta, Gamma' },
  { value: TargetState.FLOW_STATE, label: 'Flow State', description: 'Balanced Beta-Gamma' },
];

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function SessionControls({
  isSessionActive,
  currentState,
  onStartSession,
  onStopSession,
  onStateChange,
  onResetSession,
  sessionDuration = 0,
  className
}: SessionControlsProps) {
  return (
    <div className={cn('bg-gray-900/50 rounded-lg p-6 border border-gray-800', className)}>
      <div className="space-y-6">
        {/* Session Status */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">Session Control</h3>
            <p className="text-sm text-gray-400">
              {isSessionActive ? 'Session Active' : 'Session Inactive'}
            </p>
          </div>
          
          {/* Duration display */}
          <div className="text-right">
            <div className="text-2xl font-mono text-cyan-400">
              {formatDuration(sessionDuration)}
            </div>
            <div className="text-xs text-gray-500">Duration</div>
          </div>
        </div>

        {/* Target State Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-300">Target State</label>
          <Select
            value={currentState}
            onValueChange={(value) => onStateChange(value as TargetState)}
            disabled={isSessionActive}
          >
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700">
              {targetStates.map((state) => (
                <SelectItem 
                  key={state.value} 
                  value={state.value}
                  className="text-white hover:bg-gray-700 focus:bg-gray-700"
                >
                  <div>
                    <div className="font-medium">{state.label}</div>
                    <div className="text-xs text-gray-400">{state.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-3">
          {!isSessionActive ? (
            <Button
              onClick={onStartSession}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Session
            </Button>
          ) : (
            <Button
              onClick={onStopSession}
              className="flex-1 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white"
            >
              <Square className="h-4 w-4 mr-2" />
              Stop Session
            </Button>
          )}
          
          <Button
            onClick={onResetSession}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-800"
            disabled={isSessionActive}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* Session Info */}
        {isSessionActive && (
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-sm text-green-400 font-medium">Recording brain data</span>
            </div>
            <p className="text-xs text-gray-400">
              Target: {targetStates.find(s => s.value === currentState)?.label}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
