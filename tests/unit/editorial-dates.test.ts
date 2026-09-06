// @vitest-environment node
import { describe, expect, it } from "vitest";
import { newsFrontmatterSchema } from "../../content.schemas";

const article = {
  slug: "data-teste",
  titulo: "Teste",
  imagemCapa: "/images/content/robotica.svg",
  resumo: "Resumo",
  autor: "Autor",
  status: "publicado",
};

describe("datas editoriais", () => {
  it.each(["2026-02-29", "2026-02-30", "2026-04-31", "2026-13-01"])(
    "rejeita a data inexistente %s",
    (dataPublicacao) => {
      expect(
        newsFrontmatterSchema.safeParse({ ...article, dataPublicacao }).success,
      ).toBe(false);
    },
  );
  it("aceita 29 de fevereiro em ano bissexto", () => {
    expect(
      newsFrontmatterSchema.safeParse({
        ...article,
        dataPublicacao: "2024-02-29",
      }).success,
    ).toBe(true);
  });
});
