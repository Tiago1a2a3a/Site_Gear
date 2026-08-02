import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import Home from "@app/(site)/page";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe("Home", () => {
  it("apresenta o GEAR e direciona para os dois fluxos principais", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Conhecimento que move ideias.",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("link", { name: "Explorar aprendizado" }),
    ).toHaveProperty("pathname", "/aprendizado");
    expect(
      screen.getByRole("link", { name: "Conhecer projetos" }),
    ).toHaveProperty("pathname", "/projetos");
  });

  it("usa conteúdo institucional e estados vazios intencionais", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Robótica feita para compartilhar.",
      }),
    ).toBeDefined();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Pessoas que movem o grupo.",
      }),
    ).toBeDefined();
    expect(screen.getByText("Equipe em atualização")).toBeDefined();
    expect(screen.getByRole("button", { name: "Próximo curso" })).toBeDefined();
    expect(
      screen.getByRole("link", { name: /^Abrir curso:/ }),
    ).toHaveProperty("pathname", expect.stringMatching(/^\/aprendizado\/cursos\//));
  });

  it("faz fade-out antes de trocar o destaque e fade-in depois", () => {
    vi.useFakeTimers();
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: false })),
    );
    render(<Home />);

    const heading = screen.getByRole("heading", {
      level: 1,
      name: "Conhecimento que move ideias.",
    });
    const content = heading.closest(".hero-carousel-content");

    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar destaque 2" }),
    );

    expect(content?.getAttribute("data-transition-state")).toBe("exiting");
    expect(heading.textContent).toBe("Conhecimento que move ideias.");

    act(() => vi.advanceTimersByTime(220));

    expect(content?.getAttribute("data-transition-state")).toBe("entering");
    expect(heading.textContent).toBe("Da teoria ao prototipo.");

    act(() => vi.advanceTimersByTime(34));

    expect(content?.getAttribute("data-transition-state")).toBe("idle");
  });
});
