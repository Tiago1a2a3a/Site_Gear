import Link from "next/link";

import { AulaCard } from "@features/aulas/components/AulaCard";
import {
  listarAulasPublicadas,
  paginarAulas,
} from "@features/aulas/data/aulas";
import { Button } from "@shared/components/ui/Button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

type AulasPageProps = Readonly<{
  searchParams: Promise<{ pagina?: string }>;
}>;

export default async function AulasPage({ searchParams }: AulasPageProps) {
  const { pagina } = await searchParams;
  const numeroDaPagina = Number.parseInt(pagina ?? "1", 10);
  const resultado = paginarAulas(listarAulasPublicadas(), numeroDaPagina);

  return (
    <div className="lessons-page">
      <div className="learning-list-breadcrumbs">
        <Breadcrumbs
          items={[
            { href: "/aprendizado", label: "Aprendizado" },
            { label: "Aulas" },
          ]}
        />
      </div>
      <header className="page-heading">
        <h1>Aulas</h1>
        <p>
          Conteúdos práticos e independentes para aprender robótica, programação
          e as ferramentas usadas pelo GEAR.
        </p>
        <Button href="/aprendizado/aulas/busca" variant="secondary">
          Buscar Aulas
        </Button>
      </header>

      <p aria-live="polite" className="lesson-count">
        {resultado.totalDeAulas} aulas publicadas
      </p>
      <div className="lesson-grid">
        {resultado.aulas.map((aula) => (
          <AulaCard aula={aula} key={aula.slug} />
        ))}
      </div>

      {resultado.totalDePaginas > 1 ? (
        <nav aria-label="Paginação das aulas" className="pagination">
          {resultado.paginaAtual > 1 ? (
            <Link href={`?pagina=${resultado.paginaAtual - 1}`}>Anterior</Link>
          ) : null}
          <span>
            Página {resultado.paginaAtual} de {resultado.totalDePaginas}
          </span>
          {resultado.paginaAtual < resultado.totalDePaginas ? (
            <Link href={`?pagina=${resultado.paginaAtual + 1}`}>Próxima</Link>
          ) : null}
        </nav>
      ) : null}
    </div>
  );
}
