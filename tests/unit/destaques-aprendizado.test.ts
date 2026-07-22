// @vitest-environment node

import { describe, expect, it } from "vitest";

import { listarDestaquesAleatorios } from "@features/aprendizado/data/conteudosRecentes";

describe("destaques do aprendizado", () => {
  it("combina cursos e trilhas publicados em uma seleção limitada", () => {
    const destaques = listarDestaquesAleatorios(4);

    expect(destaques).toHaveLength(4);
    expect(destaques.some((item) => item.tipo === "Curso")).toBe(true);
    expect(destaques.some((item) => item.tipo === "Trilha")).toBe(true);
    expect(
      destaques.every((item) => item.href.startsWith("/aprendizado/")),
    ).toBe(true);
  });

  it("respeita o limite solicitado", () => {
    expect(listarDestaquesAleatorios(0)).toEqual([]);
  });
});
