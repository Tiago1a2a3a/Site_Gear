import { projects } from "../../../../.velite";

import type { Projeto } from "../types";

export function ordenarProjetos(projetos: readonly Projeto[]) {
  return [...projetos].sort((primeiro, segundo) =>
    primeiro.titulo.localeCompare(segundo.titulo, "pt-BR"),
  );
}

export function listarProjetos() {
  return ordenarProjetos(projects);
}

export function encontrarProjetoPorSlug(slug: string) {
  return projects.find((projeto) => projeto.slug === slug);
}

export function listarProjetosEmDestaque(limite = 3) {
  return ordenarProjetos(projects.filter((projeto) => projeto.destaque)).slice(
    0,
    Math.max(0, limite),
  );
}
