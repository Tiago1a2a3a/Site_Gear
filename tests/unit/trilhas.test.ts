// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  encontrarTrilhaPorSlug,
  listarTrilhasPublicadas,
  ordenarTrilhas,
  resolverItensDaTrilha,
} from "@features/trilhas/data/trilhas";

describe("acesso a Trilhas", () => {
  it("lista somente Trilhas publicadas pelo campo ordem", () => {
    const trilhas = listarTrilhasPublicadas();

    expect(trilhas.map((trilha) => trilha.slug)).not.toContain(
      "trilha-interna",
    );
    expect(trilhas).toEqual(ordenarTrilhas(trilhas));
    expect(trilhas.map((trilha) => trilha.ordem)).toEqual([1, 2, 3, 4]);
  });

  it("resolve Curso e Aula direta sem alterar a ordem discriminada", () => {
    const trilha = encontrarTrilhaPorSlug("robotica-do-zero");

    expect(trilha).toBeDefined();
    const itens = resolverItensDaTrilha(trilha!);
    expect(itens.map(({ tipo, slug }) => ({ tipo, slug }))).toEqual(
      trilha!.itens,
    );
    expect(itens[0].href).toBe(
      "/aprendizado/aulas/seguranca-laboratorio?trilha=robotica-do-zero",
    );
    expect(itens[1].href).toBe(
      "/aprendizado/cursos/fundamentos-arduino?trilha=robotica-do-zero",
    );
  });
});
