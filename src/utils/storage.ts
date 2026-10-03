import { LibraryData, Course, Subject } from '@/types/library';

export const STORAGE_KEY = 'bcs-resource-library-v4';

export function getSeedData(): LibraryData {
  const defaultCourseId = 'course-bcs-preliminary';
  const bankCourseId = 'course-bank-jobs';

  const bcsSubject1Id = 'subj-bcs-affairs';
  const bcsSubject2Id = 'subj-english';
  const bankSubject1Id = 'subj-banking-gk';

  const subjects: Subject[] = [
    {
      id: bcsSubject1Id,
      name: 'বাংলাদেশ বিষয়াবলী',
      chapters: [
        {
          id: 'chap-constitution',
          name: 'সংবিধান ও মৌলিক অধিকার',
          resources: [
            {
              id: 'res-const-playlist',
              type: 'yt',
              title: 'সংবিধান — সম্পূর্ণ ক্লাস প্লেলিস্ট',
              url: 'https://youtube.com',
              completed: true,
            },
            {
              id: 'res-fundamental-rights-note',
              type: 'drive',
              title: 'মৌলিক অধিকার — হ্যান্ডনোট PDF',
              url: 'https://drive.google.com',
              completed: false,
            },
          ],
          isCollapsed: false,
        },
        {
          id: 'chap-liberation-war',
          name: 'মুক্তিযুদ্ধ ও স্বাধীনতা',
          resources: [
            {
              id: 'res-1971-docu',
              type: 'yt',
              title: '১৯৭১ মুক্তিযুদ্ধ ডকুমেন্টারি',
              url: 'https://youtube.com',
              completed: false,
            },
          ],
          isCollapsed: false,
        },
      ],
    },
    {
      id: bcsSubject2Id,
      name: 'English',
      chapters: [
        {
          id: 'chap-vocab',
          name: 'Vocabulary (Word Smart)',
          resources: [
            {
              id: 'res-active-recall',
              type: 'yt',
              title: 'Active Recall Methods',
              url: 'https://youtube.com',
              completed: false,
            },
          ],
          isCollapsed: false,
        },
      ],
    },
  ];

  const courses: Course[] = [
    {
      id: defaultCourseId,
      name: 'বিসিএস প্রিলিমিনারি কোর্স',
      subjects,
    },
    {
      id: bankCourseId,
      name: 'ব্যাংক জবস প্রস্তুতি কোর্স',
      subjects: [
        {
          id: bankSubject1Id,
          name: 'General Knowledge & Banking',
          chapters: [
            {
              id: 'chap-banking-fund',
              name: 'Banking Fundamentals',
              resources: [
                {
                  id: 'res-banking-note',
                  type: 'drive',
                  title: 'Banking Terminology Note PDF',
                  url: 'https://drive.google.com',
                  completed: false,
                },
              ],
              isCollapsed: false,
            },
          ],
        },
      ],
    },
  ];

  return {
    courses,
    selectedCourseId: defaultCourseId,
    selectedSubjectId: bcsSubject1Id,
    theme: 'dark',
  };
}

export function normalizeCourses(raw: any): Course[] {
  if (!raw) return [];

  // Migration logic if raw is array of subjects (legacy v1/v2 format)
  if (Array.isArray(raw) && raw.length > 0 && !raw[0].subjects) {
    return [
      {
        id: 'course-migrated-legacy',
        name: 'বিসিএস প্রস্তুতি কোর্স',
        subjects: normalizeSubjects(raw),
      },
    ];
  }

  if (Array.isArray(raw)) {
    return raw.map((c: any, index: number) => ({
      id: c.id || `course-norm-${index}-${Date.now()}`,
      name: c.name || 'শিরোনামহীন কোর্স',
      subjects: normalizeSubjects(c.subjects),
    }));
  }

  return [];
}

export function normalizeSubjects(rawSubjects: any[]): Subject[] {
  if (!Array.isArray(rawSubjects)) return [];
  return rawSubjects.map((s, index) => ({
    id: s.id || `subj-norm-${index}-${Date.now()}`,
    name: s.name || 'শিরোনামহীন বিষয়',
    chapters: Array.isArray(s.chapters)
      ? s.chapters.map((c: any, cIdx: number) => ({
          id: c.id || `chap-norm-${cIdx}-${Date.now()}`,
          name: c.name || 'শিরোনামহীন চ্যাপ্টার',
          resources: Array.isArray(c.resources)
            ? c.resources.map((r: any, rIdx: number) => ({
                id: r.id || `res-norm-${rIdx}-${Date.now()}`,
                type: ['yt', 'drive', 'tg'].includes(r.type) ? r.type : 'yt',
                title: r.title || 'শিরোনামহীন',
                url: r.url || '',
                completed: Boolean(r.completed),
              }))
            : [],
          isCollapsed: Boolean(c.isCollapsed),
        }))
      : [],
  }));
}

export function loadLibraryFromStorage(): LibraryData {
  if (typeof window === 'undefined') return getSeedData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Check legacy keys v3 / v2
      const legacyV3 = localStorage.getItem('bcs-resource-library-v3');
      const legacyV2 = localStorage.getItem('bcs-resource-library-v2');
      const fallbackRaw = legacyV3 || legacyV2;
      if (fallbackRaw) {
        const legacyParsed = JSON.parse(fallbackRaw);
        if (legacyParsed) {
          const courses = normalizeCourses(legacyParsed.courses || legacyParsed.subjects);
          if (courses.length > 0) {
            const data: LibraryData = {
              courses,
              selectedCourseId: legacyParsed.selectedCourseId || courses[0].id,
              selectedSubjectId: legacyParsed.selectedSubjectId || courses[0].subjects[0]?.id || null,
              theme: legacyParsed.theme === 'light' ? 'light' : 'dark',
            };
            saveLibraryToStorage(data);
            return data;
          }
        }
      }
      const initial = getSeedData();
      saveLibraryToStorage(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.courses)) {
      const initial = getSeedData();
      saveLibraryToStorage(initial);
      return initial;
    }

    const courses = normalizeCourses(parsed.courses);
    if (courses.length === 0) {
      const initial = getSeedData();
      saveLibraryToStorage(initial);
      return initial;
    }

    const selectedCourseId =
      parsed.selectedCourseId && courses.some((c) => c.id === parsed.selectedCourseId)
        ? parsed.selectedCourseId
        : courses[0].id;

    const currentCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
    const selectedSubjectId =
      parsed.selectedSubjectId && currentCourse.subjects.some((s) => s.id === parsed.selectedSubjectId)
        ? parsed.selectedSubjectId
        : currentCourse.subjects[0]?.id || null;

    return {
      courses,
      selectedCourseId,
      selectedSubjectId,
      theme: parsed.theme === 'light' ? 'light' : 'dark',
    };
  } catch (err) {
    return getSeedData();
  }
}

export function saveLibraryToStorage(data: LibraryData): void {
  if (typeof window === 'undefined') return;
  try {
    // Safety check: Never save empty courses array over existing storage
    if (!data || !Array.isArray(data.courses) || data.courses.length === 0) {
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save library state to localStorage:', err);
  }
}
