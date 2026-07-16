import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjetoDetalhe } from "@features/projetos/components/ProjetoDetalhe";
import {
  encontrarProjetoPorSlug,
  listarProjetos,
} from "@features/projetos/data/projetos";

type ProjetoPageProps = Readonly<{ params: Promise<{ projeto: string }> }>;

export function generateStaticParams() {
  return listarProjetos().map((projeto) => ({ projeto: projeto.slug }));
}

export async function generateMetadata({
  params,
}: ProjetoPageProps): Promise<Metadata> {
  const { projeto: slug } = await params;
  const projeto = encontrarProjetoPorSlug(slug);
  if (!projeto) return {};
  const imagem = projeto.imagens?.[0] ?? "/images/content/placeholder.svg";
  return {
    description: projeto.descricaoCurta,
    openGraph: {
      description: projeto.descricaoCurta,
      images: [imagem],
      title: projeto.titulo,
      type: "article",
    },
    title: projeto.titulo,
  };
}

export default async function ProjetoPage({ params }: ProjetoPageProps) {
  const { projeto: slug } = await params;
  const projeto = encontrarProjetoPorSlug(slug);
  if (!projeto) notFound();
  return <ProjetoDetalhe projeto={projeto} />;
}
