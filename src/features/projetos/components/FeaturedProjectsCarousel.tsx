"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CarouselPlaybackButton } from "@shared/components/ui/CarouselPlaybackButton";
import { useCarouselPlayback } from "@shared/hooks/useCarouselPlayback";

import type { Projeto } from "../types";

type FeaturedProjectsCarouselProps = Readonly<{
  projects: readonly Projeto[];
}>;

export function FeaturedProjectsCarousel({
  projects,
}: FeaturedProjectsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const playback = useCarouselPlayback(() => {
    setActiveIndex((current) => (current + 1) % projects.length);
  }, projects.length > 1);

  if (!projects.length) return null;

  const project = projects[activeIndex % projects.length];
  const image = project.imagens?.[0] ?? "/images/content/placeholder.svg";

  return (
    <section
      aria-labelledby="featured-projects-title"
      className="featured-projects"
      {...playback.interactionProps}
    >
      <div className="featured-projects-heading">
        <p className="section-index">PARA EXPLORAR</p>
        <h2 id="featured-projects-title">Ideias para conhecer.</h2>
        <p>
          Acompanhe os projetos do GEAR à medida que suas informações forem
          documentadas e publicadas.
        </p>
      </div>

      <Link
        aria-label={`Conhecer projeto: ${project.titulo}`}
        className="featured-project-slide"
        href={`/projetos/${project.slug}`}
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
        <div
          aria-label="Projetos para explorar"
          className="featured-project-dots"
        >
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
      {projects.length > 1 && !playback.reducedMotion ? (
        <CarouselPlaybackButton
          isPlaying={playback.isPlaying}
          onClick={playback.togglePlayback}
        />
      ) : null}
    </section>
  );
}
