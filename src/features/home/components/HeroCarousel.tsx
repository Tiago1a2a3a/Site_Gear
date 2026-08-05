"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type TouchEvent } from "react";

import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { institutionalContent } from "@shared/config/institutional";

const slideDurationMs = 5000;
const fadeDurationMs = 220;
const swapPaintDelayMs = 34;
const swipeThresholdPx = 50;

type TransitionState = "idle" | "exiting" | "entering";

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
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [transitionState, setTransitionState] =
    useState<TransitionState>("idle");
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (isPaused || transitionState !== "idle") return;

    const timer = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % slides.length;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        setActiveIndex(nextIndex);
        return;
      }

      setPendingIndex(nextIndex);
      setTransitionState("exiting");
    }, slideDurationMs);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, transitionState]);

  useEffect(() => {
    if (transitionState === "exiting" && pendingIndex !== null) {
      const swapTimer = window.setTimeout(() => {
        setActiveIndex(pendingIndex);
        setTransitionState("entering");
      }, fadeDurationMs);

      return () => window.clearTimeout(swapTimer);
    }

    if (transitionState === "entering") {
      const paintTimer = window.setTimeout(() => {
        setPendingIndex(null);
        setTransitionState("idle");
      }, swapPaintDelayMs);

      return () => window.clearTimeout(paintTimer);
    }
  }, [pendingIndex, transitionState]);

  function showSlide(index: number) {
    if (index === activeIndex || transitionState !== "idle") return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActiveIndex(index);
      return;
    }

    setPendingIndex(index);
    setTransitionState("exiting");
  }

  function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
    const touch = event.touches[0];

    if (!touch) return;

    touchStart.current = { x: touch.clientX, y: touch.clientY };
    setIsPaused(true);
  }

  function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
    const start = touchStart.current;
    const touch = event.changedTouches[0];

    touchStart.current = null;
    setIsPaused(false);

    if (!start || !touch) return;

    const deltaX = touch.clientX - start.x;
    const deltaY = touch.clientY - start.y;

    if (
      Math.abs(deltaX) < swipeThresholdPx ||
      Math.abs(deltaX) <= Math.abs(deltaY)
    ) {
      return;
    }

    event.preventDefault();
    const direction = deltaX < 0 ? -1 : 1;
    showSlide((activeIndex + direction + slides.length) % slides.length);
  }

  function handleTouchCancel() {
    touchStart.current = null;
    setIsPaused(false);
  }

  const slide = slides[activeIndex];

  return (
    <div
      className="hero-carousel-swipe-area"
      onTouchCancel={handleTouchCancel}
      onTouchEnd={handleTouchEnd}
      onTouchStart={handleTouchStart}
    >
      <div
        className="hero-content hero-carousel-content"
        data-transition-state={transitionState}
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
        data-transition-state={transitionState}
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
              onClick={() => showSlide(index)}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
