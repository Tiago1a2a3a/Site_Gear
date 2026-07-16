import { Badge } from "@shared/components/ui/Badge";

import type { Aula } from "../types";

const formatadorDeData = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

function formatarData(data: string) {
  return formatadorDeData.format(new Date(`${data}T00:00:00Z`));
}

export function AulaMetadados({ aula }: Readonly<{ aula: Aula }>) {
  return (
    <div className="lesson-metadata">
      <Badge>{aula.dificuldade}</Badge>
      {aula.categoria ? <span>{aula.categoria}</span> : null}
      <span>Por {aula.autores.join(", ")}</span>
      <time dateTime={aula.dataPublicacao}>
        Publicada em {formatarData(aula.dataPublicacao)}
      </time>
      {aula.dataAtualizacao ? (
        <time dateTime={aula.dataAtualizacao}>
          Atualizada em {formatarData(aula.dataAtualizacao)}
        </time>
      ) : null}
    </div>
  );
}
