import { courses, lessons, trails } from "../../../../.velite";

export type ConteudoRecente = Readonly<{
  dataPublicacao: string;
  href: string;
  tipo: "Aula" | "Curso" | "Trilha";
  titulo: string;
}>;

export type DestaqueAprendizado = Readonly<{
  href: string;
  imagemCapa: string;
  tipo: "Curso" | "Trilha";
  titulo: string;
}>;

function embaralhar<T>(itens: readonly T[]) {
  const resultado = [...itens];

  for (let indice = resultado.length - 1; indice > 0; indice -= 1) {
    const destino = Math.floor(Math.random() * (indice + 1));
    [resultado[indice], resultado[destino]] = [
      resultado[destino]!,
      resultado[indice]!,
    ];
  }

  return resultado;
}

export function listarDestaquesAleatorios(limite = 4): DestaqueAprendizado[] {
  const cursos: DestaqueAprendizado[] = courses
    .filter((curso) => curso.status === "publicado")
    .map((curso) => ({
      href: `/aprendizado/cursos/${curso.slug}`,
      imagemCapa: curso.imagemCapa,
      tipo: "Curso" as const,
      titulo: curso.titulo,
    }));
  const trilhas: DestaqueAprendizado[] = trails
    .filter((trilha) => trilha.status === "publicado")
    .map((trilha) => ({
      href: `/aprendizado/trilhas/${trilha.slug}`,
      imagemCapa: trilha.imagemCapa,
      tipo: "Trilha" as const,
      titulo: trilha.titulo,
    }));
  const quantidade = Math.max(0, limite);

  if (!quantidade) return [];

  const sementes =
    quantidade > 1 && cursos.length && trilhas.length
      ? [
          cursos[Math.floor(Math.random() * cursos.length)]!,
          trilhas[Math.floor(Math.random() * trilhas.length)]!,
        ]
      : [];
  const restantes = [...cursos, ...trilhas].filter(
    (item) => !sementes.some((semente) => semente.href === item.href),
  );

  return embaralhar([...sementes, ...restantes]).slice(0, quantidade);
}

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
