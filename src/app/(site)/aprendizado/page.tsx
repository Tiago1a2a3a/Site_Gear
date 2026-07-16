import { Button } from "@shared/components/ui/Button";
import { Card } from "@shared/components/ui/Card";

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
  return (
    <div className="learning-hub-page">
      <header className="page-heading learning-hub-heading">
        <p className="status-label">Portal GEAR / Aprendizado</p>
        <h1>Aprendizado</h1>
        <p>
          Explore conteúdos de robótica no seu ritmo: comece por uma aula, siga
          um curso completo ou escolha uma trilha guiada.
        </p>
      </header>

      <section aria-labelledby="explorar-aprendizado">
        <div className="section-heading learning-section-heading">
          <div>
            <p className="section-index">ESCOLHA SEU CAMINHO</p>
            <h2 id="explorar-aprendizado">Explorar</h2>
          </div>
          <p>Encontre o formato que combina com o seu próximo passo.</p>
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
    </div>
  );
}
