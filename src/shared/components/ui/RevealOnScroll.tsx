"use client";

import { useEffect, useRef, useState } from "react";

type RevealOnScrollProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function RevealOnScroll({ children, className }: RevealOnScrollProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      const timeoutId = window.setTimeout(() => setIsVisible(true), 0);
      return () => window.clearTimeout(timeoutId);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setIsVisible(true);
        observer.disconnect();
      },
      { threshold: 0.14, rootMargin: "0px 0px -8%" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className={[
        "scroll-reveal",
        isVisible && "scroll-reveal--visible",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      ref={elementRef}
    >
      {children}
    </div>
  );
}
