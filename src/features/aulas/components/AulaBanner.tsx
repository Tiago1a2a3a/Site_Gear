import Image from "next/image";

export function AulaBanner({
  banner,
  titulo,
}: Readonly<{ banner?: string; titulo: string }>) {
  if (!banner) return null;

  return (
    <figure className="lesson-banner">
      <Image
        alt=""
        height={675}
        priority
        sizes="(max-width: 768px) 100vw, 960px"
        src={banner}
        width={1200}
      />
      <figcaption className="visually-hidden">
        Imagem de abertura da aula {titulo}
      </figcaption>
    </figure>
  );
}
