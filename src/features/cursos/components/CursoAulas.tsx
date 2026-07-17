"use client";

import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";
import { useLessonCompletions } from "@shared/lib/supabase/useLessonCompletions";

import { CursoAulaLink } from "./CursoAulaLink";
import type { AulaDoCurso, ContextoCurso, Curso } from "../types";

export function CursoAulas({
  aulas,
  curso,
  contextos,
}: Readonly<{
  aulas: readonly AulaDoCurso[];
  curso: Curso;
  contextos: readonly ContextoCurso[];
}>) {
  const completedLessonIds = useLessonCompletions();
  const trilhasValidas = contextos.flatMap((item) =>
    item.trilha ? [item.trilha.slug] : [],
  );

  return (
    <section aria-labelledby="aulas-do-curso" className="course-lessons">
      <div className="section-heading learning-section-heading">
        <div>
          <p className="section-index">SEQUÊNCIA DO CURSO</p>
          <h2 id="aulas-do-curso">Aulas em ordem</h2>
        </div>
        <p>{aulas.length} etapas para concluir este curso.</p>
      </div>
      <ol className="course-lesson-list">
        {aulas.map((aula, index) => {
          const hrefCanonico = `/aprendizado/aulas/${aula.slug}?curso=${curso.slug}`;
          const completed = completedLessonIds.has(aula.slug);

          return (
            <li key={aula.slug}>
              <Card
                className={`course-lesson-item${completed ? " learning-path-item--completed" : ""}`}
                data-completed={completed || undefined}
              >
                <span aria-hidden="true" className="path-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <div className="learning-path-item__badges">
                    <Badge>Aula</Badge>
                    {completed ? (
                      <span className="learning-completed-badge">
                        Concluída
                      </span>
                    ) : null}
                  </div>
                  <h3>{aula.titulo}</h3>
                  <p>{aula.resumo}</p>
                </div>
                <Suspense
                  fallback={
                    <Link
                      aria-label={`Abrir aula: ${aula.titulo}`}
                      className="text-link"
                      href={hrefCanonico}
                    >
                      Abrir aula
                    </Link>
                  }
                >
                  <CursoAulaLink
                    aulaSlug={aula.slug}
                    cursoSlug={curso.slug}
                    titulo={aula.titulo}
                    trilhasValidas={trilhasValidas}
                  />
                </Suspense>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
