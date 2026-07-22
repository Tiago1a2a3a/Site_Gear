// @vitest-environment node

import { performance } from "node:perf_hooks";

import MiniSearch from "minisearch";
import { describe, expect, it } from "vitest";

import {
  criarDocumentosDeBusca,
  criarFiltros,
  criarIndice,
} from "@features/busca/data/indices";
import {
  consultarIndice,
  filtrarDocumentos,
  normalizarTermoBusca,
  opcoesDoIndice,
  ordenarDocumentos,
} from "@features/busca/data/motor";

describe("índices da busca educacional", () => {
  it("normaliza caixa e diacríticos do português", () => {
    expect(normalizarTermoBusca("ROBÓTICA")).toBe("robotica");
    expect(normalizarTermoBusca("Eletrônica")).toBe("eletronica");
  });

  it("gera três coleções segregadas sem rascunhos", () => {
    const documentos = criarDocumentosDeBusca();

    expect(documentos.trilha.every((item) => item.tipo === "trilha")).toBe(
      true,
    );
    expect(documentos.curso.every((item) => item.tipo === "curso")).toBe(true);
    expect(documentos.aula.every((item) => item.tipo === "aula")).toBe(true);
    expect(documentos.trilha.map((item) => item.slug)).not.toContain(
      "trilha-interna",
    );
    expect(documentos.curso.map((item) => item.slug)).not.toContain(
      "curso-interno",
    );
    expect(documentos.aula.map((item) => item.slug)).not.toContain(
      "rascunho-interno",
    );
  });

  it("pesquisa título, resumo, conteúdo e tags com acentos", () => {
    const documentos = criarDocumentosDeBusca();
    const indiceAulas = criarIndice(documentos.aula);

    expect(consultarIndice(indiceAulas, "eletronica").length).toBeGreaterThan(
      0,
    );
    expect(
      consultarIndice(indiceAulas, "sensores processamento atuadores").map(
        (item) => item.id,
      ),
    ).toContain("aula:introducao-robotica");
  });

  it("combina busca e filtros por interseção", () => {
    const cursos = criarDocumentosDeBusca().curso;
    const ids = new Set(
      consultarIndice(criarIndice(cursos), "robotica").map((item) =>
        String(item.id),
      ),
    );
    const encontrados = filtrarDocumentos(
      cursos.filter((curso) => ids.has(curso.id)),
      { dificuldade: ["intermediário"], tag: ["firmware"] },
    );

    expect(encontrados.map((curso) => curso.slug)).toEqual([
      "programacao-robotica",
    ]);
    expect(
      criarFiltros("trilha", criarDocumentosDeBusca().trilha).map(
        (filtro) => filtro.nome,
      ),
    ).toEqual(["area"]);
  });

  it("ordena opções de filtro pela quantidade de usos", () => {
    const filtros = criarFiltros("aula", [
      {
        conteudo: "",
        descricao: "",
        href: "/a",
        id: "aula:a",
        slug: "a",
        tags: ["robotica", "sensores"],
        tipo: "aula",
        titulo: "A",
      },
      {
        conteudo: "",
        descricao: "",
        href: "/b",
        id: "aula:b",
        slug: "b",
        tags: ["robotica"],
        tipo: "aula",
        titulo: "B",
      },
    ]);
    const tags = filtros.find((filtro) => filtro.nome === "tag");

    expect(tags?.opcoes).toEqual(["robotica", "sensores"]);
    expect(tags?.contagens).toEqual({ robotica: 2, sensores: 1 });
  });

  it("ordena resultados por título e data, deixando itens sem data no fim", () => {
    const documentos = [
      {
        conteudo: "",
        dataPublicacao: "2026-01-02",
        descricao: "",
        href: "/z",
        id: "aula:z",
        slug: "z",
        tags: [],
        tipo: "aula" as const,
        titulo: "Zeta",
      },
      {
        conteudo: "",
        dataPublicacao: "2026-02-03",
        descricao: "",
        href: "/a",
        id: "curso:a",
        slug: "a",
        tags: [],
        tipo: "curso" as const,
        titulo: "Alfa",
      },
      {
        conteudo: "",
        descricao: "",
        href: "/b",
        id: "trilha:b",
        slug: "b",
        tags: [],
        tipo: "trilha" as const,
        titulo: "Beta",
      },
    ];

    expect(
      ordenarDocumentos(documentos, "alfabetica").map((item) => item.titulo),
    ).toEqual(["Alfa", "Beta", "Zeta"]);
    expect(
      ordenarDocumentos(documentos, "recentes").map((item) => item.titulo),
    ).toEqual(["Alfa", "Zeta", "Beta"]);
    expect(
      ordenarDocumentos(documentos, "antigas").map((item) => item.titulo),
    ).toEqual(["Zeta", "Alfa", "Beta"]);
  });

  it("mantém índices pequenos e resposta local abaixo da baseline", () => {
    for (const documentos of Object.values(criarDocumentosDeBusca())) {
      const indice = criarIndice(documentos);
      const serializado = JSON.stringify(indice);
      expect(Buffer.byteLength(serializado)).toBeLessThan(250_000);

      const recarregado = MiniSearch.loadJSON(serializado, opcoesDoIndice());
      const inicio = performance.now();
      for (let tentativa = 0; tentativa < 100; tentativa += 1) {
        consultarIndice(recarregado, "robotica sensores");
      }
      expect((performance.now() - inicio) / 100).toBeLessThan(100);
    }
  });
});
