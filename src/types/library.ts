export type ResourceType = 'yt' | 'drive' | 'tg';

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  completed?: boolean;
}

export interface Chapter {
  id: string;
  name: string;
  resources: Resource[];
  isCollapsed?: boolean;
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}

export interface Course {
  id: string;
  name: string;
  subjects: Subject[];
}

export interface LibraryData {
  courses: Course[];
  selectedCourseId: string | null;
  selectedSubjectId: string | null;
  theme?: 'dark' | 'light';
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export type FilterMode = 'all' | 'incomplete' | 'completed';

export interface EditModalState {
  type: 'course' | 'subject' | 'chapter' | 'resource';
  courseId?: string;
  subjectId?: string;
  chapterId?: string;
  resourceId?: string;
  initialTitle: string;
  initialUrl?: string;
  initialResourceType?: ResourceType;
}
