"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { institutionalContent } from "@shared/config/institutional";

const slides = [
  {
    eyebrow: institutionalContent.eyebrow,
    title: "Conhecimento que",
    accent: "move ideias.",
    description: institutionalContent.heroDescription,
    primary: { href: "/aprendizado", label: "Explorar aprendizado" },
    secondary: { href: "/projetos", label: "Conhecer projetos" },
    mascotTransform: "translate(-50%, 0)",
  },
  {
    eyebrow: "PROJETOS EM CONSTRUCAO",
    title: "Da teoria ao",
    accent: "prototipo.",
    description:
      "Acompanhe ideias que saem do papel e ganham forma nas maos de estudantes do GEAR.",
    primary: { href: "/projetos", label: "Ver projetos" },
    secondary: { href: "/sobre", label: "Conhecer o GEAR" },
    mascotTransform: "translate(0, 0)",
  },
  {
    eyebrow: "APRENDIZADO GEAR",
    title: "Aprender para",
    accent: "transformar.",
    description:
      "Estude, experimente e compartilhe conhecimento para construir solucoes reais em robotica.",
    primary: { href: "/aprendizado", label: "Comecar a aprender" },
    secondary: { href: "/aprendizado/trilhas", label: "Ver trilhas" },
    mascotTransform: "translate(0, -50%)",
  },
] as const;

export function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [isPaused]);

  const slide = slides[activeIndex];

  return (
    <>
      <div
        className="hero-content hero-carousel-content"
        key={activeIndex}
        onFocus={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Badge>{slide.eyebrow}</Badge>
        <h1 id="hero-title">
          {slide.title} <span>{slide.accent}</span>
        </h1>
        <p>{slide.description}</p>
        <div className="hero-actions">
          <Button href={slide.primary.href}>{slide.primary.label}</Button>
          <Button href={slide.secondary.href} variant="secondary">
            {slide.secondary.label}
          </Button>
        </div>
      </div>

      <div
        className="hero-brand-panel hero-carousel-panel"
        key={`panel-${activeIndex}`}
        onFocus={() => setIsPaused(true)}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <Image
          alt="Logo compacto do GEAR"
          className="hero-compact-logo"
          height={120}
          priority={activeIndex === 0}
          src="/images/brand/gear-logo-compact.png"
          width={200}
        />
        <div className="hero-mascot-crop">
          <Image
            alt="Mascote do GEAR"
            className="hero-mascot-sheet"
            height={800}
            priority={activeIndex === 0}
            src="/images/brand/gear-mascot-poses.png"
            style={{ transform: slide.mascotTransform }}
            width={1335}
          />
        </div>
        <p>ROBOTICA · PESQUISA · EDUCACAO</p>
        <div aria-label="Slides do destaque" className="hero-carousel-controls">
          {slides.map((item, index) => (
            <button
              aria-label={`Mostrar destaque ${index + 1}`}
              aria-pressed={activeIndex === index}
              className="hero-carousel-dot"
              key={item.title}
              onClick={() => setActiveIndex(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </>
  );
}
