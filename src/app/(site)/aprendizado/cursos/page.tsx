import { CursoCard } from "@features/cursos/components/CursoCard";
import { listarCursosPublicados } from "@features/cursos/data/cursos";
import { Button } from "@shared/components/ui/Button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export default function CursosPage() {
  const cursos = listarCursosPublicados();

  return (
    <div className="learning-list-page">
      <div className="learning-list-breadcrumbs">
        <Breadcrumbs
          items={[
            { href: "/aprendizado", label: "Aprendizado" },
            { label: "Cursos" },
          ]}
        />
      </div>
      <header className="page-heading">
        <h1>Cursos</h1>
        <p>
          Sequências ordenadas de aulas para desenvolver uma habilidade técnica
          do início ao fim.
        </p>
        <Button href="/aprendizado/cursos/busca" variant="secondary">
          Buscar Cursos
        </Button>
      </header>

      {cursos.length ? (
        <div className="learning-grid">
          {cursos.map((curso) => (
            <CursoCard curso={curso} key={curso.slug} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <p className="status-label">Conteúdo em preparação</p>
          <h2>Nenhum curso publicado ainda</h2>
          <p>
            As aulas continuam disponíveis enquanto os cursos são preparados.
          </p>
        </div>
      )}
    </div>
  );
}
