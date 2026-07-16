import type {
  Aula as AulaGerada,
  Curso as CursoGerado,
  Trilha as TrilhaGerada,
} from "../../../.velite";

export type Trilha = TrilhaGerada;

export type ItemTrilhaResolvido =
  | Readonly<{
      descricao: string;
      entidade: AulaGerada;
      href: string;
      slug: string;
      tipo: "aula";
      titulo: string;
    }>
  | Readonly<{
      descricao: string;
      entidade: CursoGerado;
      href: string;
      slug: string;
      tipo: "curso";
      titulo: string;
    }>;
