import Image from "next/image";
import Link from "next/link";

import { FeaturedCoursesCarousel } from "@features/aprendizado/components/FeaturedCoursesCarousel";
import { listarConteudosRecentes } from "@features/aprendizado/data/conteudosRecentes";
import { listarCursosEmDestaque } from "@features/cursos/data/cursos";
import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";
import { RevealOnScroll } from "@shared/components/ui/RevealOnScroll";

const areas = [
  {
    title: "Aulas",
    description: "Conteúdos pontuais para aprender um conceito por vez.",
    href: "/aprendizado/aulas",
  },
  {
    title: "Cursos",
    description:
      "Sequências de aulas para desenvolver uma habilidade completa.",
    href: "/aprendizado/cursos",
  },
  {
    title: "Trilhas",
    description:
      "Percursos guiados que conectam cursos e aulas em uma jornada.",
    href: "/aprendizado/trilhas",
  },
] as const;

export default function AprendizadoPage() {
  const cursosEmDestaque = listarCursosEmDestaque();
  const conteudosRecentes = listarConteudosRecentes();

  return (
    <div className="learning-hub-page">
      <header className="page-heading learning-hub-heading">
        <p className="status-label">Aprendizado</p>
        <h1>Aprendizado</h1>
        <p>
          Explore conteúdos de robótica no seu ritmo: comece por uma aula, siga
          um curso completo ou escolha uma trilha guiada.
        </p>
      </header>

      <RevealOnScroll>
        <FeaturedCoursesCarousel courses={cursosEmDestaque} />
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          aria-labelledby="recent-content-title"
          className="recent-content"
        >
          <div className="recent-content-copy">
            <p className="section-index">NOVOS CONTEUDOS</p>
            <h2 id="recent-content-title">O que acabou de chegar.</h2>
            <ul className="recent-content-list">
              {conteudosRecentes.map((content) => (
                <li key={content.href}>
                  <Link href={content.href}>
                    <span>{content.tipo}</span>
                    <strong>{content.titulo}</strong>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div aria-hidden="true" className="recent-content-mascot">
            <Image
              alt=""
              className="recent-content-mascot-sheet"
              height={800}
              src="/images/brand/gear-mascot-poses.png"
              style={{ transform: "translate(0, -50%)" }}
              width={1335}
            />
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section
          aria-labelledby="explorar-aprendizado"
          className="learning-explore"
        >
          <div className="section-heading learning-section-heading">
            <div>
              <p className="section-index">ESCOLHA SEU CAMINHO</p>
              <h2 id="explorar-aprendizado">Explorar</h2>
            </div>
          </div>

          <div className="learning-explore-search">
            <Button href="/aprendizado/busca" variant="secondary">
              Pesquisar todos os conteúdos
            </Button>
          </div>

          <div className="learning-hub-grid">
            {areas.map((area) => (
              <Card className="learning-hub-card" key={area.href}>
                <p className="status-label">Aprendizado</p>
                <h3>{area.title}</h3>
                <p>{area.description}</p>
                <Button href={area.href}>Explorar {area.title}</Button>
              </Card>
            ))}
          </div>
        </section>
      </RevealOnScroll>
    </div>
  );
}
