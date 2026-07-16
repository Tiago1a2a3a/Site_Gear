import MiniSearch from "minisearch";

import { courses, lessons, trails } from "../../../../.velite";

import type {
  DocumentoBusca,
  FiltroBusca,
  NomeFiltroBusca,
  TipoDocumentoBusca,
} from "../types";
import { opcoesDoIndice } from "./motor";

function textoDoMdx(compilado: string) {
  return compilado
    .replace(/\\n/g, " ")
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function criarDocumentosDeBusca(): Record<
  TipoDocumentoBusca,
  DocumentoBusca[]
> {
  return {
    trilha: trails.map((trilha) => ({
      area: trilha.area,
      conteudo: textoDoMdx(trilha.conteudo),
      descricao: [trilha.descricaoCurta, trilha.descricaoLonga]
        .filter(Boolean)
        .join(" "),
      href: `/aprendizado/trilhas/${trilha.slug}`,
      id: `trilha:${trilha.slug}`,
      slug: trilha.slug,
      tags: [],
      tipo: "trilha",
      titulo: trilha.titulo,
    })),
    curso: courses.map((curso) => ({
      categoria: curso.categoria,
      conteudo: textoDoMdx(curso.conteudo),
      descricao: curso.descricao,
      dificuldade: curso.dificuldade,
      href: `/aprendizado/cursos/${curso.slug}`,
      id: `curso:${curso.slug}`,
      slug: curso.slug,
      tags: curso.tags ?? [],
      tipo: "curso",
      titulo: curso.titulo,
    })),
    aula: lessons.map((aula) => ({
      categoria: aula.categoria,
      conteudo: textoDoMdx(aula.conteudo),
      descricao: aula.resumo,
      dificuldade: aula.dificuldade,
      href: `/aprendizado/aulas/${aula.slug}`,
      id: `aula:${aula.slug}`,
      slug: aula.slug,
      tags: aula.tags ?? [],
      tipo: "aula",
      titulo: aula.titulo,
    })),
  };
}

export function criarIndice(documentos: readonly DocumentoBusca[]) {
  const indice = new MiniSearch<DocumentoBusca>(opcoesDoIndice());
  indice.addAll([...documentos]);
  return indice;
}

function valoresUnicos(
  documentos: readonly DocumentoBusca[],
  campo: NomeFiltroBusca,
) {
  const valores = documentos.flatMap((documento) => {
    if (campo === "tag") return [...documento.tags];
    const valor = documento[campo];
    return valor ? [valor] : [];
  });
  return [...new Set(valores)].sort((a, b) => a.localeCompare(b, "pt-BR"));
}

export function criarFiltros(
  tipo: TipoDocumentoBusca,
  documentos: readonly DocumentoBusca[],
): FiltroBusca[] {
  const campos: ReadonlyArray<Readonly<[NomeFiltroBusca, string]>> =
    tipo === "trilha"
      ? [["area", "Área"]]
      : [
          ["dificuldade", "Dificuldade"],
          ["categoria", "Categoria"],
          ["tag", "Tags"],
        ];
  return campos
    .map(([nome, rotulo]) => ({
      nome,
      opcoes: valoresUnicos(documentos, nome),
      rotulo,
    }))
    .filter((filtro) => filtro.opcoes.length > 0);
}

export function prepararBusca(tipo: TipoDocumentoBusca) {
  const documentos = criarDocumentosDeBusca()[tipo];
  const indice = criarIndice(documentos);
  return {
    documentos,
    filtros: criarFiltros(tipo, documentos),
    indiceSerializado: JSON.stringify(indice),
  };
}
