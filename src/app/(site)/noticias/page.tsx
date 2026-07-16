import type { Metadata } from "next";

import { NoticiasBusca } from "@features/noticias/components/NoticiasBusca";
import { prepararBuscaNoticias } from "@features/noticias/data/busca-noticias";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  description: "Notícias e atualizações do GEAR UFMG.",
  openGraph: {
    description: "Notícias e atualizações do GEAR UFMG.",
    title: "Notícias",
  },
  title: "Notícias",
};

export default function NoticiasPage() {
  const busca = prepararBuscaNoticias();

  return (
    <div className="news-page">
      <Breadcrumbs items={[{ label: "Notícias" }]} />
      <header className="page-heading">
        <p className="status-label">Atualizações do GEAR</p>
        <h1>Notícias</h1>
        <p>
          Publicações sobre atividades, projetos e novidades do grupo, sem
          misturar resultados com a área de Aprendizado.
        </p>
      </header>
      <NoticiasBusca {...busca} />
    </div>
  );
}
