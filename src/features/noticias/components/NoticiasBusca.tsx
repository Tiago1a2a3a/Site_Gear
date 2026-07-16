"use client";

import MiniSearch from "minisearch";
import { useMemo, useState } from "react";

import { SearchInput } from "@shared/components/ui/SearchInput";

import { NoticiaCard } from "./NoticiaCard";
import { opcoesDoIndiceNoticias } from "../data/busca-noticias";
import type { DocumentoBuscaNoticia } from "../types";

export function NoticiasBusca({
  documentos,
  indiceSerializado,
}: Readonly<{
  documentos: readonly DocumentoBuscaNoticia[];
  indiceSerializado: string;
}>) {
  const [termo, setTermo] = useState("");
  const estado = useMemo(() => {
    try {
      if (!termo.trim()) return { erro: false, resultados: documentos };
      const indice = MiniSearch.loadJSON<DocumentoBuscaNoticia>(
        indiceSerializado,
        opcoesDoIndiceNoticias(),
      );
      const ids = new Set(
        indice
          .search(termo, {
            boost: { titulo: 5, resumo: 2 },
            combineWith: "AND",
            fuzzy: 0.2,
            prefix: true,
          })
          .map((resultado) => String(resultado.id)),
      );
      return {
        erro: false,
        resultados: documentos.filter((documento) => ids.has(documento.id)),
      };
    } catch {
      return { erro: true, resultados: [] };
    }
  }, [documentos, indiceSerializado, termo]);

  return (
    <div className="news-search">
      <SearchInput
        id="busca-noticias"
        onChange={setTermo}
        onClear={() => setTermo("")}
        placeholder="Busque pelo título ou por uma palavra da notícia"
        rotulo="Buscar somente em Notícias"
        valor={termo}
      />

      <p aria-live="polite" className="news-search__count">
        {estado.erro
          ? "Não foi possível carregar a busca"
          : `${estado.resultados.length} notícia${estado.resultados.length === 1 ? "" : "s"}`}
      </p>

      {estado.erro ? (
        <div className="search-state card" role="alert">
          <h2>Não foi possível carregar a busca</h2>
          <p>Atualize a página e tente novamente.</p>
        </div>
      ) : estado.resultados.length ? (
        <div className="news-grid">
          {estado.resultados.map((noticia) => (
            <NoticiaCard key={noticia.id} noticia={noticia} />
          ))}
        </div>
      ) : (
        <div className="search-state card">
          <h2>Nenhuma notícia encontrada</h2>
          <p>Tente outra palavra ou limpe o termo de busca.</p>
        </div>
      )}
    </div>
  );
}
