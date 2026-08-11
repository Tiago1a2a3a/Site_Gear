import Link from "next/link";

import { FeaturedProjectsCarousel } from "@features/projetos/components/FeaturedProjectsCarousel";
import {
  listarProjetos,
  listarProjetosAleatorios,
} from "@features/projetos/data/projetos";
import { Button } from "@shared/components/ui/Button";
import { RevealOnScroll } from "@shared/components/ui/RevealOnScroll";

export const dynamic = "force-dynamic";

export default function ProjetosPage() {
  const projetos = listarProjetos();
  const projetosAleatorios = listarProjetosAleatorios(3);

  return (
    <div className="projects-page">
      <header className="page-heading">
        <h1>Projetos</h1>
        <p>
          Acompanhe os projetos oficiais do GEAR conforme suas informações forem
          revisadas e publicadas.
        </p>
      </header>

      <FeaturedProjectsCarousel projects={projetosAleatorios} />

      <RevealOnScroll>
        <section
          aria-labelledby="all-projects-title"
          className="other-projects"
        >
          <header className="other-projects-heading">
            <div>
              <p className="section-index">TODOS OS PROJETOS</p>
              <h2 id="all-projects-title">Conheça todos os projetos.</h2>
            </div>
            <p>
              Esta área reúne as iniciativas documentadas e publicadas pelo
              grupo.
            </p>
          </header>

          {projetos.length ? (
            <ul className="other-projects-list">
              {projetos.map((projeto) => (
                <li key={projeto.slug}>
                  <div className="other-projects-content">
                    <p className="status-label">Projeto · {projeto.status}</p>
                    <h3>
                      <Link href={`/projetos/${projeto.slug}`}>
                        {projeto.titulo}
                      </Link>
                    </h3>
                    <p>{projeto.descricaoCurta}</p>
                    <div
                      aria-label={`Status do projeto: ${projeto.status}`}
                      className="other-projects-progress"
                      role="img"
                    >
                      <span
                        className={
                          projeto.status === "concluído"
                            ? "other-projects-progress__bar other-projects-progress__bar--complete"
                            : "other-projects-progress__bar"
                        }
                      />
                    </div>
                  </div>
                  <Button
                    className="other-projects-action"
                    href={`/projetos/${projeto.slug}`}
                    variant="secondary"
                  >
                    Ver projeto
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="other-projects-empty">
              Novos projetos serão adicionados em breve.
            </p>
          )}
        </section>
      </RevealOnScroll>
    </div>
  );
}
