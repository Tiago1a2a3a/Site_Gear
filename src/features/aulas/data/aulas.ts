import { courses, lessons, trails } from "../../../../.velite";

import type { Aula, ContextoAula, PaginaDeAulas } from "../types";

export const AULAS_POR_PAGINA = 12;

export function ordenarAulas(aulas: readonly Aula[]) {
  return [...aulas].sort((primeira, segunda) =>
    primeira.titulo.localeCompare(segunda.titulo, "pt-BR"),
  );
}

export function listarAulasPublicadas() {
  return ordenarAulas(lessons);
}

export function encontrarAulaPorSlug(slug: string) {
  return lessons.find((aula) => aula.slug === slug);
}

export function resolverContextoAula(
  aulaSlug: string,
  cursoSlug?: string,
  trilhaSlug?: string,
): ContextoAula {
  const curso = cursoSlug
    ? courses.find(
        (item) => item.slug === cursoSlug && item.aulaSlugs.includes(aulaSlug),
      )
    : undefined;
  const trilha = trilhaSlug
    ? trails.find(
        (item) =>
          item.slug === trilhaSlug &&
          item.itens.some((entrada) =>
            curso
              ? entrada.tipo === "curso" && entrada.slug === curso.slug
              : entrada.tipo === "aula" && entrada.slug === aulaSlug,
          ),
      )
    : undefined;

  return {
    curso: curso ? { slug: curso.slug, titulo: curso.titulo } : undefined,
    trilha: trilha ? { slug: trilha.slug, titulo: trilha.titulo } : undefined,
  };
}

export function listarContextosDaAula(aulaSlug: string): ContextoAula[] {
  const contextos: ContextoAula[] = [];

  for (const curso of courses.filter((item) =>
    item.aulaSlugs.includes(aulaSlug),
  )) {
    const contextoCurso = { slug: curso.slug, titulo: curso.titulo };
    contextos.push({ curso: contextoCurso });

    for (const trilha of trails.filter((item) =>
      item.itens.some(
        (entrada) => entrada.tipo === "curso" && entrada.slug === curso.slug,
      ),
    )) {
      contextos.push({
        curso: contextoCurso,
        trilha: { slug: trilha.slug, titulo: trilha.titulo },
      });
    }
  }

  for (const trilha of trails.filter((item) =>
    item.itens.some(
      (entrada) => entrada.tipo === "aula" && entrada.slug === aulaSlug,
    ),
  )) {
    contextos.push({
      trilha: { slug: trilha.slug, titulo: trilha.titulo },
    });
  }

  return contextos;
}

export function paginarAulas(
  aulas: readonly Aula[],
  paginaSolicitada: number,
  porPagina = AULAS_POR_PAGINA,
): PaginaDeAulas {
  const totalDePaginas = Math.max(1, Math.ceil(aulas.length / porPagina));
  const paginaAtual = Math.min(
    Math.max(Math.trunc(paginaSolicitada) || 1, 1),
    totalDePaginas,
  );
  const inicio = (paginaAtual - 1) * porPagina;

  return {
    aulas: aulas.slice(inicio, inicio + porPagina),
    paginaAtual,
    totalDePaginas,
    totalDeAulas: aulas.length,
  };
}
