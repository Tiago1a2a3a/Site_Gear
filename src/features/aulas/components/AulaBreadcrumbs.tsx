"use client";

import { useSearchParams } from "next/navigation";

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/components/ui/Breadcrumbs";

import type { ContextoAula } from "../types";

export function AulaBreadcrumbs({
  contextos,
  titulo,
}: Readonly<{ contextos: readonly ContextoAula[]; titulo: string }>) {
  const params = useSearchParams();
  const cursoSlug = params.get("curso") ?? undefined;
  const trilhaSlug = params.get("trilha") ?? undefined;
  const contexto =
    contextos.find(
      (item) =>
        item.curso?.slug === cursoSlug && item.trilha?.slug === trilhaSlug,
    ) ?? {};
  const items: BreadcrumbItem[] = [
    { href: "/aprendizado", label: "Aprendizado" },
  ];

  if (contexto.trilha) {
    items.push({
      href: `/aprendizado/trilhas/${contexto.trilha.slug}`,
      label: contexto.trilha.titulo,
    });
  }
  if (contexto.curso) {
    const trailQuery = contexto.trilha ? `?trilha=${contexto.trilha.slug}` : "";
    items.push({
      href: `/aprendizado/cursos/${contexto.curso.slug}${trailQuery}`,
      label: contexto.curso.titulo,
    });
  }
  if (!contexto.trilha && !contexto.curso) {
    items.push({ href: "/aprendizado/aulas", label: "Aulas" });
  }
  items.push({ label: titulo });

  return <Breadcrumbs items={items} />;
}
