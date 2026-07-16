import type { Metadata } from "next";

import { SponsorGrid } from "@features/patrocinadores/components/SponsorGrid";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RevealOnScroll } from "@shared/components/ui/RevealOnScroll";
import { siteConfig } from "@shared/config/site";

export const metadata: Metadata = {
  description:
    "Conheça os patrocinadores e parceiros que apoiam as atividades do GEAR UFMG.",
  openGraph: {
    description:
      "Patrocinadores e parceiros que apoiam as atividades do GEAR UFMG.",
    title: "Patrocinadores e parceiros",
  },
  title: "Patrocinadores e parceiros",
};

export default function PatrocinadoresPage() {
  const linkedin = siteConfig.socialLinks.find(
    (link) => link.label === "LinkedIn",
  );

  return (
    <div className="sponsors-page">
      <Breadcrumbs items={[{ label: "Patrocinadores" }]} />

      <header className="page-heading">
        <p className="status-label">Rede de apoio</p>
        <h1>Patrocinadores e parceiros</h1>
        <p>
          Instituições que apoiam o aprendizado, a pesquisa e o desenvolvimento
          de projetos do GEAR.
        </p>
      </header>

      <RevealOnScroll>
        <SponsorGrid />
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          aria-labelledby="partnership-title"
          className="partnership-callout card"
        >
          <p className="section-index">PARCERIAS</p>
          <h2 id="partnership-title">Converse com o GEAR</h2>
          <p>
            Para iniciar uma conversa institucional sobre apoio ou colaboração,
            use o canal oficial do grupo no LinkedIn.
          </p>
          {linkedin ? (
            <a href={linkedin.href} rel="noreferrer" target="_blank">
              Falar pelo LinkedIn
              <span className="visually-hidden"> (abre em nova aba)</span>
            </a>
          ) : null}
        </section>
      </RevealOnScroll>
    </div>
  );
}
