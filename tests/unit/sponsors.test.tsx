import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { SponsorStrip } from "@features/patrocinadores/components/SponsorStrip";
import { SponsorGrid } from "@features/patrocinadores/components/SponsorGrid";
import { getSponsors } from "@features/patrocinadores/data/sponsors";
import type { Sponsor } from "@features/patrocinadores/types";

afterEach(cleanup);

const sponsors = [
  {
    name: "Segundo",
    logo: "/images/sponsors/segundo.svg",
    url: "https://example.com/segundo",
    order: 2,
  },
  {
    name: "Primeiro",
    logo: "/images/sponsors/primeiro.svg",
    url: "https://example.com/primeiro",
    tier: "Institucional",
    order: 1,
  },
] as const satisfies readonly Sponsor[];

describe("patrocinadores", () => {
  it("ordena os dados sem alterar a fonte", () => {
    const ordered = getSponsors(sponsors);

    expect(ordered.map((sponsor) => sponsor.name)).toEqual([
      "Primeiro",
      "Segundo",
    ]);
    expect(sponsors[0].name).toBe("Segundo");
  });

  it("rejeita ordem duplicada com mensagem acionável", () => {
    expect(() =>
      getSponsors([sponsors[0], { ...sponsors[1], order: sponsors[0].order }]),
    ).toThrow("ordem 2 está duplicada");
  });

  it("renderiza logos e links externos seguros", () => {
    render(<SponsorStrip sponsors={sponsors} />);

    const link = screen.getByRole("link", {
      name: /Primeiro.*abre em nova aba/,
    });
    expect(link.getAttribute("href")).toBe("https://example.com/primeiro");
    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(screen.getByRole("img", { name: "Logo de Primeiro" })).toBeDefined();
  });

  it("não deixa seção órfã quando a lista está vazia", () => {
    const { container } = render(<SponsorStrip sponsors={[]} />);

    expect(container.innerHTML).toBe("");
  });

  it("apresenta os quatro apoiadores oficiais com a mesma estrutura", () => {
    render(<SponsorStrip />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
    expect(screen.queryByText("Parceiro institucional")).toBeNull();
  });

  it("reutiliza os mesmos dados na faixa e na grade expandida", () => {
    const { rerender } = render(<SponsorStrip sponsors={sponsors} />);
    const linksDaFaixa = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    rerender(<SponsorGrid sponsors={sponsors} />);
    const linksDaGrade = screen
      .getAllByRole("link")
      .map((link) => link.getAttribute("href"));

    expect(linksDaGrade).toEqual(linksDaFaixa);
    expect(screen.getByText("Institucional")).toBeDefined();
  });
});
