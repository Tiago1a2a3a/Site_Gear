import Image from "next/image";

import { ProjetoCard } from "@features/projetos/components/ProjetoCard";
import { listarProjetosEmDestaque } from "@features/projetos/data/projetos";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";
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
        <div className="hero-content">
          <Badge>{institutionalContent.eyebrow}</Badge>
          <h1 id="hero-title">
            Conhecimento que <span>move ideias.</span>
          </h1>
          <p>{institutionalContent.heroDescription}</p>
          <div className="hero-actions">
            <Button href="/aprendizado">Explorar aprendizado</Button>
            <Button href="/projetos" variant="secondary">
              Conhecer projetos
            </Button>
          </div>
        </div>
        <div className="hero-brand-panel">
          <Image
            alt="Logo compacto do GEAR"
            className="hero-compact-logo"
            height={120}
            priority
            src="/images/brand/gear-logo-compact.png"
            width={200}
          />
          <div className="hero-mascot-crop">
            <Image
              alt="Mascote robô do GEAR acenando"
              className="hero-mascot-sheet"
              height={800}
              priority
              src="/images/brand/gear-mascot-poses.png"
              width={1335}
            />
          </div>
          <p>ROBÓTICA · PESQUISA · EDUCAÇÃO</p>
        </div>
      </section>

      <section aria-labelledby="mission-title" className="home-section mission">
        <p className="section-index">01 / MISSÃO</p>
        <div>
          <h2 id="mission-title">Robótica feita para compartilhar.</h2>
          <p>{institutionalContent.mission}</p>
        </div>
      </section>

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
        <div className="research-grid">
          {institutionalContent.researchAreas.map((area, index) => (
            <Card className="research-card" key={area.shortCode}>
              <div className="research-card-meta">
                <Badge>{area.shortCode}</Badge>
                <span aria-hidden="true">0{index + 1}</span>
              </div>
              <h3>{area.name}</h3>
              <p>{area.description}</p>
            </Card>
          ))}
        </div>
      </section>

      <section
        aria-labelledby="paths-title"
        className="home-section paths-section"
      >
        <div className="section-heading">
          <div>
            <p className="section-index">03 / PRÓXIMOS CAMINHOS</p>
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
    </div>
  );
}
