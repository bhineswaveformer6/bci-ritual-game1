
'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface EnergeticSignatureGaugeProps {
  value: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function EnergeticSignatureGauge({ 
  value, 
  size = 'lg',
  className 
}: EnergeticSignatureGaugeProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;
  
  // Color gradient based on value
  const getColor = (val: number) => {
    if (val < 25) return 'text-red-400';
    if (val < 50) return 'text-yellow-400';
    if (val < 75) return 'text-cyan-400';
    return 'text-green-400';
  };

  const getGlowColor = (val: number) => {
    if (val < 25) return 'drop-shadow-[0_0_8px_rgba(248,113,113,0.8)]';
    if (val < 50) return 'drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]';
    if (val < 75) return 'drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]';
    return 'drop-shadow-[0_0_8px_rgba(74,222,128,0.8)]';
  };

  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32', 
    lg: 'w-48 h-48'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  return (
    <div className={cn(
      'relative flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {/* Background glow effect */}
      <div className={cn(
        'absolute inset-0 rounded-full blur-xl opacity-20',
        getColor(normalizedValue).replace('text-', 'bg-')
      )} />
      
      {/* SVG Gauge */}
      <svg
        className={cn('transform -rotate-90', sizeClasses[size])}
        viewBox="0 0 100 100"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          className="text-gray-700"
        />
        
        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="currentColor"
          strokeWidth="6"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn(
            'transition-all duration-500 ease-out',
            getColor(normalizedValue),
            getGlowColor(normalizedValue)
          )}
          style={{
            filter: `drop-shadow(0 0 6px currentColor)`
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={cn(
          'font-bold font-mono',
          textSizes[size],
          getColor(normalizedValue)
        )}>
          {Math.round(normalizedValue)}
        </div>
        <div className="text-xs text-gray-400 font-medium tracking-wider">
          ENERGETIC
        </div>
        <div className="text-xs text-gray-500 font-medium tracking-wider">
          SIGNATURE
        </div>
      </div>

      {/* State indicators */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex items-center space-x-1">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                normalizedValue > (i + 1) * 25 
                  ? getColor(normalizedValue).replace('text-', 'bg-') + ' animate-pulse'
                  : 'bg-gray-700'
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
