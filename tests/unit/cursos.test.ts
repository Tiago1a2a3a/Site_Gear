// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  encontrarCursoPorSlug,
  listarCursosAleatorios,
  listarCursosPublicados,
  ordenarCursos,
  resolverAulasDoCurso,
  resolverContextoCurso,
} from "@features/cursos/data/cursos";

describe("acesso a Cursos", () => {
  it("lista somente Cursos publicados em ordem determinística", () => {
    const cursos = listarCursosPublicados();

    expect(cursos.map((curso) => curso.slug)).toEqual(["em-producao"]);
    expect(cursos).toEqual(ordenarCursos(cursos));
  });

  it("sorteia somente os cursos publicados com imagem de capa", () => {
    const cursos = listarCursosAleatorios();

    expect(cursos).toHaveLength(1);
    expect(
      cursos.every(
        (curso) =>
          listarCursosPublicados().some((item) => item.slug === curso.slug) &&
          !curso.imagemCapa.endsWith("/placeholder.svg"),
      ),
    ).toBe(true);
  });

  it("resolve Aulas na ordem exata de aulaSlugs", () => {
    const curso = encontrarCursoPorSlug("em-producao");

    expect(curso).toBeDefined();
    expect(resolverAulasDoCurso(curso!)).toEqual([]);
  });

  it("não inventa contexto entre os avisos de produção", () => {
    expect(
      resolverContextoCurso("em-producao", "em-producao").trilha,
    ).toBeUndefined();
  });
});
