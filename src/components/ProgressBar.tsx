'use client';

import React from 'react';
import { toBn } from '@/utils/bengali';

interface ProgressBarProps {
  completed: number;
  total: number;
  showDetails?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  showDetails = true,
  label,
  size = 'md',
}) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2';

  return (
    <div className="w-full flex flex-col gap-1.5 group">
      {showDetails && (
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>{label || 'অগ্রগতি'}</span>
          <span className="font-bold text-white font-mono">
            {toBn(percentage)}% ({toBn(completed)}/{toBn(total)})
          </span>
        </div>
      )}
      {/* Spotify Audio Seekbar Design */}
      <div className={`w-full bg-[#4d4d4d]/40 rounded-full overflow-hidden ${heightClass} relative cursor-pointer`}>
        <div
          className="bg-spotify group-hover:bg-spotify-hover h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
