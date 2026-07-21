import type { Aula } from "../types";

export function AulaRecursos({ aula }: Readonly<{ aula: Aula }>) {
  const temRecursos = Boolean(
    aula.linksExternos?.length ||
    aula.downloads?.length ||
    aula.repositorioGithub,
  );

  if (!temRecursos) return null;

  return (
    <section aria-labelledby="recursos-da-aula" className="lesson-resources">
      <h2 id="recursos-da-aula">Recursos da aula</h2>
      <ul className="resource-list">
        {aula.linksExternos?.map((link) => (
          <li key={link.url}>
            <a href={link.url} rel="noreferrer" target="_blank">
              {link.titulo} (abre em nova aba)
            </a>
          </li>
        ))}
        {aula.downloads?.map((download) => (
          <li key={download.arquivo}>
            <a download href={download.arquivo}>
              Baixar {download.titulo}
            </a>
          </li>
        ))}
        {aula.repositorioGithub ? (
          <li>
            <a href={aula.repositorioGithub} rel="noreferrer" target="_blank">
              Repositório no GitHub (abre em nova aba)
            </a>
          </li>
        ) : null}
      </ul>
    </section>
  );
}
