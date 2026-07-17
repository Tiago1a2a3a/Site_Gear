import type { Metadata } from "next";

import { FeaturedNewsCarousel } from "@features/noticias/components/FeaturedNewsCarousel";
import { NoticiasBusca } from "@features/noticias/components/NoticiasBusca";
import { prepararBuscaNoticias } from "@features/noticias/data/busca-noticias";
import { listarNoticiasPublicadas } from "@features/noticias/data/noticias";
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
  const noticiasRecentes = listarNoticiasPublicadas().slice(0, 3);

  return (
    <div className="news-page">
      <Breadcrumbs items={[{ label: "Notícias" }]} />

      <FeaturedNewsCarousel news={noticiasRecentes} />

      <section aria-labelledby="news-history-title" className="news-history">
        <header className="news-history-heading">
          <div>
            <p className="section-index">HISTÓRICO DE NOTÍCIAS</p>
            <h2 id="news-history-title">Outras publicações.</h2>
          </div>
          <p>
            Consulte as atualizações anteriores ou encontre uma publicação pela
            busca.
          </p>
        </header>
        <NoticiasBusca
          {...busca}
          excludedSlugs={noticiasRecentes.map((noticia) => noticia.slug)}
        />
      </section>
    </div>
  );
}
