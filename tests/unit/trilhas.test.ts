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

    expect(trilhas.map((trilha) => trilha.slug)).toEqual([
      "robotica-do-zero",
      "da-ideia-ao-prototipo",
    ]);
    expect(trilhas).toEqual(ordenarTrilhas(trilhas));
    expect(trilhas.map((trilha) => trilha.ordem)).toEqual([1, 2]);
  });

  it("resolve cursos e aulas diretas na ordem do percurso", () => {
    const trilha = encontrarTrilhaPorSlug("robotica-do-zero");

    expect(trilha).toBeDefined();
    expect(
      resolverItensDaTrilha(trilha!).map((item) => [item.tipo, item.slug]),
    ).toEqual([
      ["curso", "fundamentos-robotica"],
      ["curso", "python-para-robotica"],
      ["aula", "registro-experimentos"],
    ]);
  });
});
