import { ProjetoCard } from "@features/projetos/components/ProjetoCard";
import { listarProjetos } from "@features/projetos/data/projetos";

export default function ProjetosPage() {
  const projetos = listarProjetos();

  return (
    <div className="projects-page">
      <header className="page-heading">
        <p className="status-label">Pesquisa e desenvolvimento</p>
        <h1>Projetos</h1>
        <p>Protótipos, pesquisas e soluções construídas pelo GEAR.</p>
      </header>

      {projetos.length ? (
        <div className="project-grid">
          {projetos.map((projeto) => (
            <ProjetoCard key={projeto.slug} projeto={projeto} />
          ))}
        </div>
      ) : (
        <div className="empty-state card">
          <h2>Nenhum projeto publicado ainda</h2>
          <p>
            Os projetos aparecerão aqui quando estiverem prontos para
            apresentação.
          </p>
        </div>
      )}
    </div>
  );
}
