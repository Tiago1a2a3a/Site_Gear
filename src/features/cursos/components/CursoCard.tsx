import Image from "next/image";
import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";

import type { Curso } from "../types";

export function CursoCard({ curso }: Readonly<{ curso: Curso }>) {
  return (
    <Card className="learning-card">
      <Link
        aria-label={`Abrir curso: ${curso.titulo}`}
        className="learning-card__image"
        href={`/aprendizado/cursos/${curso.slug}`}
      >
        <Image
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={curso.imagemCapa}
        />
      </Link>
      <div className="learning-card__body">
        <div className="learning-card__meta">
          <Badge>{curso.dificuldade}</Badge>
          {curso.categoria ? <span>{curso.categoria}</span> : null}
        </div>
        <h2>
          <Link href={`/aprendizado/cursos/${curso.slug}`}>{curso.titulo}</Link>
        </h2>
        <p>{curso.descricao}</p>
        {curso.tags?.length ? (
          <ul aria-label="Tags" className="tag-list">
            {curso.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        <Link
          className="text-link learning-card__link"
          href={`/aprendizado/cursos/${curso.slug}`}
        >
          Ver curso
        </Link>
      </div>
    </Card>
  );
}
