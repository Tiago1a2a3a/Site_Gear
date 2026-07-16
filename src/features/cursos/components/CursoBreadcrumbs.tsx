"use client";

import { useSearchParams } from "next/navigation";

import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/components/ui/Breadcrumbs";

import type { ContextoCurso } from "../types";

export function CursoBreadcrumbs({
  contextos,
  titulo,
}: Readonly<{ contextos: readonly ContextoCurso[]; titulo: string }>) {
  const trilhaSlug = useSearchParams().get("trilha");
  const contexto =
    contextos.find((item) => item.trilha?.slug === trilhaSlug) ?? {};
  const items: BreadcrumbItem[] = [
    { href: "/aprendizado", label: "Aprendizado" },
  ];

  if (contexto.trilha) {
    items.push({
      href: `/aprendizado/trilhas/${contexto.trilha.slug}`,
      label: contexto.trilha.titulo,
    });
  } else {
    items.push({ href: "/aprendizado/cursos", label: "Cursos" });
  }
  items.push({ label: titulo });

  return <Breadcrumbs items={items} />;
}
