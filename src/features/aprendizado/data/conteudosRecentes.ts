import { courses, lessons, trails } from "../../../../.velite";

export type ConteudoRecente = Readonly<{
  dataPublicacao: string;
  href: string;
  tipo: "Aula" | "Curso" | "Trilha";
  titulo: string;
}>;

export function listarConteudosRecentes(limite = 5): ConteudoRecente[] {
  const conteudos: ConteudoRecente[] = [
    ...courses
      .filter(
        (curso) =>
          curso.status === "publicado" && Boolean(curso.dataPublicacao),
      )
      .map((curso) => ({
        dataPublicacao: curso.dataPublicacao!,
        href: `/aprendizado/cursos/${curso.slug}`,
        tipo: "Curso" as const,
        titulo: curso.titulo,
      })),
    ...trails
      .filter(
        (trilha) =>
          trilha.status === "publicado" && Boolean(trilha.dataPublicacao),
      )
      .map((trilha) => ({
        dataPublicacao: trilha.dataPublicacao!,
        href: `/aprendizado/trilhas/${trilha.slug}`,
        tipo: "Trilha" as const,
        titulo: trilha.titulo,
      })),
    ...lessons
      .filter((aula) => aula.status === "publicado")
      .map((aula) => ({
        dataPublicacao: aula.dataPublicacao,
        href: `/aprendizado/aulas/${aula.slug}`,
        tipo: "Aula" as const,
        titulo: aula.titulo,
      })),
  ];

  return conteudos
    .sort(
      (primeiro, segundo) =>
        segundo.dataPublicacao.localeCompare(primeiro.dataPublicacao) ||
        primeiro.tipo.localeCompare(segundo.tipo) ||
        primeiro.titulo.localeCompare(segundo.titulo, "pt-BR"),
    )
    .slice(0, Math.max(0, limite));
}
