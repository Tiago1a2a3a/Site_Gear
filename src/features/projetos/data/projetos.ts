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

export function listarProjetosAleatorios(limite = 3) {
  const embaralhados = [...projects];

  for (let indice = embaralhados.length - 1; indice > 0; indice -= 1) {
    const destino = Math.floor(Math.random() * (indice + 1));
    [embaralhados[indice], embaralhados[destino]] = [
      embaralhados[destino]!,
      embaralhados[indice]!,
    ];
  }

  return embaralhados.slice(0, Math.max(0, limite));
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
