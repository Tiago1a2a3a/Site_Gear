import { CursoCard } from "@features/cursos/components/CursoCard";
import { listarCursosPublicados } from "@features/cursos/data/cursos";
import { Button } from "@shared/components/ui/Button";

export default function CursosPage() {
  const cursos = listarCursosPublicados();

  return (
    <div className="learning-list-page">
      <header className="page-heading">
        <p className="status-label">Aprendizado / Cursos</p>
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
