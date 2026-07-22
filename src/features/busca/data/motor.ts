import MiniSearch, { type Options, type SearchResult } from "minisearch";

import { normalizarTermoBusca } from "@shared/lib/busca";

import type {
  DocumentoBusca,
  NomeFiltroBusca,
  OrdemResultados,
} from "../types";

export { normalizarTermoBusca } from "@shared/lib/busca";

const camposIndexados = ["titulo", "descricao", "conteudo", "tags"];
const camposArmazenados = [
  "area",
  "categoria",
  "descricao",
  "dificuldade",
  "href",
  "slug",
  "tags",
  "tipo",
  "titulo",
];

export function opcoesDoIndice(): Options<DocumentoBusca> {
  return {
    fields: camposIndexados,
    idField: "id",
    processTerm: normalizarTermoBusca,
    storeFields: camposArmazenados,
  };
}

export function consultarIndice(
  indice: MiniSearch<DocumentoBusca>,
  termo: string,
) {
  if (!termo.trim()) return [];
  return indice.search(termo, {
    boost: { titulo: 4, descricao: 2, tags: 2 },
    combineWith: "AND",
    fuzzy: 0.2,
    prefix: true,
  });
}

export function filtrarDocumentos(
  documentos: readonly DocumentoBusca[],
  filtros: Readonly<Partial<Record<NomeFiltroBusca, readonly string[]>>>,
) {
  return documentos.filter((documento) =>
    Object.entries(filtros).every(([nome, selecionados]) => {
      if (!selecionados?.length) return true;
      const valor =
        nome === "tag"
          ? documento.tags
          : documento[nome as Exclude<NomeFiltroBusca, "tag">];
      if (!valor) return false;
      return typeof valor === "string"
        ? selecionados.includes(valor)
        : selecionados.some((selecionado) => valor.includes(selecionado));
    }),
  );
}

export function idsDosResultados(resultados: readonly SearchResult[]) {
  return new Set(resultados.map((resultado) => String(resultado.id)));
}

export function ordenarDocumentos(
  documentos: readonly DocumentoBusca[],
  ordem: OrdemResultados,
) {
  return [...documentos].sort((primeiro, segundo) => {
    if (ordem === "alfabetica") {
      return primeiro.titulo.localeCompare(segundo.titulo, "pt-BR");
    }

    if (!primeiro.dataPublicacao && !segundo.dataPublicacao) {
      return primeiro.titulo.localeCompare(segundo.titulo, "pt-BR");
    }
    if (!primeiro.dataPublicacao) return 1;
    if (!segundo.dataPublicacao) return -1;

    const comparacao = primeiro.dataPublicacao.localeCompare(
      segundo.dataPublicacao,
    );
    return (
      (ordem === "recentes" ? -comparacao : comparacao) ||
      primeiro.titulo.localeCompare(segundo.titulo, "pt-BR")
    );
  });
}
