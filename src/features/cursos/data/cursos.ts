import { courses, lessons, trails } from "../../../../.velite";

import type {
  AulaDoCurso,
  ContextoCurso,
  Curso,
  PreRequisitoCurso,
} from "../types";

export function ordenarCursos(cursos: readonly Curso[]) {
  return [...cursos].sort((primeiro, segundo) =>
    primeiro.titulo.localeCompare(segundo.titulo, "pt-BR"),
  );
}

export function listarCursosPublicados() {
  return ordenarCursos(courses.filter((curso) => curso.status === "publicado"));
}

export function listarCursosEmDestaque(limite = 4) {
  return listarCursosPublicados()
    .filter((curso) => curso.destaque)
    .slice(0, Math.max(0, limite));
}

export function encontrarCursoPorSlug(slug: string) {
  return courses.find((curso) => curso.slug === slug);
}

export function resolverAulasDoCurso(curso: Curso): AulaDoCurso[] {
  const aulaPorSlug = new Map(lessons.map((aula) => [aula.slug, aula]));

  return curso.aulaSlugs.flatMap((slug) => {
    const aula = aulaPorSlug.get(slug);
    return aula ? [aula] : [];
  });
}

export function resolverPreRequisitosDoCurso(
  curso: Curso,
): PreRequisitoCurso[] {
  const preRequisitos: PreRequisitoCurso[] = [];

  for (const slug of curso.preRequisitos ?? []) {
    const aula = lessons.find((item) => item.slug === slug);
    if (aula) {
      preRequisitos.push({
        href: `/aprendizado/aulas/${aula.slug}`,
        slug: aula.slug,
        tipo: "Aula",
        titulo: aula.titulo,
      });
      continue;
    }

    const requisito = courses.find((item) => item.slug === slug);
    if (requisito) {
      preRequisitos.push({
        href: `/aprendizado/cursos/${requisito.slug}`,
        slug: requisito.slug,
        tipo: "Curso",
        titulo: requisito.titulo,
      });
    }
  }

  return preRequisitos;
}

export function resolverContextoCurso(
  cursoSlug: string,
  trilhaSlug?: string,
): ContextoCurso {
  const trilha = trilhaSlug
    ? trails.find(
        (item) =>
          item.slug === trilhaSlug &&
          item.itens.some(
            (entrada) => entrada.tipo === "curso" && entrada.slug === cursoSlug,
          ),
      )
    : undefined;

  return {
    trilha: trilha ? { slug: trilha.slug, titulo: trilha.titulo } : undefined,
  };
}

export function listarContextosDoCurso(cursoSlug: string): ContextoCurso[] {
  return trails.flatMap((trilha) =>
    trilha.itens.some(
      (entrada) => entrada.tipo === "curso" && entrada.slug === cursoSlug,
    )
      ? [{ trilha: { slug: trilha.slug, titulo: trilha.titulo } }]
      : [],
  );
}
