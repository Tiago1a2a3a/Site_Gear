import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { formatarDataLonga } from "@shared/lib/formatar-data";

import type { DocumentoBusca } from "../types";

function classeDaDificuldade(valor?: string) {
  const nivel = valor
    ?.normalize("NFD")
    .replaceAll(/[\u0300-\u036f]/g, "")
    .toLowerCase();

  if (
    nivel === "iniciante" ||
    nivel === "intermediario" ||
    nivel === "avancado"
  ) {
    return `search-result-card__difficulty--${nivel}`;
  }

  return "search-result-card__difficulty--padrao";
}

export function ResultList({
  documentos,
}: Readonly<{ documentos: readonly DocumentoBusca[] }>) {
  return (
    <ul className="search-results">
      {documentos.map((documento) => (
        <li key={documento.id}>
          <Link
            aria-label={`Abrir ${documento.tipo}: ${documento.titulo}`}
            className="card search-result-card"
            href={documento.href}
          >
            <div className="search-result-card__meta">
              <Badge
                className={`search-result-card__difficulty ${classeDaDificuldade(documento.dificuldade)}`}
              >
                {documento.dificuldade ?? documento.tipo}
              </Badge>
              {(documento.area ?? documento.categoria) ? (
                <span className="search-result-card__area">
                  {documento.area ?? documento.categoria}
                </span>
              ) : null}
              {documento.dataPublicacao ? (
                <time dateTime={documento.dataPublicacao}>
                  {formatarDataLonga(documento.dataPublicacao)}
                </time>
              ) : null}
            </div>
            <h2>{documento.titulo}</h2>
            {documento.tags.length ? (
              <ul
                aria-label="Tags"
                className="tag-list search-result-card__tags"
              >
                {documento.tags.slice(0, 3).map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </Link>
        </li>
      ))}
    </ul>
  );
}
