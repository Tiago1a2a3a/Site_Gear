import Link from "next/link";

type TemporaryPageProps = Readonly<{
  description: string;
  title: string;
  returnHref?: `/${string}` | "/";
  returnLabel?: string;
}>;

export function TemporaryPage({
  description,
  title,
  returnHref = "/",
  returnLabel = "Voltar para a página inicial",
}: TemporaryPageProps) {
  return (
    <section aria-labelledby="temporary-page-title" className="temporary-page">
      <p className="status-label">Área em preparação</p>
      <h1 id="temporary-page-title">{title}</h1>
      <p>{description}</p>
      <p className="temporary-note" role="status">
        Esta página existe para validar a navegação. Nenhum conteúdo foi
        publicado nesta área ainda.
      </p>
      <Link className="text-link" href={returnHref}>
        {returnLabel}
      </Link>
    </section>
  );
}
