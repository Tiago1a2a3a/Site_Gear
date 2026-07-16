import { courses, lessons, trails } from "../../../../.velite";

import type { ItemTrilhaResolvido, Trilha } from "../types";

export function ordenarTrilhas(trilhasParaOrdenar: readonly Trilha[]) {
  return [...trilhasParaOrdenar].sort(
    (primeira, segunda) =>
      primeira.ordem - segunda.ordem ||
      primeira.titulo.localeCompare(segunda.titulo, "pt-BR"),
  );
}

export function listarTrilhasPublicadas() {
  return ordenarTrilhas(trails);
}

export function encontrarTrilhaPorSlug(slug: string) {
  return trails.find((trilha) => trilha.slug === slug);
}

export function resolverItensDaTrilha(trilha: Trilha): ItemTrilhaResolvido[] {
  const itens: ItemTrilhaResolvido[] = [];

  for (const item of trilha.itens) {
    if (item.tipo === "curso") {
      const curso = courses.find((entrada) => entrada.slug === item.slug);
      if (curso) {
        itens.push({
          descricao: curso.descricao,
          entidade: curso,
          href: `/aprendizado/cursos/${curso.slug}?trilha=${trilha.slug}`,
          slug: curso.slug,
          tipo: "curso",
          titulo: curso.titulo,
        });
      }
      continue;
    }

    const aula = lessons.find((entrada) => entrada.slug === item.slug);
    if (aula) {
      itens.push({
        descricao: aula.resumo,
        entidade: aula,
        href: `/aprendizado/aulas/${aula.slug}?trilha=${trilha.slug}`,
        slug: aula.slug,
        tipo: "aula",
        titulo: aula.titulo,
      });
    }
  }

  return itens;
}
