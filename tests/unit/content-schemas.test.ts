// @vitest-environment node

import { describe, expect, it } from "vitest";

import {
  lessonFrontmatterSchema,
  trailFrontmatterSchema,
} from "../../content.schemas";

const validLesson = {
  slug: "aula-valida",
  titulo: "Aula válida",
  resumo: "Resumo editorial",
  dificuldade: "iniciante",
  dataPublicacao: "2026-07-15",
  autores: ["Equipe GEAR"],
  status: "publicado",
  permiteComentarios: false,
};

describe("schemas editoriais", () => {
  it("aceita uma Aula representativa completa", () => {
    expect(lessonFrontmatterSchema.safeParse(validLesson).success).toBe(true);
  });

  it("rejeita campo obrigatório ausente, enum, data, URL e slug inválidos", () => {
    const invalidCases = [
      { ...validLesson, titulo: undefined },
      { ...validLesson, dificuldade: "especialista" },
      { ...validLesson, dataPublicacao: "15/07/2026" },
      { ...validLesson, slug: "Aula Com Espaços" },
    ];

    for (const invalidCase of invalidCases) {
      expect(lessonFrontmatterSchema.safeParse(invalidCase).success).toBe(
        false,
      );
    }
  });

  it("impede uma quarta camada ao aceitar somente itens Curso ou Aula", () => {
    const result = trailFrontmatterSchema.safeParse({
      slug: "trilha-valida",
      titulo: "Trilha válida",
      descricaoCurta: "Descrição editorial",
      imagemCapa: "/images/content/placeholder.svg",
      area: "Robótica",
      ordem: 1,
      itens: [{ tipo: "modulo", slug: "camada-extra" }],
      status: "publicado",
    });

    expect(result.success).toBe(false);
  });
});
