import type {
  CompletedLessonSummary,
  LearningCatalog,
  LearningCourse,
  LearningEnrollment,
  LearningTrail,
  LessonCompletion,
  StudySummary,
} from "../types";

export function calculateCourseProgress(
  course: LearningCourse,
  completedLessonIds: ReadonlySet<string>,
) {
  if (course.aulaSlugs.length === 0) return 0;

  const completed = course.aulaSlugs.filter((slug) =>
    completedLessonIds.has(slug),
  ).length;
  return Math.floor((completed / course.aulaSlugs.length) * 100);
}

export function calculateTrailProgress(
  trail: LearningTrail,
  catalog: LearningCatalog,
  completedLessonIds: ReadonlySet<string>,
) {
  if (trail.itens.length === 0) return 0;

  const coursesBySlug = new Map(
    catalog.courses.map((course) => [course.slug, course]),
  );
  const completedItems = trail.itens.filter((item) => {
    if (item.tipo === "aula") return completedLessonIds.has(item.slug);
    const course = coursesBySlug.get(item.slug);
    return course
      ? calculateCourseProgress(course, completedLessonIds) === 100
      : false;
  }).length;

  return Math.floor((completedItems / trail.itens.length) * 100);
}

export function buildStudySummaries(
  enrollments: readonly LearningEnrollment[],
  completions: readonly LessonCompletion[],
  catalog: LearningCatalog,
): StudySummary[] {
  const completedLessonIds = new Set(
    completions.map((completion) => completion.lesson_identifier),
  );
  const coursesBySlug = new Map(
    catalog.courses.map((course) => [course.slug, course]),
  );
  const trailsBySlug = new Map(
    catalog.trails.map((trail) => [trail.slug, trail]),
  );

  const summaries: StudySummary[] = [];

  for (const enrollment of enrollments) {
    if (enrollment.content_type === "curso") {
      const course = coursesBySlug.get(enrollment.content_identifier);
      if (course) {
        summaries.push({
          href: `/aprendizado/cursos/${course.slug}`,
          identifier: course.slug,
          lastActivityAt: enrollment.last_activity_at,
          progress: calculateCourseProgress(course, completedLessonIds),
          title: course.titulo,
          type: "curso",
        });
      }
      continue;
    }

    const trail = trailsBySlug.get(enrollment.content_identifier);
    if (trail) {
      summaries.push({
        href: `/aprendizado/trilhas/${trail.slug}`,
        identifier: trail.slug,
        lastActivityAt: enrollment.last_activity_at,
        progress: calculateTrailProgress(trail, catalog, completedLessonIds),
        title: trail.titulo,
        type: "trilha",
      });
    }
  }

  return summaries.sort((a, b) =>
    b.lastActivityAt.localeCompare(a.lastActivityAt),
  );
}

export function buildCompletedLessonSummaries(
  completions: readonly LessonCompletion[],
  catalog: LearningCatalog,
): CompletedLessonSummary[] {
  const lessonsBySlug = new Map(
    catalog.lessons.map((lesson) => [lesson.slug, lesson]),
  );

  return completions
    .flatMap((completion) => {
      const lesson = lessonsBySlug.get(completion.lesson_identifier);
      if (!lesson) return [];
      return [
        {
          completedAt: completion.completed_at,
          href: `/aprendizado/aulas/${lesson.slug}`,
          identifier: lesson.slug,
          title: lesson.titulo,
        },
      ];
    })
    .sort((a, b) => b.completedAt.localeCompare(a.completedAt));
}
