// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  encontrarAulaPorSlug,
  listarAulasPublicadas,
  ordenarAulas,
  paginarAulas,
  resolverContextoAula,
} from "@features/aulas/data/aulas";
import type { Aula } from "@features/aulas/types";

function criarAula(slug: string, titulo: string): Aula {
  return {
    slug,
    titulo,
    resumo: "Resumo",
    dificuldade: "iniciante",
    dataPublicacao: "2026-07-15",
    autores: ["Equipe GEAR"],
    status: "publicado",
    permiteComentarios: false,
    conteudo: "",
    sourcePath: `aprendizado/aulas/${slug}`,
  };
}

describe("acesso a Aulas", () => {
  it("lista apenas a saída publicada do Velite em ordem alfabética", () => {
    const aulas = listarAulasPublicadas();

    expect(aulas).toHaveLength(8);
    expect(
      aulas.every(
        (aula) => aula.status === "publicado" && aula.slug !== "em-producao",
      ),
    ).toBe(true);
    expect(aulas).toEqual(ordenarAulas(aulas));
  });

  it("encontra uma Aula publicada por slug e ignora slug inexistente", () => {
    expect(encontrarAulaPorSlug("introducao-robotica")?.titulo).toBe(
      "Introdução à robótica",
    );
    expect(encontrarAulaPorSlug("nao-existe")).toBeUndefined();
  });

  it("pagina coleções grandes e limita páginas fora da faixa", () => {
    const aulas = Array.from({ length: 25 }, (_, indice) =>
      criarAula(`aula-${indice + 1}`, `Aula ${indice + 1}`),
    );

    expect(paginarAulas(aulas, 2).aulas).toHaveLength(12);
    expect(paginarAulas(aulas, 3).aulas).toHaveLength(1);
    expect(paginarAulas(aulas, 99).paginaAtual).toBe(3);
    expect(paginarAulas(aulas, Number.NaN).paginaAtual).toBe(1);
  });

  it("não inventa contexto entre os avisos de produção", () => {
    const contexto = resolverContextoAula(
      "em-producao",
      "em-producao",
      "em-producao",
    );

    expect(contexto.curso).toBeUndefined();
    expect(contexto.trilha).toBeUndefined();
  });
});
