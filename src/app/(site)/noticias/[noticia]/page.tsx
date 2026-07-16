import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { NoticiaDetalhe } from "@features/noticias/components/NoticiaDetalhe";
import {
  encontrarNoticiaPorSlug,
  listarNoticiasPublicadas,
} from "@features/noticias/data/noticias";

type NoticiaPageProps = Readonly<{ params: Promise<{ noticia: string }> }>;

export function generateStaticParams() {
  return listarNoticiasPublicadas().map((noticia) => ({
    noticia: noticia.slug,
  }));
}

export async function generateMetadata({
  params,
}: NoticiaPageProps): Promise<Metadata> {
  const { noticia: slug } = await params;
  const noticia = encontrarNoticiaPorSlug(slug);
  if (!noticia) return {};
  return {
    description: noticia.resumo,
    openGraph: {
      description: noticia.resumo,
      images: [noticia.imagemCapa],
      title: noticia.titulo,
      type: "article",
    },
    title: noticia.titulo,
  };
}

export default async function NoticiaPage({ params }: NoticiaPageProps) {
  const { noticia: slug } = await params;
  const noticia = encontrarNoticiaPorSlug(slug);
  if (!noticia) notFound();
  return <NoticiaDetalhe noticia={noticia} />;
}
