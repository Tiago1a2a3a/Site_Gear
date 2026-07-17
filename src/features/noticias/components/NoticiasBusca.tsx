"use client";

import MiniSearch from "minisearch";
import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@shared/components/ui/Button";
import { SearchInput } from "@shared/components/ui/SearchInput";
import { formatarDataLonga } from "@shared/lib/formatar-data";

import { opcoesDoIndiceNoticias } from "../data/busca-noticias";
import type { DocumentoBuscaNoticia } from "../types";

export function NoticiasBusca({
  documentos,
  excludedSlugs = [],
  indiceSerializado,
}: Readonly<{
  documentos: readonly DocumentoBuscaNoticia[];
  excludedSlugs?: readonly string[];
  indiceSerializado: string;
}>) {
  const [termo, setTermo] = useState("");
  const estado = useMemo(() => {
    try {
      if (!termo.trim()) {
        const excluded = new Set(excludedSlugs);
        return {
          erro: false,
          resultados: documentos.filter(
            (documento) => !excluded.has(documento.slug),
          ),
        };
      }
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
  }, [documentos, excludedSlugs, indiceSerializado, termo]);

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
        <ul className="news-history-list">
          {estado.resultados.map((noticia) => (
            <li key={noticia.id}>
              <time dateTime={noticia.dataPublicacao}>
                {formatarDataLonga(noticia.dataPublicacao)}
              </time>
              <div>
                <h3>
                  <Link href={`/noticias/${noticia.slug}`}>
                    {noticia.titulo}
                  </Link>
                </h3>
                <p>{noticia.resumo}</p>
              </div>
              <Button href={`/noticias/${noticia.slug}`} variant="secondary">
                Ler notícia
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="search-state card">
          <h2>Nenhuma notícia encontrada</h2>
          <p>Tente outra palavra ou limpe o termo de busca.</p>
        </div>
      )}
    </div>
  );
}
