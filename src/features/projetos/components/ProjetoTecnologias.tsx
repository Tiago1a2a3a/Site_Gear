import { Badge } from "@shared/components/ui/Badge";

export function ProjetoTecnologias({
  tecnologias,
}: Readonly<{ tecnologias?: readonly string[] }>) {
  if (!tecnologias?.length) return null;

  return (
    <ul aria-label="Tecnologias utilizadas" className="project-technologies">
      {tecnologias.map((tecnologia) => (
        <li key={tecnologia}>
          <Badge>{tecnologia}</Badge>
        </li>
      ))}
    </ul>
  );
}
