"use client";

import { useEffect, useRef } from "react";

type RevealOnScrollProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Keep server-rendered content visible; only animate offscreen sections.
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ||
      element.getBoundingClientRect().top < window.innerHeight
    )
      return;

    element.classList.add("scroll-reveal--pending");
    const reveal = () => {
      element.classList.remove("scroll-reveal--pending");
      observer.disconnect();
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        reveal();
      },
      { threshold: 0, rootMargin: "0px 0px 32px" },
    );

    observer.observe(element);
    element.addEventListener("focusin", reveal);
    return () => {
      observer.disconnect();
      element.removeEventListener("focusin", reveal);
      element.classList.remove("scroll-reveal--pending");
    };
  }, []);

  return (
    <div
      className={["scroll-reveal", className].filter(Boolean).join(" ")}
      ref={elementRef}
    >
      {children}
    </div>
  );
}
