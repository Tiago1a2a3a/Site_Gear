import Link from "next/link";

import { encontrarAulaPorSlug } from "../data/aulas";

export function AulaPreRequisitos({
  slugs,
}: Readonly<{ slugs?: readonly string[] }>) {
  const aulas = (slugs ?? [])
    .map((slug) => encontrarAulaPorSlug(slug))
    .filter((aula) => aula !== undefined);

  if (aulas.length === 0) return null;

  return (
    <section aria-labelledby="pre-requisitos" className="lesson-support-card">
      <h2 id="pre-requisitos">Pré-requisitos</h2>
      <ul>
        {aulas.map((aula) => (
          <li key={aula.slug}>
            <Link href={`/aprendizado/aulas/${aula.slug}`}>{aula.titulo}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
