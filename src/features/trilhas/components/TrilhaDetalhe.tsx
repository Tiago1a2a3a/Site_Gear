import Image from "next/image";

import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { Badge } from "@shared/components/ui/Badge";

import { TrilhaPercurso } from "./TrilhaPercurso";
import type { ItemTrilhaResolvido, Trilha } from "../types";

export function TrilhaDetalhe({
  itens,
  trilha,
}: Readonly<{
  itens: readonly ItemTrilhaResolvido[];
  trilha: Trilha;
}>) {
  return (
    <article className="learning-detail-page trail-detail-page">
      <Breadcrumbs
        items={[
          { href: "/aprendizado", label: "Aprendizado" },
          { href: "/aprendizado/trilhas", label: "Trilhas" },
          { label: trilha.titulo },
        ]}
      />
      <header className="learning-detail-header">
        <div>
          <p className="status-label">Trilha de aprendizado</p>
          <h1>{trilha.titulo}</h1>
          <p>{trilha.descricaoLonga ?? trilha.descricaoCurta}</p>
          <div className="learning-detail-meta">
            <Badge>{trilha.area}</Badge>
            <span>{itens.length} etapas</span>
            <span>Cursos e aulas diretas</span>
          </div>
        </div>
        <div className="learning-detail-cover">
          <Image
            alt={`Capa da trilha ${trilha.titulo}`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 42vw"
            src={trilha.imagemCapa}
          />
        </div>
      </header>
      <TrilhaPercurso itens={itens} />
    </article>
  );
}
