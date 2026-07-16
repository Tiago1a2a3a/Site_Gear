import Image from "next/image";
import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";
import { ConteudoMDX } from "@shared/components/ui/ConteudoMDX";
import { formatarDataLonga } from "@shared/lib/formatar-data";

import type { Noticia } from "../types";

export function NoticiaDetalhe({ noticia }: Readonly<{ noticia: Noticia }>) {
  return (
    <article className="news-detail-page">
      <Breadcrumbs
        items={[
          { href: "/noticias", label: "Notícias" },
          { label: noticia.titulo },
        ]}
      />

      <header className="news-detail-header">
        <div>
          <div className="news-detail-meta">
            {noticia.categoria ? <Badge>{noticia.categoria}</Badge> : null}
            <time dateTime={noticia.dataPublicacao}>
              {formatarDataLonga(noticia.dataPublicacao)}
            </time>
            <span>Por {noticia.autor}</span>
          </div>
          <h1>{noticia.titulo}</h1>
          <p>{noticia.resumo}</p>
        </div>
        <Image
          alt=""
          className="news-detail-cover"
          height={675}
          priority
          sizes="(max-width: 48rem) 100vw, 45vw"
          src={noticia.imagemCapa}
          width={1200}
        />
      </header>

      <ConteudoMDX className="news-content" codigo={noticia.conteudo} />

      <Link className="text-link" href="/noticias">
        Voltar para Notícias
      </Link>
    </article>
  );
}
