"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

function subscribeMotion(onChange: () => void) {
  const media = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  media?.addEventListener?.("change", onChange);
  return () => media?.removeEventListener?.("change", onChange);
}

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

export function useCarouselPlayback(advance: () => void, enabled = true) {
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () =>
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false,
    () => false,
  );
  const hidden = useSyncExternalStore(
    subscribeVisibility,
    () => document.hidden,
    () => false,
  );
  const isPlaying = !paused && !reducedMotion;

  useEffect(() => {
    if (!enabled || !isPlaying || hovered || focused || hidden) return;
    const timer = window.setTimeout(advance, 5000);
    return () => window.clearTimeout(timer);
  }, [advance, enabled, isPlaying, hovered, focused, hidden]);

  return {
    isPlaying,
    reducedMotion,
    togglePlayback: () => setPaused((value) => !value),
    interactionProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setFocused(true),
      onBlur: (event: React.FocusEvent<HTMLElement>) => {
        if (!event.currentTarget.contains(event.relatedTarget))
          setFocused(false);
      },
    },
  };
}
