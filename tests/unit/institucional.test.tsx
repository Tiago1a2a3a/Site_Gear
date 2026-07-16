import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { MemberGrid } from "@features/institucional/components/MemberGrid";
import { ResearchAreaGrid } from "@features/institucional/components/ResearchAreaGrid";
import { institutionalContent } from "@shared/config/institutional";

afterEach(cleanup);

describe("conteúdo institucional", () => {
  it("renderiza as áreas a partir da fonte institucional única", () => {
    render(<ResearchAreaGrid areas={institutionalContent.researchAreas} />);

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(
      institutionalContent.researchAreas.length,
    );
    expect(screen.getByText("Automação e controle")).toBeDefined();
  });

  it("não inventa membros quando a lista aprovada está vazia", () => {
    render(
      <MemberGrid
        emptyMessage={institutionalContent.membersIntroduction}
        members={institutionalContent.members}
      />,
    );

    expect(screen.getByText("Equipe em atualização")).toBeDefined();
    expect(
      screen.getByText(institutionalContent.membersIntroduction),
    ).toBeDefined();
  });

  it("aceita dados nominais estruturados sem duplicá-los na UI", () => {
    render(
      <MemberGrid
        emptyMessage="Sem membros"
        members={[{ name: "Pessoa Exemplo", role: "Pesquisa" }]}
      />,
    );

    expect(
      screen.getByRole("list", { name: "Integrantes do GEAR" }),
    ).toBeDefined();
    expect(screen.getByText("Pessoa Exemplo")).toBeDefined();
    expect(screen.getByText("Pesquisa")).toBeDefined();
  });
});
