"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Badge } from "@shared/components/ui/Badge";

import type { Curso } from "@features/cursos/types";

type HomeCoursesCarouselProps = Readonly<{
  courses: readonly Curso[];
}>;

export function HomeCoursesCarousel({ courses }: HomeCoursesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (courses.length < 2 || isPaused || reducedMotion) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % courses.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [courses.length, isPaused]);

  if (!courses.length) return null;

  const course = courses[activeIndex]!;
  const move = (direction: number) =>
    setActiveIndex(
      (current) => (current + direction + courses.length) % courses.length,
    );

  return (
    <section
      aria-label="Cursos para explorar"
      className="card home-courses-carousel"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <Link
        aria-label={`Abrir curso: ${course.titulo}`}
        className="home-course-slide"
        href={`/aprendizado/cursos/${course.slug}`}
        key={course.slug}
      >
        <Image
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 48rem) 100vw, 50vw"
          src={course.imagemCapa}
        />
      </Link>

      <div className="home-course-info">
        <div>
          <div className="home-course-info__meta">
            <Badge>{course.dificuldade}</Badge>
            {course.categoria ? <small>{course.categoria}</small> : null}
          </div>
          <strong>{course.titulo}</strong>
          <p>{course.descricao}</p>
        </div>
        {courses.length > 1 ? (
          <div className="home-courses-carousel__controls">
            <button
              aria-label="Curso anterior"
              onClick={() => move(-1)}
              type="button"
            >
              ←
            </button>
            <span>
              {activeIndex + 1} / {courses.length}
            </span>
            <button
              aria-label="Próximo curso"
              onClick={() => move(1)}
              type="button"
            >
              →
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
