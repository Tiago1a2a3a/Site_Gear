import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CursoDetalhe } from "@features/cursos/components/CursoDetalhe";
import {
  encontrarCursoPorSlug,
  listarContextosDoCurso,
  listarCursosPublicados,
  resolverAulasDoCurso,
  resolverPreRequisitosDoCurso,
} from "@features/cursos/data/cursos";

type CursoPageProps = Readonly<{
  params: Promise<{ curso: string }>;
}>;

export function generateStaticParams() {
  return listarCursosPublicados().map((curso) => ({ curso: curso.slug }));
}

export async function generateMetadata({
  params,
}: CursoPageProps): Promise<Metadata> {
  const { curso: slug } = await params;
  const curso = encontrarCursoPorSlug(slug);

  if (!curso) return {};

  return {
    title: curso.titulo,
    description: curso.descricao,
    alternates: { canonical: `/aprendizado/cursos/${curso.slug}` },
    openGraph: {
      title: curso.titulo,
      description: curso.descricao,
      images: [{ url: curso.imagemCapa }],
      type: "article",
    },
  };
}

export default async function CursoPage({ params }: CursoPageProps) {
  const { curso: slug } = await params;
  const curso = encontrarCursoPorSlug(slug);

  if (!curso) notFound();

  return (
    <CursoDetalhe
      aulas={resolverAulasDoCurso(curso)}
      contextos={listarContextosDoCurso(curso.slug)}
      curso={curso}
      preRequisitos={resolverPreRequisitosDoCurso(curso)}
    />
  );
}
