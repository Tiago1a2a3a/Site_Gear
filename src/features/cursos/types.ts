import type {
  Aula as AulaGerada,
  Curso as CursoGerado,
} from "../../../.velite";

export type Curso = CursoGerado;
export type AulaDoCurso = AulaGerada;

export type PreRequisitoCurso = Readonly<{
  href: string;
  slug: string;
  tipo: "Aula" | "Curso";
  titulo: string;
}>;

export type ContextoCurso = Readonly<{
  trilha?: Readonly<{ slug: string; titulo: string }>;
}>;
