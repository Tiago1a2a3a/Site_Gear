export type LearningContentType = "curso" | "trilha";

export type LearningEnrollment = Readonly<{
  content_identifier: string;
  content_type: LearningContentType;
  enrolled_at: string;
  last_activity_at: string;
  user_id: string;
}>;

export type LessonCompletion = Readonly<{
  completed_at: string;
  lesson_identifier: string;
  user_id: string;
}>;

export type LearningCourse = Readonly<{
  aulaSlugs: readonly string[];
  slug: string;
  titulo: string;
}>;

export type LearningTrailItem = Readonly<{
  slug: string;
  tipo: "aula" | "curso";
}>;

export type LearningTrail = Readonly<{
  itens: readonly LearningTrailItem[];
  slug: string;
  titulo: string;
}>;

export type LearningLesson = Readonly<{
  slug: string;
  titulo: string;
}>;

export type LearningCatalog = Readonly<{
  courses: readonly LearningCourse[];
  lessons: readonly LearningLesson[];
  trails: readonly LearningTrail[];
}>;

export type RelatedEnrollment = Readonly<{
  contentIdentifier: string;
  contentType: LearningContentType;
}>;

export type StudySummary = Readonly<{
  href: string;
  identifier: string;
  lastActivityAt: string;
  progress: number;
  title: string;
  type: LearningContentType;
}>;

export type CompletedLessonSummary = Readonly<{
  completedAt: string;
  href: string;
  identifier: string;
  title: string;
}>;
