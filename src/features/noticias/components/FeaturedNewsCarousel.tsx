"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { formatarDataLonga } from "@shared/lib/formatar-data";

import type { Noticia } from "../types";

export function FeaturedNewsCarousel({
  news,
}: Readonly<{ news: readonly Noticia[] }>) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (
      news.length < 2 ||
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % news.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused, news.length]);

  if (!news.length) return null;
  const item = news[activeIndex];

  return (
    <section
      aria-labelledby="featured-news-title"
      className="featured-news"
      onFocus={() => setIsPaused(true)}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="featured-news-heading">
        <p className="section-index">NOTÍCIAS EM DESTAQUE</p>
        <h2 id="featured-news-title">Acompanhe as novidades.</h2>
        <p>
          Veja as publicações mais recentes sobre atividades, projetos e
          encontros do GEAR.
        </p>
      </div>

      <Link
        aria-label={`Ler notícia: ${item.titulo}`}
        className="featured-news-slide"
        href={`/noticias/${item.slug}`}
        key={item.slug}
      >
        <Image
          alt=""
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 48rem) 100vw, 88rem"
          src={item.imagemCapa}
        />
        <span className="featured-news-overlay" />
        <span className="featured-news-content">
          <span className="featured-news-eyebrow">
            {item.categoria ?? "Notícia"} ·{" "}
            {formatarDataLonga(item.dataPublicacao)}
          </span>
          <strong>{item.titulo}</strong>
          <span>{item.resumo}</span>
        </span>
      </Link>

      {news.length > 1 ? (
        <div aria-label="Notícias em destaque" className="featured-news-dots">
          {news.map((newsItem, index) => (
            <button
              aria-label={`Mostrar notícia ${index + 1}: ${newsItem.titulo}`}
              aria-pressed={activeIndex === index}
              className="featured-news-dot"
              key={newsItem.slug}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
