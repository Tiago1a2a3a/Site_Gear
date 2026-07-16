export type TipoDocumentoBusca = "aula" | "curso" | "trilha";
export type TipoBusca = TipoDocumentoBusca | "geral";

export type DocumentoBusca = Readonly<{
  area?: string;
  categoria?: string;
  conteudo: string;
  descricao: string;
  dificuldade?: string;
  href: string;
  id: string;
  slug: string;
  tags: readonly string[];
  tipo: TipoDocumentoBusca;
  titulo: string;
}>;

export type NomeFiltroBusca =
  "area" | "categoria" | "dificuldade" | "tag" | "tipo";
export type FiltroBusca = Readonly<{
  nome: NomeFiltroBusca;
  opcoes: readonly string[];
  rotulo: string;
}>;
