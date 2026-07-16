import path from "node:path";

import { describe, expect, it } from "vitest";

import type {
  ContentCollections,
  Course,
  Lesson,
  Trail,
} from "../../content.schemas";
import { prepareContent, validateContent } from "../../content.validation";

const content = "export default function MDXContent() {}";

function lesson(slug: string, overrides: Partial<Lesson> = {}): Lesson {
  return {
    slug,
    titulo: slug,
    resumo: `Resumo de ${slug}`,
    dificuldade: "iniciante",
    dataPublicacao: "2026-07-15",
    autores: ["Equipe GEAR"],
    status: "publicado",
    permiteComentarios: false,
    conteudo: content,
    sourcePath: `aprendizado/aulas/${slug}`,
    ...overrides,
  };
}

function course(overrides: Partial<Course> = {}): Course {
  return {
    slug: "curso-base",
    titulo: "Curso base",
    descricao: "Descrição do curso base",
    imagemCapa: "/images/content/placeholder.svg",
    dificuldade: "iniciante",
    aulaSlugs: ["aula-base"],
    status: "publicado",
    conteudo: content,
    sourcePath: "aprendizado/cursos/curso-base",
    ...overrides,
  };
}

function trail(overrides: Partial<Trail> = {}): Trail {
  return {
    slug: "trilha-base",
    titulo: "Trilha base",
    descricaoCurta: "Descrição da trilha base",
    imagemCapa: "/images/content/placeholder.svg",
    area: "Robótica",
    ordem: 1,
    itens: [{ tipo: "curso", slug: "curso-base" }],
    status: "publicado",
    conteudo: content,
    sourcePath: "aprendizado/trilhas/trilha-base",
    ...overrides,
  };
}

function data(overrides: Partial<ContentCollections> = {}): ContentCollections {
  return {
    lessons: [lesson("aula-base")],
    courses: [course()],
    trails: [trail()],
    projects: [],
    news: [],
    ...overrides,
  };
}

const options = { publicDirectory: path.resolve("public") };

describe("validação cruzada do conteúdo", () => {
  it("aceita uma estrutura publicada e íntegra", () => {
    expect(() => validateContent(data(), options)).not.toThrow();
  });

  it("identifica slugs duplicados e os dois arquivos de origem", () => {
    expect(() =>
      validateContent(
        data({
          lessons: [
            lesson("repetida", { sourcePath: "aulas/primeira" }),
            lesson("repetida", { sourcePath: "aulas/segunda" }),
          ],
        }),
        options,
      ),
    ).toThrow(/aulas\/primeira.*aulas\/segunda/);
  });

  it("rejeita referência inválida e curso publicado vazio", () => {
    expect(() =>
      validateContent(
        data({ courses: [course({ aulaSlugs: ["ausente"] })] }),
        options,
      ),
    ).toThrow(/aulaSlugs.*ausente/);

    expect(() =>
      validateContent(data({ courses: [course({ aulaSlugs: [] })] }), options),
    ).toThrow("Curso publicado deve conter ao menos uma Aula");
  });

  it("detecta ciclos de pré-requisitos entre aulas", () => {
    expect(() =>
      validateContent(
        data({
          lessons: [
            lesson("a", { preRequisitos: ["b"] }),
            lesson("b", { preRequisitos: ["a"] }),
          ],
          courses: [],
          trails: [],
        }),
        options,
      ),
    ).toThrow(/Ciclo.*Aula:a -> Aula:b -> Aula:a/);
  });

  it("detecta ciclos de pré-requisitos entre Cursos", () => {
    expect(() =>
      validateContent(
        data({
          courses: [
            course({
              slug: "curso-a",
              sourcePath: "cursos/a",
              preRequisitos: ["curso-b"],
            }),
            course({
              slug: "curso-b",
              sourcePath: "cursos/b",
              preRequisitos: ["curso-a"],
            }),
          ],
          trails: [],
        }),
        options,
      ),
    ).toThrow(/Ciclo.*Curso:curso-a -> Curso:curso-b -> Curso:curso-a/);
  });

  it("rejeita mídia local inexistente", () => {
    expect(() =>
      validateContent(
        data({ trails: [trail({ imagemCapa: "/images/inexistente.svg" })] }),
        options,
      ),
    ).toThrow(/arquivo inexistente.*inexistente/);
  });

  it("remove rascunhos, aplica ordem estável e preserva relações editoriais", () => {
    const originalItems = trail().itens;
    const prepared = prepareContent(
      data({
        lessons: [
          lesson("z-publicada", { titulo: "Zeta" }),
          lesson("rascunho", { status: "rascunho" }),
          lesson("a-publicada", { titulo: "Alfa" }),
        ],
        courses: [],
        trails: [
          trail({ slug: "segunda", ordem: 2, itens: originalItems }),
          trail({ slug: "rascunho", status: "rascunho" }),
          trail({ slug: "primeira", ordem: 1 }),
        ],
      }),
    );

    expect(prepared.lessons.map((entry) => entry.slug)).toEqual([
      "a-publicada",
      "z-publicada",
    ]);
    expect(prepared.trails.map((entry) => entry.slug)).toEqual([
      "primeira",
      "segunda",
    ]);
    expect(prepared.trails[1].itens).toBe(originalItems);
  });
});
