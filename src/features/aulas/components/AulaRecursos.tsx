import type { Aula } from "../types";

function obterEmbedDoYoutube(url: string) {
  const parsedUrl = new URL(url);
  const videoId =
    parsedUrl.hostname === "youtu.be"
      ? parsedUrl.pathname.slice(1)
      : parsedUrl.searchParams.get("v");

  return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}` : null;
}

export function AulaRecursos({ aula }: Readonly<{ aula: Aula }>) {
  const temRecursos = Boolean(
    aula.videos?.length ||
    aula.linksExternos?.length ||
    aula.downloads?.length ||
    aula.repositorioGithub,
  );

  if (!temRecursos) return null;

  return (
    <section aria-labelledby="recursos-da-aula" className="lesson-resources">
      <h2 id="recursos-da-aula">Recursos da aula</h2>
      {aula.videos?.map((video) => {
        const embed = obterEmbedDoYoutube(video);
        return embed ? (
          <div className="video-frame" key={video}>
            <iframe
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              src={embed}
              title={`Vídeo de apoio: ${aula.titulo}`}
            />
          </div>
        ) : (
          <p key={video}>
            <a href={video} rel="noreferrer" target="_blank">
              Assistir vídeo (abre em nova aba)
            </a>
          </p>
        );
      })}
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
