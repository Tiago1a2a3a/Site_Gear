import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { AulaBanner } from "@features/aulas/components/AulaBanner";
import { AulaBreadcrumbs } from "@features/aulas/components/AulaBreadcrumbs";
import { AulaConteudoMDX } from "@features/aulas/components/AulaConteudoMDX";
import { AulaMetadados } from "@features/aulas/components/AulaMetadados";
import { AulaPreRequisitos } from "@features/aulas/components/AulaPreRequisitos";
import { AulaRecursos } from "@features/aulas/components/AulaRecursos";
import {
  encontrarAulaPorSlug,
  listarContextosDaAula,
  listarAulasPublicadas,
} from "@features/aulas/data/aulas";

type AulaPageProps = Readonly<{
  params: Promise<{ aula: string }>;
}>;

export function generateStaticParams() {
  return listarAulasPublicadas().map((aula) => ({ aula: aula.slug }));
}

export async function generateMetadata({
  params,
}: AulaPageProps): Promise<Metadata> {
  const { aula: slug } = await params;
  const aula = encontrarAulaPorSlug(slug);

  if (!aula) return {};

  return {
    title: aula.titulo,
    description: aula.resumo,
    alternates: { canonical: `/aprendizado/aulas/${aula.slug}` },
    openGraph: {
      title: aula.titulo,
      description: aula.resumo,
      images: [{ url: aula.banner ?? "/images/content/placeholder.svg" }],
      type: "article",
    },
  };
}

export default async function AulaPage({ params }: AulaPageProps) {
  const { aula: slug } = await params;
  const aula = encontrarAulaPorSlug(slug);

  if (!aula) notFound();

  return (
    <article className="lesson-page">
      <Suspense fallback={null}>
        <AulaBreadcrumbs
          contextos={listarContextosDaAula(aula.slug)}
          titulo={aula.titulo}
        />
      </Suspense>
      <header className="lesson-header">
        <p className="status-label">Aula</p>
        <h1>{aula.titulo}</h1>
        <p className="lesson-summary">{aula.resumo}</p>
        <AulaMetadados aula={aula} />
        {aula.tags?.length ? (
          <ul aria-label="Tags" className="tag-list">
            {aula.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </header>
      <AulaBanner banner={aula.banner} titulo={aula.titulo} />
      <div className="lesson-layout">
        <AulaConteudoMDX codigo={aula.conteudo} />
        <aside
          aria-label="Informações complementares"
          className="lesson-sidebar"
        >
          <AulaPreRequisitos slugs={aula.preRequisitos} />
        </aside>
      </div>
      <AulaRecursos aula={aula} />
    </article>
  );
}
