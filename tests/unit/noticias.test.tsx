import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { NoticiasBusca } from "@features/noticias/components/NoticiasBusca";
import {
  criarDocumentosDeNoticias,
  prepararBuscaNoticias,
} from "@features/noticias/data/busca-noticias";
import {
  listarNoticiasPublicadas,
  ordenarNoticias,
} from "@features/noticias/data/noticias";
import type { Noticia } from "@features/noticias/types";
import { criarDocumentosDeBusca } from "@features/busca/data/indices";

afterEach(cleanup);

const noticiaBase: Noticia = {
  autor: "Equipe GEAR",
  conteudo: "",
  dataPublicacao: "2026-07-15",
  imagemCapa: "/images/content/placeholder.svg",
  resumo: "Resumo",
  slug: "noticia-base",
  sourcePath: "noticias/noticia-base.mdx",
  status: "publicado",
  titulo: "Notícia base",
};

describe("Notícias", () => {
  it("ordena publicações por data decrescente", () => {
    const ordenadas = ordenarNoticias([
      { ...noticiaBase, dataPublicacao: "2026-01-01", slug: "antiga" },
      { ...noticiaBase, dataPublicacao: "2026-07-15", slug: "nova" },
    ]);

    expect(ordenadas.map((noticia) => noticia.slug)).toEqual([
      "nova",
      "antiga",
    ]);
    const publicadas = listarNoticiasPublicadas();
    expect(
      publicadas.every(
        (noticia, index) =>
          index === 0 ||
          publicadas[index - 1].dataPublicacao >= noticia.dataPublicacao,
      ),
    ).toBe(true);
  });

  it("exclui rascunhos do índice próprio", () => {
    const documentos = criarDocumentosDeNoticias([
      noticiaBase,
      { ...noticiaBase, slug: "rascunho", status: "rascunho" },
    ]);

    expect(documentos.map((documento) => documento.slug)).toEqual([
      "noticia-base",
    ]);
  });

  it("pesquisa somente Notícias por título e texto", () => {
    const busca = prepararBuscaNoticias();
    render(<NoticiasBusca {...busca} />);

    fireEvent.change(screen.getByLabelText("Buscar somente em Notícias"), {
      target: { value: "Portal" },
    });
    expect(screen.getByText("1 notícia")).toBeDefined();
    expect(
      screen.getByRole("heading", {
        name: "Portal adota conteúdo estruturado em MDX",
      }),
    ).toBeDefined();
  });

  it("mantém Notícias fora dos índices de Aprendizado e vice-versa", () => {
    const noticias = criarDocumentosDeNoticias();
    const aprendizado = Object.values(criarDocumentosDeBusca()).flat();

    expect(noticias.every((item) => item.id.startsWith("noticia:"))).toBe(true);
    expect(aprendizado.some((item) => item.id.startsWith("noticia:"))).toBe(
      false,
    );
    expect(noticias.some((item) => item.href.startsWith("/aprendizado/"))).toBe(
      false,
    );
  });
});
