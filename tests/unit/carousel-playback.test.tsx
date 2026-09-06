import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useState } from "react";

import { useCarouselPlayback } from "@shared/hooks/useCarouselPlayback";

function Carousel() {
  const [slide, setSlide] = useState(0);
  const playback = useCarouselPlayback(() => setSlide((value) => value + 1));
  return (
    <section aria-label="Destaques" {...playback.interactionProps}>
      <output>{slide}</output>
      <button onClick={playback.togglePlayback}>
        {playback.isPlaying ? "Pausar" : "Retomar"}
      </button>
      <a href="/aprendizado">Explorar</a>
    </section>
  );
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("reprodução dos carrosséis", () => {
  it("pausa por foco, mouse e controle explícito", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: false }));
    render(<Carousel />);
    const region = screen.getByRole("region");
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("status").textContent).toBe("1");
    fireEvent.focus(screen.getByRole("link"));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("status").textContent).toBe("1");
    fireEvent.blur(screen.getByRole("link"), { relatedTarget: null });
    fireEvent.mouseEnter(region);
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("status").textContent).toBe("1");
    fireEvent.mouseLeave(region);
    fireEvent.click(screen.getByRole("button", { name: "Pausar" }));
    act(() => vi.advanceTimersByTime(10000));
    expect(screen.getByRole("status").textContent).toBe("1");
    fireEvent.click(screen.getByRole("button", { name: "Retomar" }));
    act(() => vi.advanceTimersByTime(5000));
    expect(screen.getByRole("status").textContent).toBe("2");
  });

  it("não avança automaticamente com movimento reduzido", () => {
    vi.useFakeTimers();
    vi.stubGlobal("matchMedia", () => ({ matches: true }));
    render(<Carousel />);
    act(() => vi.advanceTimersByTime(15000));
    expect(screen.getByRole("status").textContent).toBe("0");
  });
});
