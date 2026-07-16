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

    expect(aulas.map((aula) => aula.slug)).not.toContain("rascunho-interno");
    expect(aulas).toEqual(ordenarAulas(aulas));
  });

  it("encontra uma Aula publicada por slug e ignora slug inexistente", () => {
    expect(encontrarAulaPorSlug("introducao-robotica")?.titulo).toContain(
      "robótica",
    );
    expect(encontrarAulaPorSlug("rascunho-interno")).toBeUndefined();
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

  it("preserva somente contextos reais de Curso e Trilha", () => {
    const contexto = resolverContextoAula(
      "fundamentos-eletronica",
      "fundamentos-arduino",
      "robotica-do-zero",
    );

    expect(contexto.curso?.slug).toBe("fundamentos-arduino");
    expect(contexto.trilha?.slug).toBe("robotica-do-zero");
    expect(
      resolverContextoAula(
        "fundamentos-eletronica",
        "fabricacao-digital",
        "robotica-do-zero",
      ).curso,
    ).toBeUndefined();
  });
});
