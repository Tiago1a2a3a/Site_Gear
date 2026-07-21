import Link from "next/link";

import { Badge } from "@shared/components/ui/Badge";

import { ProjetoConteudoMDX } from "./ProjetoConteudoMDX";
import { ProjetoGaleria } from "./ProjetoGaleria";
import { ProjetoTecnologias } from "./ProjetoTecnologias";
import type { Projeto } from "../types";

export function LinkExterno({
  href,
  children,
}: Readonly<{ href: string; children: string }>) {
  return (
    <a
      className="button button--secondary"
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children} <span className="visually-hidden">(abre em nova aba)</span>
    </a>
  );
}

export function ProjetoDetalhe({ projeto }: Readonly<{ projeto: Projeto }>) {
  return (
    <article className="project-detail-page">
      <nav aria-label="Breadcrumb" className="breadcrumbs">
        <ol>
          <li>
            <Link href="/projetos">Projetos</Link>
          </li>
          <li aria-current="page">{projeto.titulo}</li>
        </ol>
      </nav>

      <ProjetoGaleria imagens={projeto.imagens} titulo={projeto.titulo} />

      <header className="project-detail-header">
        <div>
          <p className="status-label">Projeto GEAR</p>
          <h1>{projeto.titulo}</h1>
          <p>{projeto.descricaoLonga ?? projeto.descricaoCurta}</p>
        </div>
        <div className="project-detail-meta">
          <Badge>{projeto.status}</Badge>
          <ProjetoTecnologias tecnologias={projeto.tecnologias} />
        </div>
      </header>

      <ProjetoConteudoMDX codigo={projeto.conteudo} />

      {projeto.repositorioGithub || projeto.documentacao ? (
        <section aria-labelledby="project-links-title" className="project-links">
          <h2 id="project-links-title">Recursos do projeto</h2>
          <div>
            {projeto.repositorioGithub ? (
              <LinkExterno href={projeto.repositorioGithub}>
                Ver no GitHub
              </LinkExterno>
            ) : null}
            {projeto.documentacao ? (
              <LinkExterno href={projeto.documentacao}>
                Ver documentação
              </LinkExterno>
            ) : null}
          </div>
        </section>
      ) : null}
    </article>
  );
}
