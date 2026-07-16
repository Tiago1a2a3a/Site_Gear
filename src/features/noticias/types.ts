import type { Notícia as NoticiaGerada } from "../../../.velite";

export type Noticia = NoticiaGerada;

export type DocumentoBuscaNoticia = Readonly<{
  conteudo: string;
  dataPublicacao: string;
  href: string;
  id: string;
  imagemCapa: string;
  resumo: string;
  slug: string;
  titulo: string;
}>;
