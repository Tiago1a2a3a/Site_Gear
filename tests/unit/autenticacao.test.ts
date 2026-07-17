import { describe, expect, it } from "vitest";

import {
  buildLoginPath,
  normalizeInternalPath,
} from "@shared/lib/internal-redirect";

describe("retorno seguro do OAuth", () => {
  it("preserva somente rotas internas validas", () => {
    expect(normalizeInternalPath("/aprendizado/cursos/arduino?tab=a")).toBe(
      "/aprendizado/cursos/arduino?tab=a",
    );
    expect(normalizeInternalPath("https://example.com")).toBe(
      "/meu-aprendizado",
    );
    expect(normalizeInternalPath("//example.com")).toBe("/meu-aprendizado");
    expect(normalizeInternalPath("/%2f%2fexample.com")).toBe(
      "/meu-aprendizado",
    );
    expect(normalizeInternalPath("/\\example.com")).toBe("/meu-aprendizado");
  });

  it("codifica a rota de origem no link de login", () => {
    expect(buildLoginPath("/aprendizado/aulas/aula-1?acao=concluir-aula")).toBe(
      "/login?next=%2Faprendizado%2Faulas%2Faula-1%3Facao%3Dconcluir-aula",
    );
  });
});
