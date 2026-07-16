import type { Aula as AulaGerada } from "../../../.velite";

export type Aula = AulaGerada;

export type ContextoAula = Readonly<{
  curso?: Readonly<{ slug: string; titulo: string }>;
  trilha?: Readonly<{ slug: string; titulo: string }>;
}>;

export type PaginaDeAulas = Readonly<{
  aulas: readonly Aula[];
  paginaAtual: number;
  totalDePaginas: number;
  totalDeAulas: number;
}>;
