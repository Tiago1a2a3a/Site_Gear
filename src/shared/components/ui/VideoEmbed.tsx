function obterEmbedDoYoutube(url: string) {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1);
    if (parsed.hostname.endsWith("youtube.com"))
      return parsed.searchParams.get("v");
  } catch {
    return null;
  }
  return null;
}

export function VideoEmbed({
  titulo,
  url,
}: Readonly<{ titulo: string; url: string }>) {
  const videoId = obterEmbedDoYoutube(url);
  if (!videoId) return null;

  return (
    <div className="video-embed">
      <iframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={titulo}
      />
    </div>
  );
}
