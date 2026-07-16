import MiniSearch, { type Options, type SearchResult } from "minisearch";

import type { DocumentoBusca, NomeFiltroBusca } from "../types";

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

export function normalizarTermoBusca(termo: string) {
  return termo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}

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
