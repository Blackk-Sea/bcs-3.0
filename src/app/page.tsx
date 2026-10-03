'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Course,
  Subject,
  Chapter,
  Resource,
  ResourceType,
  ToastMessage,
  FilterMode,
  EditModalState,
} from '@/types/library';
import {
  loadLibraryFromStorage,
  saveLibraryToStorage,
  normalizeCourses,
} from '@/utils/storage';
import { generateUid } from '@/utils/bengali';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { ContentArea } from '@/components/ContentArea';
import { EditModal } from '@/components/EditModal';
import { ToastContainer } from '@/components/Toast';
import { Footer } from '@/components/Footer';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterMode, setFilterMode] = useState<FilterMode>('all');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [editModalState, setEditModalState] = useState<EditModalState | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Drag Payload Tracking
  const dragPayload = useRef<{
    type: 'course' | 'subject' | 'chapter' | 'resource';
    id: string;
    chapterId?: string;
  } | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const data = loadLibraryFromStorage();
    setCourses(data.courses);
    setSelectedCourseId(data.selectedCourseId);
    setSelectedSubjectId(data.selectedSubjectId);
    const initialTheme = data.theme || 'dark';
    setTheme(initialTheme);
    if (initialTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    setIsLoaded(true);
  }, []);

  // Sync to LocalStorage on changes
  useEffect(() => {
    if (isLoaded) {
      saveLibraryToStorage({
        courses,
        selectedCourseId,
        selectedSubjectId,
        theme,
      });
    }
  }, [courses, selectedCourseId, selectedSubjectId, theme, isLoaded]);

  // Handle Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
    } else {
      document.documentElement.classList.remove('light');
    }
    addToast(nextTheme === 'light' ? 'লাইট মোড সক্রিয় করা হয়েছে' : 'ডার্ক মোড সক্রিয় করা হয়েছে');
  };

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (e.target as HTMLElement)?.tagName;
      if (e.key === '/' && activeTag !== 'INPUT' && activeTag !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (e.key === 'Escape') {
        if (editModalState) {
          setEditModalState(null);
        } else if (searchQuery) {
          setSearchQuery('');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editModalState, searchQuery]);

  // Toast Helpers
  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = generateUid();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Current Course & Subject Helpers
  const currentCourse =
    courses.find((c) => c.id === selectedCourseId) || (courses.length > 0 ? courses[0] : null);

  const selectedSubject = currentCourse
    ? currentCourse.subjects.find((s) => s.id === selectedSubjectId) ||
      (currentCourse.subjects.length > 0 ? currentCourse.subjects[0] : null)
    : null;

  // Global Stats Calculations
  let totalSubjectsCount = 0;
  let totalResourcesCount = 0;
  let completedResourcesCount = 0;

  courses.forEach((c) =>
    c.subjects.forEach((s) => {
      totalSubjectsCount++;
      s.chapters.forEach((ch) => {
        totalResourcesCount += ch.resources.length;
        completedResourcesCount += ch.resources.filter((r) => r.completed).length;
      });
    })
  );

  // ---------- COURSE ACTIONS ----------
  const handleAddCourse = (name: string) => {
    const newCourse: Course = {
      id: generateUid(),
      name,
      subjects: [],
    };
    setCourses((prev) => [...prev, newCourse]);
    setSelectedCourseId(newCourse.id);
    setSelectedSubjectId(null);
    addToast('নতুন কোর্স যুক্ত হয়েছে');
  };

  const handleEditCourse = (course: Course) => {
    setEditModalState({
      type: 'course',
      courseId: course.id,
      initialTitle: course.name,
    });
  };

  const handleDeleteCourse = (id: string, name: string) => {
    if (!window.confirm(`“${name}” কোর্স এবং এর সব বিষয় মুছে ফেলবেন?`)) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
    if (selectedCourseId === id) {
      const remaining = courses.filter((c) => c.id !== id);
      const nextCourse = remaining.length > 0 ? remaining[0] : null;
      setSelectedCourseId(nextCourse ? nextCourse.id : null);
      setSelectedSubjectId(nextCourse && nextCourse.subjects[0] ? nextCourse.subjects[0].id : null);
    }
    addToast('কোর্স মুছে ফেলা হয়েছে');
  };

  // ---------- SUBJECT ACTIONS ----------
  const handleAddSubject = (name: string) => {
    if (!currentCourse) return;
    const newSubject: Subject = {
      id: generateUid(),
      name,
      chapters: [],
    };
    setCourses((prev) =>
      prev.map((c) =>
        c.id === currentCourse.id ? { ...c, subjects: [...c.subjects, newSubject] } : c
      )
    );
    setSelectedSubjectId(newSubject.id);
    addToast('নতুন বিষয় যুক্ত হয়েছে');
  };

  const handleDeleteSubject = (id: string, name: string) => {
    if (!currentCourse) return;
    if (!window.confirm(`“${name}” বিষয় মুছে ফেলবেন?`)) return;
    setCourses((prev) =>
      prev.map((c) =>
        c.id === currentCourse.id
          ? { ...c, subjects: c.subjects.filter((s) => s.id !== id) }
          : c
      )
    );
    if (selectedSubjectId === id) {
      const remaining = currentCourse.subjects.filter((s) => s.id !== id);
      setSelectedSubjectId(remaining.length > 0 ? remaining[0].id : null);
    }
    addToast('বিষয় মুছে ফেলা হয়েছে');
  };

  // ---------- CHAPTER COLLAPSE / EXPAND ACTIONS ----------
  const handleToggleCollapseChapter = (chapterId: string) => {
    if (!currentCourse || !selectedSubject) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubject.id) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, isCollapsed: !ch.isCollapsed } : ch
              ),
            };
          }),
        };
      })
    );
  };

  const handleToggleExpandAllChapters = (expand: boolean) => {
    if (!currentCourse || !selectedSubject) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubject.id) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) => ({ ...ch, isCollapsed: !expand })),
            };
          }),
        };
      })
    );
    addToast(expand ? 'সব চ্যাপ্টার এক্সপ্যান্ড করা হয়েছে' : 'সব চ্যাপ্টার মিনিমাইজ করা হয়েছে');
  };

  // ---------- CHAPTER ACTIONS ----------
  const handleAddChapter = (subjectId: string, name: string) => {
    if (!currentCourse) return;
    const newChapter: Chapter = {
      id: generateUid(),
      name,
      resources: [],
      isCollapsed: false,
    };
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) =>
            s.id === subjectId ? { ...s, chapters: [...s.chapters, newChapter] } : s
          ),
        };
      })
    );
    addToast('নতুন চ্যাপ্টার যুক্ত হয়েছে');
  };

  const handleDeleteChapter = (chapterId: string) => {
    if (!currentCourse || !selectedSubject) return;
    if (!window.confirm('চ্যাপ্টারটি মুছে ফেলবেন?')) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) =>
            s.id === selectedSubject.id
              ? { ...s, chapters: s.chapters.filter((ch) => ch.id !== chapterId) }
              : s
          ),
        };
      })
    );
    addToast('চ্যাপ্টার মুছে ফেলা হয়েছে');
  };

  const handleToggleAllChapterComplete = (chapterId: string) => {
    if (!currentCourse || !selectedSubject) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubject.id) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) => {
                if (ch.id !== chapterId) return ch;
                const allComplete =
                  ch.resources.length > 0 && ch.resources.every((r) => r.completed);
                const updatedResources = ch.resources.map((r) => ({
                  ...r,
                  completed: !allComplete,
                }));
                return { ...ch, resources: updatedResources };
              }),
            };
          }),
        };
      })
    );
    addToast('চ্যাপ্টারের স্ট্যাটাস আপডেট করা হয়েছে');
  };

  // ---------- RESOURCE ACTIONS ----------
  const handleAddResource = (
    chapterId: string,
    title: string,
    url: string,
    type: ResourceType
  ) => {
    if (!currentCourse || !selectedSubject) return;
    const newResource: Resource = {
      id: generateUid(),
      type,
      title,
      url,
      completed: false,
    };
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubject.id) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) =>
                ch.id === chapterId ? { ...ch, resources: [...ch.resources, newResource] } : ch
              ),
            };
          }),
        };
      })
    );
    addToast('রিসোর্স যুক্ত হয়েছে');
  };

  const handleToggleComplete = (chapterId: string, resourceId: string) => {
    if (!currentCourse || !selectedSubject) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubject.id) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) => {
                if (ch.id !== chapterId) return ch;
                return {
                  ...ch,
                  resources: ch.resources.map((r) =>
                    r.id === resourceId ? { ...r, completed: !r.completed } : r
                  ),
                };
              }),
            };
          }),
        };
      })
    );
  };

  const handleDeleteResource = (chapterId: string, resourceId: string) => {
    if (!currentCourse || !selectedSubject) return;
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== currentCourse.id) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubject.id) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) =>
                ch.id === chapterId
                  ? { ...ch, resources: ch.resources.filter((r) => r.id !== resourceId) }
                  : ch
              ),
            };
          }),
        };
      })
    );
    addToast('রিসোর্স মুছে ফেলা হয়েছে');
  };

  // ---------- EDIT MODAL ACTIONS ----------
  const handleOpenEditSubject = (subject: Subject) => {
    setEditModalState({
      type: 'subject',
      subjectId: subject.id,
      initialTitle: subject.name,
    });
  };

  const handleOpenEditChapter = (chapter: Chapter) => {
    setEditModalState({
      type: 'chapter',
      chapterId: chapter.id,
      initialTitle: chapter.name,
    });
  };

  const handleOpenEditResource = (resource: Resource, chapterId: string) => {
    setEditModalState({
      type: 'resource',
      chapterId,
      resourceId: resource.id,
      initialTitle: resource.title,
      initialUrl: resource.url,
      initialResourceType: resource.type,
    });
  };

  const handleSaveModal = (updated: { title: string; url?: string; type?: ResourceType }) => {
    if (!editModalState) return;

    if (editModalState.type === 'course') {
      setCourses((prev) =>
        prev.map((c) => (c.id === editModalState.courseId ? { ...c, name: updated.title } : c))
      );
      addToast('কোর্স আপডেট করা হয়েছে');
    } else if (editModalState.type === 'subject') {
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCourseId) return c;
          return {
            ...c,
            subjects: c.subjects.map((s) =>
              s.id === editModalState.subjectId ? { ...s, name: updated.title } : s
            ),
          };
        })
      );
      addToast('বিষয় আপডেট করা হয়েছে');
    } else if (editModalState.type === 'chapter') {
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCourseId) return c;
          return {
            ...c,
            subjects: c.subjects.map((s) => {
              if (s.id !== selectedSubjectId) return s;
              return {
                ...s,
                chapters: s.chapters.map((ch) =>
                  ch.id === editModalState.chapterId ? { ...ch, name: updated.title } : ch
                ),
              };
            }),
          };
        })
      );
      addToast('চ্যাপ্টার আপডেট করা হয়েছে');
    } else if (editModalState.type === 'resource') {
      setCourses((prev) =>
        prev.map((c) => {
          if (c.id !== selectedCourseId) return c;
          return {
            ...c,
            subjects: c.subjects.map((s) => {
              if (s.id !== selectedSubjectId) return s;
              return {
                ...s,
                chapters: s.chapters.map((ch) => {
                  if (ch.id !== editModalState.chapterId) return ch;
                  return {
                    ...ch,
                    resources: ch.resources.map((r) =>
                      r.id === editModalState.resourceId
                        ? {
                            ...r,
                            title: updated.title,
                            url: updated.url || r.url,
                            type: updated.type || r.type,
                          }
                        : r
                    ),
                  };
                }),
              };
            }),
          };
        })
      );
      addToast('রিসোর্স আপডেট করা হয়েছে');
    }
  };

  // ---------- DRAG AND DROP REORDERING ----------
  const handleDragStart = (
    e: React.DragEvent,
    type: 'course' | 'subject' | 'chapter' | 'resource',
    id: string,
    chapterId?: string
  ) => {
    dragPayload.current = { type, id, chapterId };
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropCourse = (e: React.DragEvent, targetCourseId: string) => {
    e.preventDefault();
    const payload = dragPayload.current;
    if (!payload || payload.type !== 'course' || payload.id === targetCourseId) return;

    setCourses((prev) => {
      const fromIndex = prev.findIndex((c) => c.id === payload.id);
      const toIndex = prev.findIndex((c) => c.id === targetCourseId);
      if (fromIndex === -1 || toIndex === -1) return prev;

      const copy = [...prev];
      const [moved] = copy.splice(fromIndex, 1);
      copy.splice(toIndex, 0, moved);
      return copy;
    });
    addToast('কোর্সসমূহের ক্রম পরিবর্তন করা হয়েছে');
    dragPayload.current = null;
  };

  const handleDropSubject = (e: React.DragEvent, targetSubjectId: string) => {
    e.preventDefault();
    const payload = dragPayload.current;
    if (!payload || payload.type !== 'subject' || payload.id === targetSubjectId) return;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== selectedCourseId) return c;
        const fromIndex = c.subjects.findIndex((s) => s.id === payload.id);
        const toIndex = c.subjects.findIndex((s) => s.id === targetSubjectId);
        if (fromIndex === -1 || toIndex === -1) return c;

        const copy = [...c.subjects];
        const [moved] = copy.splice(fromIndex, 1);
        copy.splice(toIndex, 0, moved);
        return { ...c, subjects: copy };
      })
    );
    addToast('বিষয়সমূহের ক্রম পরিবর্তন করা হয়েছে');
    dragPayload.current = null;
  };

  const handleDropChapter = (e: React.DragEvent, targetChapterId: string) => {
    e.preventDefault();
    const payload = dragPayload.current;
    if (!payload || payload.type !== 'chapter' || payload.id === targetChapterId) return;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== selectedCourseId) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubjectId) return s;
            const fromIndex = s.chapters.findIndex((ch) => ch.id === payload.id);
            const toIndex = s.chapters.findIndex((ch) => ch.id === targetChapterId);
            if (fromIndex === -1 || toIndex === -1) return s;

            const copy = [...s.chapters];
            const [moved] = copy.splice(fromIndex, 1);
            copy.splice(toIndex, 0, moved);
            return { ...s, chapters: copy };
          }),
        };
      })
    );
    addToast('চ্যাপ্টারের ক্রম পরিবর্তন করা হয়েছে');
    dragPayload.current = null;
  };

  const handleDropResource = (
    e: React.DragEvent,
    targetResourceId: string,
    targetChapterId: string
  ) => {
    e.preventDefault();
    const payload = dragPayload.current;
    if (
      !payload ||
      payload.type !== 'resource' ||
      payload.id === targetResourceId ||
      payload.chapterId !== targetChapterId
    )
      return;

    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== selectedCourseId) return c;
        return {
          ...c,
          subjects: c.subjects.map((s) => {
            if (s.id !== selectedSubjectId) return s;
            return {
              ...s,
              chapters: s.chapters.map((ch) => {
                if (ch.id !== targetChapterId) return ch;
                const fromIndex = ch.resources.findIndex((r) => r.id === payload.id);
                const toIndex = ch.resources.findIndex((r) => r.id === targetResourceId);
                if (fromIndex === -1 || toIndex === -1) return ch;

                const copy = [...ch.resources];
                const [moved] = copy.splice(fromIndex, 1);
                copy.splice(toIndex, 0, moved);
                return { ...ch, resources: copy };
              }),
            };
          }),
        };
      })
    );
    addToast('রিসোর্সের ক্রম পরিবর্তন করা হয়েছে');
    dragPayload.current = null;
  };

  // ---------- EXPORT & IMPORT ----------
  const handleExport = () => {
    const dataToExport = {
      courses,
      selectedCourseId,
      selectedSubjectId,
      theme,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `bcs-resource-library-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    addToast('ডেটা এক্সপোর্ট সফল হয়েছে');
  };

  const handleImport = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result as string);
        const normalized = normalizeCourses(parsed.courses || parsed.subjects);
        if (normalized.length === 0) throw new Error('Invalid schema');
        setCourses(normalized);
        setSelectedCourseId(normalized[0].id);
        setSelectedSubjectId(normalized[0].subjects[0]?.id || null);
        addToast('ডেটা সফলভাবে ইমপোর্ট হয়েছে');
      } catch (err) {
        addToast('ত্রুটি: সঠিক JSON ফাইল নির্বাচন করুন', 'error');
      }
    };
    reader.readAsText(file);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg text-ink flex items-center justify-center">
        <div className="animate-pulse text-sm text-ink-muted">লোড হচ্ছে...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-bg text-ink selection:bg-spotify selection:text-black">
      {/* Header */}
      <Header
        totalCourses={courses.length}
        totalSubjects={totalSubjectsCount}
        totalResources={totalResourcesCount}
        completedResources={completedResourcesCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchInputRef={searchInputRef}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main 2-Panel Application Layout */}
      <main className="max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-6 flex-1">
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Left Panel: Course & Subject Sidebar */}
          <Sidebar
            courses={courses}
            selectedCourseId={selectedCourseId}
            selectedSubjectId={selectedSubjectId}
            onSelectCourse={(courseId) => {
              setSelectedCourseId(courseId);
              const course = courses.find((c) => c.id === courseId);
              setSelectedSubjectId(course && course.subjects[0] ? course.subjects[0].id : null);
              setSearchQuery('');
            }}
            onSelectSubject={(subjectId) => {
              setSelectedSubjectId(subjectId);
              setSearchQuery('');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onAddCourse={handleAddCourse}
            onEditCourse={handleEditCourse}
            onDeleteCourse={handleDeleteCourse}
            onAddSubject={handleAddSubject}
            onEditSubject={handleOpenEditSubject}
            onDeleteSubject={handleDeleteSubject}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDropCourse={handleDropCourse}
            onDropSubject={handleDropSubject}
          />

          {/* Right Panel: Content Area */}
          <ContentArea
            currentCourse={currentCourse}
            selectedSubject={selectedSubject}
            courses={courses}
            searchQuery={searchQuery}
            filterMode={filterMode}
            onFilterChange={setFilterMode}
            onClearSearch={() => setSearchQuery('')}
            onAddSubjectClick={() => {
              const name = prompt('বিষয়ের নাম লিখুন:');
              if (name && name.trim()) handleAddSubject(name.trim());
            }}
            onAddChapter={handleAddChapter}
            onToggleCollapseChapter={handleToggleCollapseChapter}
            onToggleExpandAllChapters={handleToggleExpandAllChapters}
            onEditSubject={handleOpenEditSubject}
            onEditChapter={handleOpenEditChapter}
            onDeleteChapter={handleDeleteChapter}
            onAddResource={handleAddResource}
            onToggleComplete={handleToggleComplete}
            onToggleAllChapterComplete={handleToggleAllChapterComplete}
            onEditResource={handleOpenEditResource}
            onDeleteResource={handleDeleteResource}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDropChapter={handleDropChapter}
            onDropResource={handleDropResource}
          />
        </div>
      </main>

      {/* Edit Modal */}
      <EditModal
        state={editModalState}
        onClose={() => setEditModalState(null)}
        onSave={handleSaveModal}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Footer */}
      <Footer onExport={handleExport} onImport={handleImport} />
    </div>
  );
}
