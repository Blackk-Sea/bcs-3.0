'use client';

import React from 'react';
import { Subject, FilterMode } from '@/types/library';
import { ProgressBar } from './ProgressBar';
import { toBn } from '@/utils/bengali';
import {
  Edit2,
  Plus,
  Filter,
  CheckCircle,
  ListFilter,
  ChevronsDown,
  ChevronsUp,
  FolderOpen,
} from 'lucide-react';

interface SubjectHeaderProps {
  courseName?: string;
  subject: Subject;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  onEditSubject: (subject: Subject) => void;
  onAddChapterToggle: () => void;
  onToggleExpandAllChapters?: (expand: boolean) => void;
  allExpanded?: boolean;
}

export const SubjectHeader: React.FC<SubjectHeaderProps> = ({
  courseName,
  subject,
  filterMode,
  onFilterChange,
  onEditSubject,
  onAddChapterToggle,
  onToggleExpandAllChapters,
  allExpanded = true,
}) => {
  const chapterCount = subject.chapters.length;

  let totalResources = 0;
  let completedResources = 0;

  subject.chapters.forEach((ch) => {
    totalResources += ch.resources.length;
    completedResources += ch.resources.filter((r) => r.completed).length;
  });

  return (
    <div className="mb-6 rounded-xl bg-gradient-to-b from-card-hover to-panel p-6 border border-border shadow-2xl animate-fadeIn">
      {/* Spotify Playlist Banner Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border">
        <div className="flex items-center gap-5">
          {/* Playlist Icon Box */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-gradient-to-br from-spotify to-emerald-900 flex items-center justify-center text-black font-extrabold shadow-2xl shrink-0">
            <FolderOpen className="w-10 h-10 sm:w-12 sm:h-12" />
          </div>

          <div className="flex flex-col">
            {courseName && (
              <span className="text-xs uppercase font-extrabold tracking-widest text-spotify">
                {courseName}
              </span>
            )}
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-2xl sm:text-4xl font-extrabold text-ink tracking-tight">
                {subject.name}
              </h2>
              <button
                onClick={() => onEditSubject(subject)}
                className="p-1.5 rounded-full text-ink-muted hover:text-ink hover:bg-panel-hover transition-colors"
                title="বিষয় সম্পাদনা করুন"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-ink-muted mt-2 flex items-center gap-2">
              <span>{toBn(chapterCount)}টি চ্যাপ্টার</span>
              <span>•</span>
              <span>{toBn(totalResources)}টি রিসোর্স</span>
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Collapse/Expand All Button */}
          {onToggleExpandAllChapters && (
            <button
              onClick={() => onToggleExpandAllChapters(!allExpanded)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-card-bg hover:bg-card-hover border border-border text-xs font-semibold text-ink transition-all"
              title={allExpanded ? 'সব চ্যাপ্টার মিনিমাইজ করুন' : 'সব চ্যাপ্টার এক্সপ্যান্ড করুন'}
            >
              {allExpanded ? (
                <>
                  <ChevronsUp className="w-4 h-4 text-spotify" /> সব মিনিমাইজ
                </>
              ) : (
                <>
                  <ChevronsDown className="w-4 h-4 text-spotify" /> সব এক্সপ্যান্ড
                </>
              )}
            </button>
          )}

          {/* Spotify Green Big Play-style Add Button */}
          <button
            onClick={onAddChapterToggle}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-spotify text-black text-sm font-extrabold hover:bg-spotify-hover hover:scale-105 transition-all shadow-lg shadow-spotify/20"
          >
            <Plus className="w-5 h-5 stroke-[3]" /> নতুন চ্যাপ্টার
          </button>
        </div>
      </div>

      {/* Toolbar: Progress Seekbar & Filter Tags */}
      <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Progress seekbar */}
        <div className="flex-1 max-w-md">
          <ProgressBar
            completed={completedResources}
            total={totalResources}
            label="এই বিষয়ের প্রস্তুতি"
            size="md"
          />
        </div>

        {/* Spotify Filter Tags */}
        <div className="inline-flex p-1 bg-card-bg border border-border rounded-full text-xs self-start md:self-auto">
          <button
            onClick={() => onFilterChange('all')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterMode === 'all'
                ? 'bg-ink text-bg shadow-md'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" /> সব
          </button>
          <button
            onClick={() => onFilterChange('incomplete')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterMode === 'incomplete'
                ? 'bg-ink text-bg shadow-md'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <Filter className="w-3.5 h-3.5" /> অসম্পূর্ণ
          </button>
          <button
            onClick={() => onFilterChange('completed')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold transition-all ${
              filterMode === 'completed'
                ? 'bg-spotify text-black shadow-md'
                : 'text-ink-muted hover:text-ink'
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> সম্পন্ন
          </button>
        </div>
      </div>
    </div>
  );
};
