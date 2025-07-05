
'use client';

import React from 'react';
import { Brain, Focus, Heart, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BrainMetrics } from '@/lib/bci-simulation';

interface MetricsPanelProps {
  metrics: BrainMetrics;
  className?: string;
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<any>;
  color: string;
  description: string;
}

function MetricCard({ title, value, icon: Icon, color, description }: MetricCardProps) {
  const normalizedValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Icon className={cn('h-5 w-5', color)} />
          <h4 className="text-sm font-medium text-gray-300">{title}</h4>
        </div>
        <span className={cn('text-lg font-bold font-mono', color)}>
          {Math.round(normalizedValue)}
        </span>
      </div>
      
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
        <div 
          className={cn('h-full transition-all duration-500 ease-out', color.replace('text-', 'bg-'))}
          style={{ width: `${normalizedValue}%` }}
        />
        <div 
          className={cn('absolute inset-0 rounded-full blur-sm opacity-40', color.replace('text-', 'bg-'))}
          style={{ width: `${normalizedValue}%` }}
        />
      </div>
      
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
}

export function MetricsPanel({ metrics, className }: MetricsPanelProps) {
  const metricCards = [
    {
      title: 'Focus Score',
      value: metrics.focusScore,
      icon: Focus,
      color: 'text-cyan-400',
      description: 'Beta/Gamma activity level'
    },
    {
      title: 'Calm Score', 
      value: metrics.calmScore,
      icon: Heart,
      color: 'text-green-400',
      description: 'Alpha dominance indicator'
    },
    {
      title: 'Meditation Depth',
      value: metrics.meditationDepth,
      icon: Brain,
      color: 'text-purple-400',
      description: 'Theta wave presence'
    },
    {
      title: 'Coherence',
      value: metrics.coherence * 100,
      icon: Zap,
      color: 'text-yellow-400',
      description: 'Brain synchronization'
    }
  ];

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="text-lg font-semibold text-white mb-4">Brain Metrics</h3>
      
      <div className="grid grid-cols-1 gap-4">
        {metricCards.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
      
      {/* Ratios section */}
      <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800 mt-6">
        <h4 className="text-sm font-medium text-gray-300 mb-3">Key Ratios</h4>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">Alpha/Theta</span>
            <span className="text-sm font-mono text-cyan-400">
              {metrics.alphaTheta?.toFixed(2) ?? '0.00'}
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">(Beta+Gamma)/Alpha</span>
            <span className="text-sm font-mono text-magenta-400">
              {metrics.betaGammaAlpha?.toFixed(2) ?? '0.00'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
