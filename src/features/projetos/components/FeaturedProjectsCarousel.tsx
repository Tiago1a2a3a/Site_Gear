"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import type { Projeto } from "../types";

type FeaturedProjectsCarouselProps = Readonly<{
  projects: readonly Projeto[];
}>;

export function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      projects.length < 2 ||
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused, projects.length]);

  if (!projects.length) return null;

  const project = projects[activeIndex];
  const image = project.imagens?.[0] ?? "/images/content/placeholder.svg";

  return (
    <section
      aria-labelledby="featured-projects-title"
      className="featured-projects"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="featured-projects-heading">
        <p className="section-index">PARA EXPLORAR</p>
        <h2 id="featured-projects-title">Ideias para conhecer.</h2>
        <p>
          Conheça protótipos desenvolvidos pelo GEAR e acompanhe como pesquisa,
          programação e engenharia se transformam em soluções reais.
        </p>
      </div>

      <Link
        aria-label={`Conhecer projeto: ${project.titulo}`}
        className="featured-project-slide"
        href={`/projetos/${project.slug}`}
        key={project.slug}
      >
        <Image
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 48rem) 100vw, 88rem"
          src={image}
        />
        <span className="featured-project-overlay" />
        <span className="featured-project-content">
          <span className="featured-project-eyebrow">Conheça</span>
          <strong>{project.titulo}</strong>
          <span>{project.descricaoCurta}</span>
        </span>
      </Link>

      {projects.length > 1 ? (
        <div aria-label="Projetos para explorar" className="featured-project-dots">
          {projects.map((item, index) => (
            <button
              aria-label={`Mostrar projeto ${index + 1}: ${item.titulo}`}
              aria-pressed={activeIndex === index}
              className="featured-project-dot"
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
