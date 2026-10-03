'use client';

import React, { useState } from 'react';
import { Course, Subject, Chapter, Resource, ResourceType, FilterMode } from '@/types/library';
import { SubjectHeader } from './SubjectHeader';
import { ChapterItem } from './ChapterItem';
import { sanitizeUrl } from '@/utils/security';
import { toBn } from '@/utils/bengali';
import {
  Youtube,
  HardDrive,
  Send,
  Plus,
  BookPlus,
  XCircle,
  Play,
} from 'lucide-react';

interface ContentAreaProps {
  currentCourse: Course | null;
  selectedSubject: Subject | null;
  courses: Course[];
  searchQuery: string;
  filterMode: FilterMode;
  onFilterChange: (mode: FilterMode) => void;
  onClearSearch: () => void;
  onAddSubjectClick: () => void;
  onAddChapter: (subjectId: string, name: string) => void;
  onToggleCollapseChapter: (chapterId: string) => void;
  onToggleExpandAllChapters: (expand: boolean) => void;
  onEditSubject: (subject: Subject) => void;
  onEditChapter: (chapter: Chapter) => void;
  onDeleteChapter: (chapterId: string) => void;
  onAddResource: (chapterId: string, title: string, url: string, type: ResourceType) => void;
  onToggleComplete: (chapterId: string, resourceId: string) => void;
  onToggleAllChapterComplete: (chapterId: string) => void;
  onEditResource: (resource: Resource, chapterId: string) => void;
  onDeleteResource: (chapterId: string, resourceId: string) => void;
  onDragStart: (
    e: React.DragEvent,
    type: 'course' | 'subject' | 'chapter' | 'resource',
    id: string,
    chapterId?: string
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropChapter: (e: React.DragEvent, targetChapterId: string) => void;
  onDropResource: (e: React.DragEvent, targetResourceId: string, targetChapterId: string) => void;
}

export const ContentArea: React.FC<ContentAreaProps> = ({
  currentCourse,
  selectedSubject,
  courses,
  searchQuery,
  filterMode,
  onFilterChange,
  onClearSearch,
  onAddSubjectClick,
  onAddChapter,
  onToggleCollapseChapter,
  onToggleExpandAllChapters,
  onEditSubject,
  onEditChapter,
  onDeleteChapter,
  onAddResource,
  onToggleComplete,
  onToggleAllChapterComplete,
  onEditResource,
  onDeleteResource,
  onDragStart,
  onDragOver,
  onDropChapter,
  onDropResource,
}) => {
  const [isAddingChapter, setIsAddingChapter] = useState(false);
  const [chapterName, setChapterName] = useState('');

  const trimmedQuery = searchQuery.trim().toLowerCase();

  // Search Results View Across All Courses & Subjects
  if (trimmedQuery) {
    const hits: { course: Course; subject: Subject; chapter: Chapter; resource: Resource }[] = [];
    courses.forEach((c) =>
      c.subjects.forEach((s) =>
        s.chapters.forEach((ch) =>
          ch.resources.forEach((r) => {
            if (
              (r.title + ' ' + ch.name + ' ' + s.name + ' ' + c.name).toLowerCase().includes(trimmedQuery)
            ) {
              hits.push({ course: c, subject: s, chapter: ch, resource: r });
            }
          })
        )
      )
    );

    return (
      <section className="flex-1 min-w-0 animate-fadeIn">
        <div className="mb-6 p-4 bg-panel border border-border rounded-xl flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-xl font-bold text-ink tracking-tight">সার্চ ফলাফল</h2>
            <p className="text-xs text-ink-muted mt-1">
              “{searchQuery}” — <strong className="text-spotify">{toBn(hits.length)}</strong>টি
              রিসোর্স পাওয়া গেছে
            </p>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border text-xs text-ink-muted hover:text-ink transition-all"
          >
            <XCircle className="w-4 h-4 text-spotify" /> সার্চ মুছুন
          </button>
        </div>

        {hits.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {hits.map(({ course, subject, chapter, resource }, index) => {
              const sanitized = sanitizeUrl(resource.url);
              const safeUrl = sanitized.isValid ? sanitized.url : '#unsafe-link';

              return (
                <li
                  key={resource.id}
                  className="flex items-center gap-3.5 p-3.5 bg-panel border border-border rounded-xl hover:bg-card-hover transition-all animate-slideUp"
                  style={{ animationDelay: `${index * 0.04}s` }}
                >
                  <div className="w-8 h-8 rounded-md bg-card-bg flex items-center justify-center shrink-0 border border-border/40">
                    {resource.type === 'yt' && <Youtube className="w-4 h-4 text-yt" />}
                    {resource.type === 'drive' && <HardDrive className="w-4 h-4 text-dr" />}
                    {resource.type === 'tg' && <Send className="w-4 h-4 text-tg" />}
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <a
                      href={safeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-semibold text-ink hover:text-spotify hover:underline truncate transition-colors"
                      onClick={(e) => {
                        if (!sanitized.isValid) {
                          e.preventDefault();
                          alert(sanitized.error || 'অনিরাপদ লিংক!');
                        }
                      }}
                    >
                      {resource.title}
                    </a>
                    <span className="text-xs text-ink-muted truncate">
                      {course.name} › {subject.name} › {chapter.name}
                    </span>
                  </div>

                  <a
                    href={safeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-spotify hover:bg-spotify-hover text-black flex items-center justify-center shadow-md shrink-0 transition-transform hover:scale-105"
                    title="নতুন ট্যাবে খুলুন"
                    onClick={(e) => {
                      if (!sanitized.isValid) {
                        e.preventDefault();
                        alert(sanitized.error || 'অনিরাপদ লিংক!');
                      }
                    }}
                  >
                    <Play className="w-4 h-4 fill-black ml-0.5" />
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-sm text-ink-muted py-8 text-center italic">
            কোনো রিসোর্স মেলেনি।
          </p>
        )}
      </section>
    );
  }

  // Empty State if no subject exists under selected course
  if (!selectedSubject) {
    return (
      <section className="flex-1 min-w-0 text-center py-20 px-4 bg-panel rounded-xl border border-border animate-fadeIn">
        <div className="w-16 h-16 rounded-full bg-card-bg mx-auto mb-6 flex items-center justify-center text-spotify">
          <BookPlus className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-ink mb-2">এই কোর্সে কোনো বিষয় নেই</h3>
        <p className="text-sm text-ink-muted max-w-sm mx-auto mb-6">
          “{currentCourse?.name || 'কোর্স'}” কোর্সে আপনার প্রথম বিষয় যুক্ত করুন।
        </p>
        <button
          onClick={onAddSubjectClick}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-spotify text-black font-extrabold text-sm hover:bg-spotify-hover hover:scale-105 transition-all shadow-xl"
        >
          <Plus className="w-5 h-5 stroke-[3]" /> বিষয় যুক্ত করুন
        </button>
      </section>
    );
  }

  const handleAddChapterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chapterName.trim();
    if (!trimmed) return;
    onAddChapter(selectedSubject.id, trimmed);
    setChapterName('');
    setIsAddingChapter(false);
  };

  const allExpanded = selectedSubject.chapters.every((ch) => !ch.isCollapsed);

  return (
    <section className="flex-1 min-w-0 animate-fadeIn">
      {/* Subject Header Banner */}
      <SubjectHeader
        courseName={currentCourse?.name}
        subject={selectedSubject}
        filterMode={filterMode}
        onFilterChange={onFilterChange}
        onEditSubject={onEditSubject}
        onAddChapterToggle={() => setIsAddingChapter(!isAddingChapter)}
        onToggleExpandAllChapters={onToggleExpandAllChapters}
        allExpanded={allExpanded}
      />

      {/* Inline Add Chapter Form */}
      {isAddingChapter && (
        <form
          onSubmit={handleAddChapterSubmit}
          className="mb-6 p-4 bg-card-bg border border-border rounded-xl animate-slideDown flex flex-wrap gap-3 items-center"
        >
          <input
            type="text"
            placeholder="চ্যাপ্টারের নাম..."
            value={chapterName}
            onChange={(e) => setChapterName(e.target.value)}
            className="flex-1 min-w-[220px] bg-bg border border-border rounded-md px-4 py-2 text-sm text-ink placeholder-ink-muted outline-none transition-all"
            autoFocus
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-spotify text-black text-xs font-bold hover:bg-spotify-hover transition-all"
            >
              সংরক্ষণ
            </button>
            <button
              type="button"
              onClick={() => setIsAddingChapter(false)}
              className="px-4 py-2 rounded-full border border-border text-xs text-ink-muted hover:text-ink transition-colors"
            >
              বাতিল
            </button>
          </div>
        </form>
      )}

      {/* Collapsible Chapters List */}
      {selectedSubject.chapters.length > 0 ? (
        <div>
          {selectedSubject.chapters.map((chapter, index) => (
            <ChapterItem
              key={chapter.id}
              chapter={chapter}
              index={index}
              filterMode={filterMode}
              onToggleCollapseChapter={onToggleCollapseChapter}
              onAddResource={onAddResource}
              onToggleComplete={onToggleComplete}
              onToggleAllChapterComplete={onToggleAllChapterComplete}
              onEditChapter={onEditChapter}
              onDeleteChapter={onDeleteChapter}
              onEditResource={onEditResource}
              onDeleteResource={onDeleteResource}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDropChapter={onDropChapter}
              onDropResource={onDropResource}
            />
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-panel border border-border rounded-xl text-ink-muted text-sm italic">
          এই বিষয়ে কোনো চ্যাপ্টার নেই। "+ নতুন চ্যাপ্টার" বোতামে চাপ দিন।
        </div>
      )}
    </section>
  );
};
