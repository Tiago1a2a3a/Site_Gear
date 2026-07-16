import { TrilhaCard } from "@features/trilhas/components/TrilhaCard";
import { listarTrilhasPublicadas } from "@features/trilhas/data/trilhas";
import { Button } from "@shared/components/ui/Button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export default function TrilhasPage() {
  const trilhas = listarTrilhasPublicadas();

  return (
    <div className="learning-list-page">
      <div className="learning-list-breadcrumbs">
        <Breadcrumbs
          items={[
            { href: "/aprendizado", label: "Aprendizado" },
            { label: "Trilhas" },
          ]}
        />
      </div>
      <header className="page-heading">
        <h1>Trilhas de aprendizado</h1>
        <p>
          Percursos que combinam cursos e aulas diretas para orientar seu
          próximo passo em robótica.
        </p>
        <Button href="/aprendizado/trilhas/busca" variant="secondary">
          Buscar Trilhas
        </Button>
      </header>

      {trilhas.length ? (
        <div className="learning-grid">
          {trilhas.map((trilha) => (
            <TrilhaCard key={trilha.slug} trilha={trilha} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <p className="status-label">Conteúdo em preparação</p>
          <h2>Nenhuma trilha publicada ainda</h2>
          <p>Você ainda pode navegar diretamente pelas aulas e pelos cursos.</p>
        </div>
      )}
    </div>
  );
}
