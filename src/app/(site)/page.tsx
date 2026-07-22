import Link from "next/link";

import { listarDestaquesAleatorios } from "@features/aprendizado/data/conteudosRecentes";
import { HeroCarousel } from "@features/home/components/HeroCarousel";
import { MemberGrid } from "@features/institucional/components/MemberGrid";
import { ResearchAreaGrid } from "@features/institucional/components/ResearchAreaGrid";
import { NoticiaCard } from "@features/noticias/components/NoticiaCard";
import { listarNoticiasPublicadas } from "@features/noticias/data/noticias";
import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";
import { RevealOnScroll } from "@shared/components/ui/RevealOnScroll";
import { institutionalContent } from "@shared/config/institutional";

export const dynamic = "force-dynamic";

export default function Home() {
  const noticiaRecente = listarNoticiasPublicadas()[0];
  const destaquesAleatorios = listarDestaquesAleatorios(2);

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
            {destaquesAleatorios.length ? (
              <Card className="learning-suggestions">
                <div className="learning-suggestions__heading">
                  <div>
                    <Badge>Para explorar</Badge>
                    <h3>Escolhas para você</h3>
                  </div>
                  <Link className="text-link" href="/aprendizado">
                    Explorar
                  </Link>
                </div>
                <ol>
                  {destaquesAleatorios.map((item, indice) => (
                    <li key={item.href}>
                      <Link
                        aria-label={`Abrir ${item.tipo.toLocaleLowerCase("pt-BR")}: ${item.titulo}`}
                        href={item.href}
                      >
                        <span aria-hidden="true" className="learning-suggestions__number">
                          {String(indice + 1).padStart(2, "0")}
                        </span>
                        <span>
                          <small>{item.tipo}</small>
                          <strong>{item.titulo}</strong>
                        </span>
                        <span aria-hidden="true" className="learning-suggestions__arrow">
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </Card>
            ) : (
              <Card className="empty-state">
                <Badge>Aprendizado</Badge>
                <h3>Aulas em preparação</h3>
                <p>As próximas aulas do GEAR aparecerão aqui.</p>
                <Button href="/aprendizado" variant="secondary">
                  Ver área de aprendizado
                </Button>
              </Card>
            )}
            {noticiaRecente ? (
              <NoticiaCard noticia={noticiaRecente} />
            ) : (
              <Card className="empty-state empty-state--accent">
                <Badge>Notícias</Badge>
                <h3>Novidades em preparação</h3>
                <p>As próximas atualizações do GEAR aparecerão aqui.</p>
                <Button href="/noticias" variant="secondary">
                  Visitar notícias
                </Button>
              </Card>
            )}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
