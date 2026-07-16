import MiniSearch, { type Options } from "minisearch";

import { normalizarTermoBusca } from "@shared/lib/busca";
import { extrairTextoDoMdx } from "@shared/lib/texto-mdx";

import { listarNoticiasPublicadas } from "./noticias";
import type { DocumentoBuscaNoticia, Noticia } from "../types";

export function opcoesDoIndiceNoticias(): Options<DocumentoBuscaNoticia> {
  return {
    fields: ["titulo", "resumo", "conteudo"],
    idField: "id",
    processTerm: normalizarTermoBusca,
    storeFields: [
      "dataPublicacao",
      "href",
      "imagemCapa",
      "resumo",
      "slug",
      "titulo",
    ],
  };
}

export function criarDocumentosDeNoticias(
  noticias: readonly Noticia[] = listarNoticiasPublicadas(),
): DocumentoBuscaNoticia[] {
  return noticias
    .filter((noticia) => noticia.status === "publicado")
    .map((noticia) => ({
      conteudo: extrairTextoDoMdx(noticia.conteudo),
      dataPublicacao: noticia.dataPublicacao,
      href: `/noticias/${noticia.slug}`,
      id: `noticia:${noticia.slug}`,
      imagemCapa: noticia.imagemCapa,
      resumo: noticia.resumo,
      slug: noticia.slug,
      titulo: noticia.titulo,
    }));
}

export function criarIndiceNoticias(
  documentos: readonly DocumentoBuscaNoticia[],
) {
  const indice = new MiniSearch<DocumentoBuscaNoticia>(
    opcoesDoIndiceNoticias(),
  );
  indice.addAll([...documentos]);
  return indice;
}

export function prepararBuscaNoticias() {
  const documentos = criarDocumentosDeNoticias();
  return {
    documentos,
    indiceSerializado: JSON.stringify(criarIndiceNoticias(documentos)),
  };
}
