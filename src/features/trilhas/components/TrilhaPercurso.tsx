"use client";

import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";
import { useLessonCompletions } from "@shared/lib/supabase/useLessonCompletions";

import type { ItemTrilhaResolvido } from "../types";

export function TrilhaPercurso({
  itens,
}: Readonly<{ itens: readonly ItemTrilhaResolvido[] }>) {
  const completedLessonIds = useLessonCompletions();

  return (
    <section aria-labelledby="percurso-da-trilha" className="trail-path">
      <div className="section-heading learning-section-heading">
        <div>
          <p className="section-index">PERCURSO EM CIRCUITO</p>
          <h2 id="percurso-da-trilha">Ordem de aprendizado</h2>
        </div>
        <p>Cursos e aulas diretas aparecem exatamente na ordem editorial.</p>
      </div>
      <ol className="trail-path-list">
        {itens.map((item, index) => {
          const completed =
            item.tipo === "aula"
              ? completedLessonIds.has(item.slug)
              : item.entidade.aulaSlugs.length > 0 &&
                item.entidade.aulaSlugs.every((slug) =>
                  completedLessonIds.has(slug),
                );

          return (
            <li data-kind={item.tipo} key={`${item.tipo}-${item.slug}`}>
              <span aria-hidden="true" className="circuit-node" />
              <Card
                className={`trail-path-item${completed ? " learning-path-item--completed" : ""}`}
                data-completed={completed || undefined}
              >
                <div className="trail-path-item__index">
                  {String(index + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="learning-path-item__badges">
                    <Badge>
                      {item.tipo === "curso" ? "Curso" : "Aula direta"}
                    </Badge>
                    {completed ? (
                      <span className="learning-completed-badge">
                        {item.tipo === "curso" ? "Concluído" : "Concluída"}
                      </span>
                    ) : null}
                  </div>
                  <h3>{item.titulo}</h3>
                  <p>{item.descricao}</p>
                </div>
                <Link
                  aria-label={`Abrir ${item.tipo}: ${item.titulo}`}
                  className="text-link"
                  href={item.href}
                >
                  Abrir {item.tipo}
                </Link>
              </Card>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
