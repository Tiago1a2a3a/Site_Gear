import MiniSearch from "minisearch";

import { extrairTextoDoMdx } from "@shared/lib/texto-mdx";

import { courses, lessons, trails } from "../../../../.velite";

import type {
  DocumentoBusca,
  FiltroBusca,
  NomeFiltroBusca,
  TipoBusca,
  TipoDocumentoBusca,
} from "../types";
import { opcoesDoIndice } from "./motor";

export function criarDocumentosDeBusca(): Record<
  TipoDocumentoBusca,
  DocumentoBusca[]
> {
  return {
    trilha: trails
      .filter((trilha) => trilha.status === "publicado")
      .map((trilha) => ({
        area: trilha.area,
        conteudo: extrairTextoDoMdx(trilha.conteudo),
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
    curso: courses
      .filter((curso) => curso.status === "publicado")
      .map((curso) => ({
        categoria: curso.categoria,
        conteudo: extrairTextoDoMdx(curso.conteudo),
        descricao: curso.descricao,
        dificuldade: curso.dificuldade,
        href: `/aprendizado/cursos/${curso.slug}`,
        id: `curso:${curso.slug}`,
        slug: curso.slug,
        tags: curso.tags ?? [],
        tipo: "curso",
        titulo: curso.titulo,
      })),
    aula: lessons
      .filter((aula) => aula.status === "publicado")
      .map((aula) => ({
        categoria: aula.categoria,
        conteudo: extrairTextoDoMdx(aula.conteudo),
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

function opcoesComContagem(
  documentos: readonly DocumentoBusca[],
  campo: NomeFiltroBusca,
) {
  const contagens: Record<string, number> = {};

  for (const documento of documentos) {
    const valores = (() => {
      if (campo === "tag") return [...new Set(documento.tags)];
      const valor = documento[campo];
      return valor ? [valor] : [];
    })();

    for (const valor of valores) {
      contagens[valor] = (contagens[valor] ?? 0) + 1;
    }
  }

  const opcoes = Object.keys(contagens).sort(
    (a, b) => contagens[b] - contagens[a] || a.localeCompare(b, "pt-BR"),
  );

  return { contagens, opcoes };
}

export function criarFiltros(
  tipo: TipoBusca,
  documentos: readonly DocumentoBusca[],
): FiltroBusca[] {
  const campos: ReadonlyArray<Readonly<[NomeFiltroBusca, string]>> =
    tipo === "trilha"
      ? [["area", "Área"]]
      : tipo === "geral"
        ? [
            ["tipo", "Tipo de conteúdo"],
            ["dificuldade", "Dificuldade"],
            ["categoria", "Categoria"],
            ["tag", "Tags"],
            ["area", "Área"],
          ]
        : [
            ["dificuldade", "Dificuldade"],
            ["categoria", "Categoria"],
            ["tag", "Tags"],
          ];
  return campos
    .map(([nome, rotulo]) => {
      const { contagens, opcoes } = opcoesComContagem(documentos, nome);
      return { contagens, nome, opcoes, rotulo };
    })
    .filter((filtro) => filtro.opcoes.length > 0);
}

export function prepararBusca(tipo: TipoBusca) {
  const documentosPorTipo = criarDocumentosDeBusca();
  const documentos =
    tipo === "geral"
      ? Object.values(documentosPorTipo).flat()
      : documentosPorTipo[tipo];
  const indice = criarIndice(documentos);
  return {
    documentos,
    filtros: criarFiltros(tipo, documentos),
    indiceSerializado: JSON.stringify(indice),
  };
}
