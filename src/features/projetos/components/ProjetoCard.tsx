import Image from "next/image";
import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";

import { ProjetoTecnologias } from "./ProjetoTecnologias";
import type { Projeto } from "../types";

type ProjetoCardProps = Readonly<{
  headingLevel?: 2 | 3;
  projeto: Projeto;
}>;

export function ProjetoCard({ headingLevel = 2, projeto }: ProjetoCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  const imagem = projeto.imagens?.[0] ?? "/images/content/placeholder.svg";

  return (
    <Card className="project-card">
      <Link
        aria-label={`Abrir projeto: ${projeto.titulo}`}
        className="project-card__image"
        href={`/projetos/${projeto.slug}`}
      >
        <Image
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={imagem}
        />
      </Link>
      <div className="project-card__body">
        <Badge>{projeto.status}</Badge>
        <Heading>
          <Link href={`/projetos/${projeto.slug}`}>{projeto.titulo}</Link>
        </Heading>
        <p>{projeto.descricaoCurta}</p>
        <ProjetoTecnologias tecnologias={projeto.tecnologias} />
        <Link
          className="text-link project-card__link"
          href={`/projetos/${projeto.slug}`}
        >
          Ver projeto
        </Link>
      </div>
    </Card>
  );
}
