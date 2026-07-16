import { HeroCarousel } from "@features/home/components/HeroCarousel";
import { MemberGrid } from "@features/institucional/components/MemberGrid";
import { ResearchAreaGrid } from "@features/institucional/components/ResearchAreaGrid";
import { ProjetoCard } from "@features/projetos/components/ProjetoCard";
import { listarProjetosEmDestaque } from "@features/projetos/data/projetos";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";
import { RevealOnScroll } from "@shared/components/ui/RevealOnScroll";
import { institutionalContent } from "@shared/config/institutional";

export default function Home() {
  const projetosEmDestaque = listarProjetosEmDestaque(3);

  return (
    <div className="home-page">
      <section aria-labelledby="hero-title" className="hero">
        <div aria-hidden="true" className="circuit-signature">
          <span />
          <span />
          <span />
        </div>
        <HeroCarousel />
      </section>

      <RevealOnScroll>
        <section
          aria-labelledby="mission-title"
          className="home-section mission"
        >
          <p className="section-index">01 / MISSÃO</p>
          <div>
            <h2 id="mission-title">Robótica feita para compartilhar.</h2>
            <p>{institutionalContent.mission}</p>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section aria-labelledby="research-title" className="home-section">
          <div className="section-heading">
            <div>
              <p className="section-index">02 / ÁREAS DE PESQUISA</p>
              <h2 id="research-title">Da teoria ao protótipo.</h2>
            </div>
            <p>
              Frentes que conectam diferentes conhecimentos para investigar,
              construir e ensinar robótica.
            </p>
          </div>
          <ResearchAreaGrid areas={institutionalContent.researchAreas} />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section aria-labelledby="home-members-title" className="home-section">
          <div className="section-heading">
            <div>
              <p className="section-index">03 / MEMBROS</p>
              <h2 id="home-members-title">Pessoas que movem o grupo.</h2>
            </div>
            <p>{institutionalContent.membersIntroduction}</p>
          </div>
          <MemberGrid
            emptyMessage={institutionalContent.membersIntroduction}
            members={institutionalContent.members}
          />
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          aria-labelledby="paths-title"
          className="home-section paths-section"
        >
          <div className="section-heading">
            <div>
              <p className="section-index">04 / PRÓXIMOS CAMINHOS</p>
              <h2 id="paths-title">Acompanhe o que estamos construindo.</h2>
            </div>
          </div>
          <div className="empty-state-grid">
            <Card className="empty-state">
              <Badge>Aprendizado</Badge>
              <h3>Trilhas em preparação</h3>
              <p>
                Os primeiros percursos de aprendizado serão publicados nas
                próximas etapas do portal.
              </p>
              <Button href="/aprendizado" variant="secondary">
                Ver área de aprendizado
              </Button>
            </Card>
            {projetosEmDestaque.length ? (
              projetosEmDestaque.map((projeto) => (
                <ProjetoCard
                  headingLevel={3}
                  key={projeto.slug}
                  projeto={projeto}
                />
              ))
            ) : (
              <Card className="empty-state empty-state--accent">
                <Badge>Projetos</Badge>
                <h3>Projetos em organização</h3>
                <p>A vitrine de protótipos e pesquisas está sendo preparada.</p>
                <Button href="/projetos" variant="secondary">
                  Visitar projetos
                </Button>
              </Card>
            )}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
