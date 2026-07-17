import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@shared/components/ui/Badge";

import { CursoAulas } from "./CursoAulas";
import { CursoBreadcrumbs } from "./CursoBreadcrumbs";
import type {
  AulaDoCurso,
  ContextoCurso,
  Curso,
  PreRequisitoCurso,
} from "../types";

export function CursoDetalhe({
  aulas,
  contextos,
  curso,
  personalAction,
  preRequisitos,
}: Readonly<{
  aulas: readonly AulaDoCurso[];
  contextos: readonly ContextoCurso[];
  curso: Curso;
  personalAction?: React.ReactNode;
  preRequisitos: readonly PreRequisitoCurso[];
}>) {
  return (
    <article className="learning-detail-page">
      <Suspense fallback={null}>
        <CursoBreadcrumbs contextos={contextos} titulo={curso.titulo} />
      </Suspense>
      <header className="learning-detail-header">
        <div>
          <p className="status-label">Curso</p>
          <h1>{curso.titulo}</h1>
          <p>{curso.descricao}</p>
          <div className="learning-detail-meta">
            <Badge>{curso.dificuldade}</Badge>
            {curso.categoria ? <span>{curso.categoria}</span> : null}
            <span>{aulas.length} aulas</span>
          </div>
          {curso.tags?.length ? (
            <ul aria-label="Tags" className="tag-list">
              {curso.tags.map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
          {personalAction}
        </div>
        <div className="learning-detail-cover">
          <Image
            alt={`Capa do curso ${curso.titulo}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 42vw"
            src={curso.imagemCapa}
          />
        </div>
      </header>

      {preRequisitos.length ? (
        <section
          aria-labelledby="pre-requisitos-curso"
          className="prerequisite-panel"
        >
          <h2 id="pre-requisitos-curso">Pré-requisitos</h2>
          <ul>
            {preRequisitos.map((item) => (
              <li key={`${item.tipo}-${item.slug}`}>
                <Badge>{item.tipo}</Badge>{" "}
                <Link href={item.href}>{item.titulo}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <CursoAulas aulas={aulas} curso={curso} contextos={contextos} />
    </article>
  );
}
