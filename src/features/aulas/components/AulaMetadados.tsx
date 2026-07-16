import { Badge } from "@shared/components/ui/Badge";
import { formatarDataLonga } from "@shared/lib/formatar-data";

import type { Aula } from "../types";

export function AulaMetadados({ aula }: Readonly<{ aula: Aula }>) {
  return (
    <div className="lesson-metadata">
      <Badge>{aula.dificuldade}</Badge>
      {aula.categoria ? <span>{aula.categoria}</span> : null}
      <span>Por {aula.autores.join(", ")}</span>
      <time dateTime={aula.dataPublicacao}>
        Publicada em {formatarDataLonga(aula.dataPublicacao)}
      </time>
      {aula.dataAtualizacao ? (
        <time dateTime={aula.dataAtualizacao}>
          Atualizada em {formatarDataLonga(aula.dataAtualizacao)}
        </time>
      ) : null}
    </div>
  );
}
