import { news } from "../../../../.velite";

import type { Noticia } from "../types";

export function ordenarNoticias(noticias: readonly Noticia[]) {
  return [...noticias].sort(
    (primeira, segunda) =>
      segunda.dataPublicacao.localeCompare(primeira.dataPublicacao) ||
      primeira.titulo.localeCompare(segunda.titulo, "pt-BR"),
  );
}

export function listarNoticiasPublicadas() {
  return ordenarNoticias(
    news.filter((noticia) => noticia.status === "publicado"),
  );
}

export function encontrarNoticiaPorSlug(slug: string) {
  return listarNoticiasPublicadas().find((noticia) => noticia.slug === slug);
}
