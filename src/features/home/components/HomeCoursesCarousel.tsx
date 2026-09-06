"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CarouselPlaybackButton } from "@shared/components/ui/CarouselPlaybackButton";
import { useCarouselPlayback } from "@shared/hooks/useCarouselPlayback";

import { Badge } from "@shared/components/ui/Badge";

type Curso = Readonly<{
  slug: string;
  titulo: string;
  descricao: string;
  dificuldade: string;
  categoria?: string;
  imagemCapa: string;
}>;

type HomeCoursesCarouselProps = Readonly<{
  courses: readonly Curso[];
}>;

export function HomeCoursesCarousel({ courses }: HomeCoursesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const playback = useCarouselPlayback(() => {
    setActiveIndex((current) => (current + 1) % courses.length);
  }, courses.length > 1);

  if (!courses.length) return null;

  const course = courses[activeIndex % courses.length]!;
  const move = (direction: number) =>
    setActiveIndex(
      (current) => (current + direction + courses.length) % courses.length,
    );

  return (
    <section
      aria-label="Cursos para explorar"
      className="card home-courses-carousel"
      {...playback.interactionProps}
    >
      <Link
        aria-label={`Abrir curso: ${course.titulo}`}
        className="home-course-slide"
        href={`/aprendizado/cursos/${course.slug}`}
      >
        <Image
          alt=""
          fill
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
          <h2>
            <Link href={`/aprendizado/cursos/${course.slug}`}>
              {course.titulo}
            </Link>
          </h2>
          <p>{course.descricao}</p>
        </div>
        <div className="home-course-info__footer">
          <Link
            className="text-link"
            href={`/aprendizado/cursos/${course.slug}`}
          >
            Ver curso
          </Link>
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
      </div>
      {courses.length > 1 && !playback.reducedMotion ? (
        <CarouselPlaybackButton
          isPlaying={playback.isPlaying}
          onClick={playback.togglePlayback}
        />
      ) : null}
    </section>
  );
}
