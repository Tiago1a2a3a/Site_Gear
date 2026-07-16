import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";

import type { Aula } from "../types";

export function AulaCard({ aula }: Readonly<{ aula: Aula }>) {
  return (
    <Card className="lesson-card">
      <div className="lesson-card__meta">
        <Badge>{aula.dificuldade}</Badge>
        {aula.categoria ? <span>{aula.categoria}</span> : null}
      </div>
      <h2>
        <Link href={`/aprendizado/aulas/${aula.slug}`}>{aula.titulo}</Link>
      </h2>
      <p>{aula.resumo}</p>
      {aula.tags?.length ? (
        <ul aria-label="Tags" className="tag-list">
          {aula.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
      ) : null}
      <Link
        aria-label={`Abrir aula: ${aula.titulo}`}
        className="text-link lesson-card__link"
        href={`/aprendizado/aulas/${aula.slug}`}
      >
        Ler aula
      </Link>
    </Card>
  );
}
