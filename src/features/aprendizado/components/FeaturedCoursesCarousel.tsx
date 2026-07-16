"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Curso } from "../../../../.velite";

type FeaturedCoursesCarouselProps = Readonly<{
  courses: readonly Curso[];
}>;

export function FeaturedCoursesCarousel({
  courses,
}: FeaturedCoursesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (courses.length < 2 || isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % courses.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [courses.length, isPaused]);

  if (!courses.length) return null;

  const course = courses[activeIndex];

  return (
    <section
      aria-labelledby="featured-courses-title"
      className="featured-courses"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="section-heading featured-courses-heading">
        <div>
          <p className="section-index">CURSOS EM DESTAQUE</p>
          <h2 id="featured-courses-title">Aprenda por projetos.</h2>
        </div>
      </div>

      <Link
        aria-label={`Abrir curso: ${course.titulo}`}
        className="featured-course-slide"
        href={`/aprendizado/cursos/${course.slug}`}
        key={course.slug}
      >
        <Image
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 48rem) 100vw, 88rem"
          src={course.imagemCapa}
        />
        <span className="featured-course-overlay" />
        <span className="featured-course-title">{course.titulo}</span>
      </Link>

      {courses.length > 1 ? (
        <div aria-label="Cursos em destaque" className="featured-course-dots">
          {courses.map((item, index) => (
            <button
              aria-label={`Mostrar curso ${index + 1}: ${item.titulo}`}
              aria-pressed={activeIndex === index}
              className="featured-course-dot"
              key={item.slug}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
