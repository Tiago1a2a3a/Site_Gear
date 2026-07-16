import Image from "next/image";
import Link from "next/link";

import { Card } from "@shared/components/ui/Card";
import { formatarDataLonga } from "@shared/lib/formatar-data";

import type { DocumentoBuscaNoticia, Noticia } from "../types";

type DadosDoCard = Pick<
  Noticia,
  "dataPublicacao" | "imagemCapa" | "resumo" | "slug" | "titulo"
>;

function dadosDoDocumento(documento: DocumentoBuscaNoticia): DadosDoCard {
  return documento;
}

export function NoticiaCard({
  noticia,
}: Readonly<{ noticia: DadosDoCard | DocumentoBuscaNoticia }>) {
  const dados = "id" in noticia ? dadosDoDocumento(noticia) : noticia;

  return (
    <Card className="news-card">
      <Link
        aria-label={`Abrir notícia: ${dados.titulo}`}
        className="news-card__image"
        href={`/noticias/${dados.slug}`}
      >
        <Image
          alt=""
          fill
          sizes="(max-width: 48rem) 100vw, 33vw"
          src={dados.imagemCapa}
        />
      </Link>
      <div className="news-card__body">
        <time dateTime={dados.dataPublicacao}>
          {formatarDataLonga(dados.dataPublicacao)}
        </time>
        <h2>
          <Link href={`/noticias/${dados.slug}`}>{dados.titulo}</Link>
        </h2>
        <p>{dados.resumo}</p>
        <Link
          className="text-link news-card__link"
          href={`/noticias/${dados.slug}`}
        >
          Ler notícia
        </Link>
      </div>
    </Card>
  );
}
