import type { Metadata } from "next";

import { MemberGrid } from "@features/institucional/components/MemberGrid";
import { ResearchAreaGrid } from "@features/institucional/components/ResearchAreaGrid";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { RevealOnScroll } from "@shared/components/ui/RevealOnScroll";
import { institutionalContent } from "@shared/config/institutional";

export const metadata: Metadata = {
  description:
    "Conheça a missão, as áreas de pesquisa e a equipe do Grupo de Estudos Avançados em Robótica da UFMG.",
  openGraph: {
    description:
      "Missão, áreas de pesquisa e equipe do Grupo de Estudos Avançados em Robótica da UFMG.",
    title: "Sobre o GEAR",
  },
  title: "Sobre o GEAR",
};

export default function SobrePage() {
  return (
    <div className="institutional-page">
      <Breadcrumbs items={[{ label: "Sobre" }]} />

      <header className="page-heading">
        <p className="status-label">GEAR · UFMG</p>
        <h1>Sobre o GEAR</h1>
        <p>{institutionalContent.context}</p>
      </header>

      <RevealOnScroll>
        <section
          aria-labelledby="about-mission-title"
          className="institutional-section"
        >
          <p className="section-index">01 / MISSÃO</p>
          <h2 id="about-mission-title">Robótica feita para compartilhar.</h2>
          <p>{institutionalContent.mission}</p>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          aria-labelledby="about-areas-title"
          className="institutional-section"
        >
          <div className="section-heading">
            <div>
              <p className="section-index">02 / ÁREAS DE PESQUISA</p>
              <h2 id="about-areas-title">Conhecimentos que se conectam.</h2>
            </div>
            <p>
              Frentes que aproximam teoria, experimentação e desenvolvimento de
              soluções em robótica.
            </p>
          </div>
          <ResearchAreaGrid areas={institutionalContent.researchAreas} />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          aria-labelledby="about-members-title"
          className="institutional-section"
        >
          <div className="section-heading">
            <div>
              <p className="section-index">03 / MEMBROS</p>
              <h2 id="about-members-title">Quem constrói o GEAR.</h2>
            </div>
            <p>{institutionalContent.membersIntroduction}</p>
          </div>
          <MemberGrid
            emptyMessage={institutionalContent.membersIntroduction}
            members={institutionalContent.members}
          />
        </section>
      </RevealOnScroll>
    </div>
  );
}
