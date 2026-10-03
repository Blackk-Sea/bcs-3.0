'use client';

import React from 'react';
import { toBn } from '@/utils/bengali';
import { Search, Compass, CheckCircle2, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  totalCourses: number;
  totalSubjects: number;
  totalResources: number;
  completedResources: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  totalCourses,
  totalSubjects,
  totalResources,
  completedResources,
  searchQuery,
  onSearchChange,
  searchInputRef,
  theme,
  onToggleTheme,
}) => {
  const overallPercentage =
    totalResources > 0 ? Math.round((completedResources / totalResources) * 100) : 0;

  return (
    <header className="sticky top-0 z-50 bg-bg/95 backdrop-blur-lg border-b border-border/40 py-3 px-4 sm:px-6 transition-colors">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Stats */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-spotify flex items-center justify-center text-black shadow-md shadow-spotify/20">
              <Compass className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-ink tracking-tight flex items-center gap-2">
                রিসোর্স লাইব্রেরি
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-spotify/15 text-spotify font-mono font-bold border border-spotify/30">
                  SPOTIFY PRO
                </span>
              </h1>
              <p className="text-xs text-ink-muted flex items-center gap-2 mt-0.5">
                <span>
                  <strong className="text-ink">{toBn(totalCourses)}</strong> কোর্স
                </span>
                <span>•</span>
                <span>
                  <strong className="text-ink">{toBn(totalSubjects)}</strong> বিষয়
                </span>
                <span>•</span>
                <span>
                  <strong className="text-ink">{toBn(totalResources)}</strong> রিসোর্স
                </span>
              </p>
            </div>
          </div>

          {/* Progress Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-panel border border-border text-xs font-semibold text-spotify">
            <CheckCircle2 className="w-4 h-4" />
            <span>{toBn(overallPercentage)}% সম্পন্ন</span>
          </div>
        </div>

        {/* Right Section: Search Bar & Light/Dark Theme Toggle */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-muted pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="রিসোর্স খুঁজুন… ( / )"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-panel hover:bg-panel-hover focus:bg-panel-hover border border-border focus:border-spotify/50 rounded-full pl-10 pr-4 py-2 text-sm text-ink placeholder-ink-muted outline-none transition-all duration-200"
            />
          </div>

          {/* Light Mode / Dark Mode Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2.5 rounded-full bg-panel hover:bg-panel-hover border border-border text-ink hover:text-spotify transition-all flex items-center justify-center shrink-0 shadow-sm"
            title={theme === 'dark' ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
