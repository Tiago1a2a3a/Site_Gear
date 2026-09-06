"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { CarouselPlaybackButton } from "@shared/components/ui/CarouselPlaybackButton";
import { useCarouselPlayback } from "@shared/hooks/useCarouselPlayback";

import type { DestaqueAprendizado } from "@features/aprendizado/data/conteudosRecentes";

type FeaturedCoursesCarouselProps = Readonly<{
  items: readonly DestaqueAprendizado[];
}>;

export function FeaturedCoursesCarousel({
  items,
}: FeaturedCoursesCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const playback = useCarouselPlayback(() => {
    setActiveIndex((current) => (current + 1) % items.length);
  }, items.length > 1);

  if (!items.length) return null;

  const item = items[activeIndex % items.length];

  return (
    <section
      aria-labelledby="featured-courses-title"
      className="featured-courses"
      {...playback.interactionProps}
    >
      <div className="section-heading featured-courses-heading">
        <div>
          <p className="section-index">PARA EXPLORAR</p>
          <h2 id="featured-courses-title">Descubra novos caminhos.</h2>
        </div>
      </div>

      <Link
        aria-label={`Abrir ${item.tipo.toLocaleLowerCase("pt-BR")}: ${item.titulo}`}
        className="featured-course-slide"
        href={item.href}
      >
        <Image
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 48rem) 100vw, 88rem"
          src={item.imagemCapa}
        />
        <span className="featured-course-overlay" />
        <span className="featured-course-title">
          <small>{item.tipo}</small>
          {item.titulo}
        </span>
      </Link>

      {items.length > 1 ? (
        <div
          aria-label="Sugestões para explorar"
          className="featured-course-dots"
        >
          {items.map((item, index) => (
            <button
              aria-label={`Mostrar ${item.tipo.toLocaleLowerCase("pt-BR")} ${index + 1}: ${item.titulo}`}
              aria-pressed={activeIndex === index}
              className="featured-course-dot"
              key={item.href}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
      {items.length > 1 && !playback.reducedMotion ? (
        <CarouselPlaybackButton
          isPlaying={playback.isPlaying}
          onClick={playback.togglePlayback}
        />
      ) : null}
    </section>
  );
}
