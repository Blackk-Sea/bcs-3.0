import { LibraryData, Course, Subject } from '@/types/library';
import { generateUid } from './bengali';

export const STORAGE_KEY = 'bcs-resource-library-v3';

export function getSeedData(): LibraryData {
  const bcsSubjectId = generateUid();
  const englishSubjectId = generateUid();
  const defaultCourseId = generateUid();

  const subjects: Subject[] = [
    {
      id: bcsSubjectId,
      name: 'বাংলাদেশ বিষয়াবলী',
      chapters: [
        {
          id: generateUid(),
          name: 'সংবিধান ও মৌলিক অধিকার',
          resources: [
            {
              id: generateUid(),
              type: 'yt',
              title: 'সংবিধান — সম্পূর্ণ ক্লাস প্লেলিস্ট',
              url: 'https://youtube.com',
              completed: true,
            },
            {
              id: generateUid(),
              type: 'drive',
              title: 'মৌলিক অধিকার — হ্যান্ডনোট PDF',
              url: 'https://drive.google.com',
              completed: false,
            },
          ],
          isCollapsed: false,
        },
        {
          id: generateUid(),
          name: 'মুক্তিযুদ্ধ ও স্বাধীনতা',
          resources: [
            {
              id: generateUid(),
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
      id: englishSubjectId,
      name: 'English',
      chapters: [
        {
          id: generateUid(),
          name: 'Vocabulary (Word Smart)',
          resources: [
            {
              id: generateUid(),
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
      id: generateUid(),
      name: 'ব্যাংক জবস প্রস্তুতি কোর্স',
      subjects: [
        {
          id: generateUid(),
          name: 'General Knowledge & Banking',
          chapters: [
            {
              id: generateUid(),
              name: 'Banking Fundamentals',
              resources: [
                {
                  id: generateUid(),
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
    selectedSubjectId: bcsSubjectId,
    theme: 'dark',
  };
}

export function normalizeCourses(raw: any): Course[] {
  if (!raw) return [];

  // Migration logic if raw is array of subjects (legacy format)
  if (Array.isArray(raw) && raw.length > 0 && !raw[0].subjects) {
    const courseId = generateUid();
    return [
      {
        id: courseId,
        name: 'বিসিএস প্রস্তুতি কোর্স',
        subjects: normalizeSubjects(raw),
      },
    ];
  }

  if (Array.isArray(raw)) {
    return raw.map((c: any) => ({
      id: c.id || generateUid(),
      name: c.name || 'শিরোনামহীন কোর্স',
      subjects: normalizeSubjects(c.subjects),
    }));
  }

  return [];
}

export function normalizeSubjects(rawSubjects: any[]): Subject[] {
  if (!Array.isArray(rawSubjects)) return [];
  return rawSubjects.map((s) => ({
    id: s.id || generateUid(),
    name: s.name || 'শিরোনামহীন বিষয়',
    chapters: Array.isArray(s.chapters)
      ? s.chapters.map((c: any) => ({
          id: c.id || generateUid(),
          name: c.name || 'শিরোনামহীন চ্যাপ্টার',
          resources: Array.isArray(c.resources)
            ? c.resources.map((r: any) => ({
                id: r.id || generateUid(),
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
      // Check legacy v2 storage
      const legacyRaw = localStorage.getItem('bcs-resource-library-v2');
      if (legacyRaw) {
        const legacyParsed = JSON.parse(legacyRaw);
        if (legacyParsed && Array.isArray(legacyParsed.subjects)) {
          const courses = normalizeCourses(legacyParsed.subjects);
          return {
            courses,
            selectedCourseId: courses[0]?.id || null,
            selectedSubjectId: courses[0]?.subjects[0]?.id || null,
            theme: 'dark',
          };
        }
      }
      return getSeedData();
    }

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.courses)) return getSeedData();
    const courses = normalizeCourses(parsed.courses);
    if (courses.length === 0) return getSeedData();

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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save library state to localStorage:', err);
  }
}
