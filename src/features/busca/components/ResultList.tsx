import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";
import { formatarDataLonga } from "@shared/lib/formatar-data";

import type { DocumentoBusca } from "../types";

export function ResultList({
  documentos,
}: Readonly<{ documentos: readonly DocumentoBusca[] }>) {
  return (
    <ul className="search-results">
      {documentos.map((documento) => (
        <li key={documento.id}>
          <Card className="search-result-card">
            <div className="search-result-card__meta">
              <Badge>{documento.tipo}</Badge>
              {(documento.area ??
              documento.categoria ??
              documento.dificuldade) ? (
                <span>
                  {documento.area ??
                    documento.categoria ??
                    documento.dificuldade}
                </span>
              ) : null}
              {documento.dataPublicacao ? (
                <time dateTime={documento.dataPublicacao}>
                  {formatarDataLonga(documento.dataPublicacao)}
                </time>
              ) : null}
            </div>
            <h2>
              <Link href={documento.href}>{documento.titulo}</Link>
            </h2>
            <p>{documento.descricao}</p>
            <Link className="text-link" href={documento.href}>
              Abrir {documento.tipo}
            </Link>
          </Card>
        </li>
      ))}
    </ul>
  );
}
