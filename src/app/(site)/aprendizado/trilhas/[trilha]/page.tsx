import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { TrilhaDetalhe } from "@features/trilhas/components/TrilhaDetalhe";
import {
  encontrarTrilhaPorSlug,
  listarTrilhasPublicadas,
  resolverItensDaTrilha,
} from "@features/trilhas/data/trilhas";

type TrilhaPageProps = Readonly<{
  params: Promise<{ trilha: string }>;
}>;

export function generateStaticParams() {
  return listarTrilhasPublicadas().map((trilha) => ({ trilha: trilha.slug }));
}

export async function generateMetadata({
  params,
}: TrilhaPageProps): Promise<Metadata> {
  const { trilha: slug } = await params;
  const trilha = encontrarTrilhaPorSlug(slug);

  if (!trilha) return {};

  return {
    title: trilha.titulo,
    description: trilha.descricaoCurta,
    alternates: { canonical: `/aprendizado/trilhas/${trilha.slug}` },
    openGraph: {
      title: trilha.titulo,
      description: trilha.descricaoCurta,
      images: [{ url: trilha.imagemCapa }],
      type: "article",
    },
  };
}

export default async function TrilhaPage({ params }: TrilhaPageProps) {
  const { trilha: slug } = await params;
  const trilha = encontrarTrilhaPorSlug(slug);

  if (!trilha) notFound();

  return (
    <TrilhaDetalhe itens={resolverItensDaTrilha(trilha)} trilha={trilha} />
  );
}
