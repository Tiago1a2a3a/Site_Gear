import { TemporaryPage } from "@shared/components/layout/TemporaryPage";

export default function NoticiaPage() {
  return (
    <TemporaryPage
      description="Os detalhes de uma Notícia dependerão do conteúdo MDX de Milestones posteriores."
      returnHref="/noticias"
      returnLabel="Voltar para Notícias"
      title="Notícia"
    />
  );
}
