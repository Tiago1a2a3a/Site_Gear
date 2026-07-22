"use client";

import Link from "next/link";
import { useState } from "react";

import { Badge } from "@shared/components/ui/Badge";

import type { Curso } from "@features/cursos/types";

type HomeCoursesCarouselProps = Readonly<{
  courses: readonly Curso[];
}>;

export function HomeCoursesCarousel({ courses }: HomeCoursesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!courses.length) return null;

  const course = courses[activeIndex]!;
  const move = (direction: number) =>
    setActiveIndex((current) => (current + direction + courses.length) % courses.length);

  return (
    <section aria-label="Cursos para explorar" className="home-courses-carousel">
      <div className="home-courses-carousel__heading">
        <div>
          <Badge>Cursos</Badge>
          <h3>Escolha seu próximo desafio</h3>
        </div>
        {courses.length > 1 ? (
          <div className="home-courses-carousel__controls">
            <button aria-label="Curso anterior" onClick={() => move(-1)} type="button">←</button>
            <span>{activeIndex + 1} / {courses.length}</span>
            <button aria-label="Próximo curso" onClick={() => move(1)} type="button">→</button>
          </div>
        ) : null}
      </div>
      <Link
        aria-label={`Abrir curso: ${course.titulo}`}
        className="card home-course-slide"
        href={`/aprendizado/cursos/${course.slug}`}
      >
        <div>
          <Badge>{course.dificuldade}</Badge>
          {course.categoria ? <small>{course.categoria}</small> : null}
        </div>
        <strong>{course.titulo}</strong>
        <p>{course.descricao}</p>
        <span>Ver curso →</span>
      </Link>
    </section>
  );
}
