// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  encontrarCursoPorSlug,
  listarCursosPublicados,
  ordenarCursos,
  resolverAulasDoCurso,
  resolverContextoCurso,
} from "@features/cursos/data/cursos";

describe("acesso a Cursos", () => {
  it("lista somente Cursos publicados em ordem determinística", () => {
    const cursos = listarCursosPublicados();

    expect(cursos.map((curso) => curso.slug)).not.toContain("curso-interno");
    expect(cursos).toEqual(ordenarCursos(cursos));
  });

  it("resolve Aulas na ordem exata de aulaSlugs", () => {
    const curso = encontrarCursoPorSlug("fundamentos-arduino");

    expect(curso).toBeDefined();
    expect(resolverAulasDoCurso(curso!).map((aula) => aula.slug)).toEqual(
      curso!.aulaSlugs,
    );
  });

  it("aceita apenas contexto de Trilha que realmente contém o Curso", () => {
    expect(
      resolverContextoCurso("fundamentos-arduino", "robotica-do-zero").trilha
        ?.slug,
    ).toBe("robotica-do-zero");
    expect(
      resolverContextoCurso("fundamentos-arduino", "robos-autonomos").trilha,
    ).toBeUndefined();
  });
});
