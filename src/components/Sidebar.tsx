'use client';

import React, { useState } from 'react';
import { Course, Subject } from '@/types/library';
import { toBn } from '@/utils/bengali';
import {
  Plus,
  Trash2,
  Edit2,
  GripVertical,
  Library,
  BookOpen,
  GraduationCap,
  ChevronDown,
} from 'lucide-react';

interface SidebarProps {
  courses: Course[];
  selectedCourseId: string | null;
  selectedSubjectId: string | null;
  onSelectCourse: (id: string) => void;
  onSelectSubject: (id: string) => void;
  onAddCourse: (name: string) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (id: string, name: string) => void;
  onAddSubject: (name: string) => void;
  onEditSubject: (subject: Subject) => void;
  onDeleteSubject: (id: string, name: string) => void;
  onDragStart: (
    e: React.DragEvent,
    type: 'course' | 'subject',
    id: string
  ) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDropCourse: (e: React.DragEvent, targetCourseId: string) => void;
  onDropSubject: (e: React.DragEvent, targetSubjectId: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  courses,
  selectedCourseId,
  selectedSubjectId,
  onSelectCourse,
  onSelectSubject,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
  onAddSubject,
  onEditSubject,
  onDeleteSubject,
  onDragStart,
  onDragOver,
  onDropCourse,
  onDropSubject,
}) => {
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  const [courseName, setCourseName] = useState('');

  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0] || null;

  const currentSubjects = currentCourse ? currentCourse.subjects : [];

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = courseName.trim();
    if (!trimmed) return;
    onAddCourse(trimmed);
    setCourseName('');
    setIsAddingCourse(false);
  };

  const handleSubjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = subjectName.trim();
    if (!trimmed) return;
    onAddSubject(trimmed);
    setSubjectName('');
    setIsAddingSubject(false);
  };

  return (
    <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-20 self-start flex flex-col gap-4">
      {/* 1. COURSE SELECTOR PANEL (Course Header) */}
      <div className="bg-panel rounded-xl p-4 border border-border shadow-xl">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-ink-muted font-bold text-xs uppercase tracking-wider">
            <GraduationCap className="w-4 h-4 text-spotify" />
            <span>কোর্সসমূহ ({toBn(courses.length)})</span>
          </div>
          <button
            onClick={() => setIsAddingCourse(!isAddingCourse)}
            className="flex items-center gap-1 text-xs font-bold text-spotify hover:underline"
            title="নতুন কোর্স যোগ করুন"
          >
            <Plus className="w-4 h-4" /> কোর্স
          </button>
        </div>

        {/* Course Select Dropdown / Horizontal Tabs */}
        <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
          {courses.map((c) => {
            const isSelected = c.id === selectedCourseId;
            return (
              <div
                key={c.id}
                draggable
                onDragStart={(e) => onDragStart(e, 'course', c.id)}
                onDragOver={onDragOver}
                onDrop={(e) => onDropCourse(e, c.id)}
                onClick={() => onSelectCourse(c.id)}
                className={`group flex items-center justify-between gap-2 p-2.5 rounded-lg cursor-pointer text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-spotify text-black shadow-md'
                    : 'bg-card-bg hover:bg-card-hover text-ink border border-border/40'
                }`}
              >
                <span className="truncate flex-1">{c.name}</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-normal ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-bg text-ink-muted'
                  }`}
                >
                  {toBn(c.subjects.length)} বিষয়
                </span>

                <div
                  className={`flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isSelected ? 'text-black' : 'text-ink-muted'
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditCourse(c);
                    }}
                    className="p-1 hover:text-ink transition-colors"
                    title="কোর্স সম্পাদনা করুন"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteCourse(c.id, c.name);
                    }}
                    className="p-1 hover:text-danger transition-colors"
                    title="কোর্স মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Course Form */}
        {isAddingCourse && (
          <form
            onSubmit={handleCourseSubmit}
            className="mt-3 p-3 bg-card-bg border border-border rounded-lg animate-slideDown flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder="কোর্সের নাম (যেমন: ৪৬তম বিসিএস)..."
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-xs text-ink outline-none transition-all"
              autoFocus
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-full bg-spotify text-black text-xs font-bold hover:bg-spotify-hover transition-all"
              >
                সংরক্ষণ
              </button>
              <button
                type="button"
                onClick={() => setIsAddingCourse(false)}
                className="px-3 py-1.5 rounded-full border border-border text-xs text-ink-muted hover:text-ink transition-colors"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. SUBJECTS LIST PANEL */}
      <div className="bg-panel rounded-xl p-4 border border-border shadow-xl">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2 text-ink-muted font-bold text-xs uppercase tracking-wider">
            <Library className="w-4 h-4 text-spotify" />
            <span>বিষয়সমূহ ({toBn(currentSubjects.length)})</span>
          </div>
          <button
            onClick={() => setIsAddingSubject(!isAddingSubject)}
            className="w-7 h-7 rounded-full hover:bg-card-hover flex items-center justify-center text-ink-muted hover:text-ink transition-all"
            title="নতুন বিষয় যোগ করুন"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Subjects List */}
        <div className="flex lg:flex-col gap-1.5 overflow-x-auto pb-2 lg:pb-0 scrollbar-none max-h-[calc(100vh-320px)] overflow-y-auto">
          {currentSubjects.map((s, index) => {
            const isSelected = s.id === selectedSubjectId;
            const chapterCount = s.chapters.length;

            const colors = [
              'from-emerald-600 to-teal-900',
              'from-purple-600 to-indigo-900',
              'from-amber-600 to-orange-900',
              'from-blue-600 to-cyan-900',
              'from-rose-600 to-pink-900',
            ];
            const coverBg = colors[index % colors.length];

            return (
              <div
                key={s.id}
                draggable
                onDragStart={(e) => onDragStart(e, 'subject', s.id)}
                onDragOver={onDragOver}
                onDrop={(e) => onDropSubject(e, s.id)}
                className="group relative flex items-center shrink-0 w-auto lg:w-full"
              >
                <div
                  onClick={() => onSelectSubject(s.id)}
                  className={`flex-1 flex items-center gap-2.5 p-2 rounded-md cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-card-hover text-ink shadow-md border-l-2 border-l-spotify'
                      : 'hover:bg-panel-hover text-ink-muted hover:text-ink'
                  }`}
                >
                  <span
                    className="cursor-grab active:cursor-grabbing text-faint group-hover:text-ink-muted transition-colors p-0.5 shrink-0 hidden lg:inline-block"
                    title="ড্র্যাগ করে সাজান"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </span>

                  <div
                    className={`w-8 h-8 rounded bg-gradient-to-br ${coverBg} flex items-center justify-center text-white shrink-0 shadow-sm ${
                      isSelected ? 'ring-2 ring-spotify' : ''
                    }`}
                  >
                    <BookOpen className="w-4 h-4 opacity-90" />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col">
                    <span
                      className={`text-xs font-semibold truncate ${
                        isSelected ? 'text-spotify font-bold' : 'text-ink'
                      }`}
                    >
                      {s.name}
                    </span>
                    <span className="text-[11px] text-ink-muted truncate">
                      {toBn(chapterCount)}টি চ্যাপ্টার
                    </span>
                  </div>
                </div>

                <div className="hidden lg:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 bg-card-bg/90 backdrop-blur-sm p-1 rounded-md">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditSubject(s);
                    }}
                    className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-panel transition-colors"
                    title="সম্পাদনা করুন"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSubject(s.id, s.name);
                    }}
                    className="p-1 rounded-full text-ink-muted hover:text-danger hover:bg-danger-bg transition-colors"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Subject Inline Form */}
        {isAddingSubject && (
          <form
            onSubmit={handleSubjectSubmit}
            className="mt-3 p-3 bg-card-bg border border-border rounded-lg animate-slideDown flex flex-col gap-2"
          >
            <input
              type="text"
              placeholder="বিষয়ের নাম..."
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="w-full bg-bg border border-border rounded-md px-3 py-2 text-xs text-ink outline-none transition-all"
              autoFocus
              required
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-1.5 rounded-full bg-spotify text-black text-xs font-bold hover:bg-spotify-hover transition-all"
              >
                সংরক্ষণ
              </button>
              <button
                type="button"
                onClick={() => setIsAddingSubject(false)}
                className="px-3 py-1.5 rounded-full border border-border text-xs text-ink-muted hover:text-ink transition-colors"
              >
                বাতিল
              </button>
            </div>
          </form>
        )}
      </div>
    </aside>
  );
};
