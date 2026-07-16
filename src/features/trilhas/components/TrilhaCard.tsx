import Image from "next/image";
import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Card } from "@shared/components/ui/Card";

import type { Trilha } from "../types";

export function TrilhaCard({ trilha }: Readonly<{ trilha: Trilha }>) {
  return (
    <Card className="learning-card trail-card">
      <Link
        aria-label={`Abrir trilha: ${trilha.titulo}`}
        className="learning-card__image"
        href={`/aprendizado/trilhas/${trilha.slug}`}
      >
        <Image
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          src={trilha.imagemCapa}
        />
      </Link>
      <div className="learning-card__body">
        <div className="learning-card__meta">
          <Badge>Trilha {String(trilha.ordem).padStart(2, "0")}</Badge>
          <span>{trilha.area}</span>
        </div>
        <h2>
          <Link href={`/aprendizado/trilhas/${trilha.slug}`}>
            {trilha.titulo}
          </Link>
        </h2>
        <p>{trilha.descricaoCurta}</p>
        <Link
          className="text-link learning-card__link"
          href={`/aprendizado/trilhas/${trilha.slug}`}
        >
          Explorar trilha
        </Link>
      </div>
    </Card>
  );
}
