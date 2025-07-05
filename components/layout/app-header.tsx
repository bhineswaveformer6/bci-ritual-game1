
'use client';

import React from 'react';
import { Monitor, History, FolderOpen, Settings, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  currentPage?: string;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Monitor },
  { id: 'history', label: 'History', icon: History },
  { id: 'library', label: 'Library', icon: FolderOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AppHeader({ currentPage = 'dashboard' }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800/50 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Brain className="h-8 w-8 text-cyan-400" />
              <div className="absolute inset-0 blur-sm">
                <Brain className="h-8 w-8 text-cyan-400/40" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">
                BCI <span className="text-cyan-400">Ritual</span>
              </h1>
              <p className="text-xs text-gray-400">Brain-Computer Interface</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              
              return (
                <button
                  key={item.id}
                  className={cn(
                    "relative flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-gradient-to-r from-cyan-600/20 to-blue-600/20 text-cyan-300 shadow-lg"
                      : "text-gray-300 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-600/10 to-blue-600/10 blur-sm" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Status Indicator */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400 font-medium">SIMULATOR</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
