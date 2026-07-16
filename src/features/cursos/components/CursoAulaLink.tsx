"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CursoAulaLink({
  aulaSlug,
  cursoSlug,
  titulo,
  trilhasValidas,
}: Readonly<{
  aulaSlug: string;
  cursoSlug: string;
  titulo: string;
  trilhasValidas: readonly string[];
}>) {
  const trilhaSlug = useSearchParams().get("trilha");
  const query = new URLSearchParams({ curso: cursoSlug });

  if (trilhaSlug && trilhasValidas.includes(trilhaSlug)) {
    query.set("trilha", trilhaSlug);
  }

  return (
    <Link
      aria-label={`Abrir aula: ${titulo}`}
      className="text-link"
      href={`/aprendizado/aulas/${aulaSlug}?${query.toString()}`}
    >
      Abrir aula
    </Link>
  );
}
