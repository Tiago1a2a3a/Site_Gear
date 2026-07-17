import { courses, lessons, trails } from "../../../../.velite";

import type { LearningCatalog, RelatedEnrollment } from "../types";

export function getLearningCatalog(): LearningCatalog {
  return {
    courses: courses
      .filter((course) => course.status === "publicado")
      .map(({ aulaSlugs, slug, titulo }) => ({ aulaSlugs, slug, titulo })),
    lessons: lessons
      .filter((lesson) => lesson.status === "publicado")
      .map(({ slug, titulo }) => ({ slug, titulo })),
    trails: trails
      .filter((trail) => trail.status === "publicado")
      .map(({ itens, slug, titulo }) => ({ itens, slug, titulo })),
  };
}

export function getRelatedEnrollmentsForLesson(
  lessonIdentifier: string,
): RelatedEnrollment[] {
  const catalog = getLearningCatalog();
  const courseIds = new Set(
    catalog.courses
      .filter((course) => course.aulaSlugs.includes(lessonIdentifier))
      .map((course) => course.slug),
  );
  const related: RelatedEnrollment[] = [...courseIds].map(
    (contentIdentifier) => ({
      contentIdentifier,
      contentType: "curso",
    }),
  );

  for (const trail of catalog.trails) {
    const containsLesson = trail.itens.some(
      (item) =>
        (item.tipo === "aula" && item.slug === lessonIdentifier) ||
        (item.tipo === "curso" && courseIds.has(item.slug)),
    );

    if (containsLesson) {
      related.push({ contentIdentifier: trail.slug, contentType: "trilha" });
    }
  }

  return related;
}
