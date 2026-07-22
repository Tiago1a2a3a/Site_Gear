import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import Home from "@app/(site)/page";

afterEach(cleanup);

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
    expect(screen.getByText("Escolhas para você")).toBeDefined();
    expect(screen.getByRole("link", { name: "Explorar" })).toHaveProperty(
      "pathname",
      "/aprendizado",
    );
  });
});
