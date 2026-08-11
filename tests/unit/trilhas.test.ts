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

    expect(trilhas.map((trilha) => trilha.slug)).toEqual(["em-producao"]);
    expect(trilhas).toEqual(ordenarTrilhas(trilhas));
    expect(trilhas.map((trilha) => trilha.ordem)).toEqual([0]);
  });

  it("mantém o aviso sem inventar etapas de aprendizado", () => {
    const trilha = encontrarTrilhaPorSlug("em-producao");

    expect(trilha).toBeDefined();
    expect(resolverItensDaTrilha(trilha!)).toEqual([]);
  });
});
