import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ProjetoCard } from "@features/projetos/components/ProjetoCard";
import { LinkExterno } from "@features/projetos/components/ProjetoDetalhe";
import { ProjetoGaleria } from "@features/projetos/components/ProjetoGaleria";
import {
  encontrarProjetoPorSlug,
  listarProjetosAleatorios,
  listarProjetos,
  listarProjetosEmDestaque,
  ordenarProjetos,
} from "@features/projetos/data/projetos";
import type { Projeto } from "@features/projetos/types";

afterEach(cleanup);

describe("Projetos", () => {
  it("lista em ordem estável e limita destaques", () => {
    const projetos = listarProjetos();
    expect(projetos).toEqual(ordenarProjetos(projetos));
    expect(listarProjetosEmDestaque(1)).toHaveLength(1);
    expect(listarProjetosEmDestaque(1)[0]?.destaque).toBe(true);
    expect(encontrarProjetoPorSlug("robo-exemplo")?.titulo).toBe(
      "Robô móvel de demonstração",
    );
  });

  it("sorteia uma seleção limitada de projetos", () => {
    const projetos = listarProjetosAleatorios(2);

    expect(projetos).toHaveLength(2);
    expect(
      projetos.every((projeto) =>
        listarProjetos().some((item) => item.slug === projeto.slug),
      ),
    ).toBe(true);
  });

  it("usa fallback e omite tecnologias ausentes no card", () => {
    const projeto: Projeto = {
      conteudo: "",
      descricaoCurta: "Descrição curta",
      slug: "sem-opcionais",
      sourcePath: "projetos/sem-opcionais",
      status: "em andamento",
      titulo: "Projeto sem opcionais",
    };
    const { container } = render(<ProjetoCard projeto={projeto} />);

    expect(screen.getByRole("heading", { name: projeto.titulo })).toBeDefined();
    expect(
      screen.queryByRole("list", { name: "Tecnologias utilizadas" }),
    ).toBeNull();
    expect(container.querySelector("img")).toHaveProperty(
      "src",
      expect.stringContaining("placeholder.svg"),
    );
  });

  it("navega pela galeria com botões e setas", () => {
    render(
      <ProjetoGaleria
        imagens={[
          "/images/content/placeholder.svg",
          "/images/content/demo/emoji-coracao.jpg",
        ]}
        titulo="Projeto teste"
      />,
    );
    const galeria = screen.getByRole("region", {
      name: "Galeria do projeto Projeto teste",
    });

    expect(
      screen.getByAltText("Imagem 1 do projeto Projeto teste"),
    ).toBeDefined();
    fireEvent.keyDown(galeria, { key: "ArrowRight" });
    expect(
      screen.getByAltText("Imagem 2 do projeto Projeto teste"),
    ).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: "Imagem anterior" }));
    expect(
      screen.getByAltText("Imagem 1 do projeto Projeto teste"),
    ).toBeDefined();
  });

  it("protege e identifica links externos opcionais", () => {
    render(
      <LinkExterno href="https://example.com/projeto">
        Ver documentação
      </LinkExterno>,
    );
    const link = screen.getByRole("link", { name: /Ver documentação/ });
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noreferrer");
    expect(link.getAttribute("href")).toBe("https://example.com/projeto");
  });
});
