import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AccountDeletionButton } from "@features/meu-aprendizado/components/AccountDeletionButton";
import { EnrollmentButton } from "@features/meu-aprendizado/components/EnrollmentButton";
import { PersonalLearningDashboard } from "@features/meu-aprendizado/components/PersonalLearningDashboard";
import {
  buildCompletedLessonSummaries,
  buildStudySummaries,
  calculateCourseProgress,
  calculateTrailProgress,
} from "@features/meu-aprendizado/services/progresso";
import type { LearningCatalog } from "@features/meu-aprendizado/types";

const catalog: LearningCatalog = {
  courses: [
    {
      aulaSlugs: ["aula-1", "aula-2", "aula-3"],
      slug: "curso-1",
      titulo: "Curso 1",
    },
  ],
  lessons: [
    { slug: "aula-1", titulo: "Aula 1" },
    { slug: "aula-2", titulo: "Aula 2" },
    { slug: "aula-3", titulo: "Aula 3" },
    { slug: "aula-direta", titulo: "Aula direta" },
  ],
  trails: [
    {
      itens: [
        { slug: "curso-1", tipo: "curso" },
        { slug: "aula-direta", tipo: "aula" },
      ],
      slug: "trilha-1",
      titulo: "Trilha 1",
    },
  ],
};

describe("progresso pessoal", () => {
  it("usa piso para Curso e cobre 0, 66 e 100 por cento", () => {
    const course = catalog.courses[0];
    expect(calculateCourseProgress(course, new Set())).toBe(0);
    expect(calculateCourseProgress(course, new Set(["aula-1", "aula-2"]))).toBe(
      66,
    );
    expect(
      calculateCourseProgress(course, new Set(["aula-1", "aula-2", "aula-3"])),
    ).toBe(100);
  });

  it("conta Curso e Aula direta como itens distintos da Trilha", () => {
    const trail = catalog.trails[0];
    expect(
      calculateTrailProgress(trail, catalog, new Set(["aula-direta"])),
    ).toBe(50);
    expect(
      calculateTrailProgress(
        trail,
        catalog,
        new Set(["aula-1", "aula-2", "aula-3", "aula-direta"]),
      ),
    ).toBe(100);
  });

  it("deriva dashboard do catalogo publicado e ignora conteudo removido", () => {
    const enrollments = [
      {
        content_identifier: "curso-1",
        content_type: "curso" as const,
        enrolled_at: "2026-07-15T10:00:00Z",
        last_activity_at: "2026-07-16T10:00:00Z",
        user_id: "user-1",
      },
      {
        content_identifier: "curso-removido",
        content_type: "curso" as const,
        enrolled_at: "2026-07-15T10:00:00Z",
        last_activity_at: "2026-07-17T10:00:00Z",
        user_id: "user-1",
      },
    ];
    const completions = [
      {
        completed_at: "2026-07-16T11:00:00Z",
        lesson_identifier: "aula-1",
        user_id: "user-1",
      },
      {
        completed_at: "2026-07-16T12:00:00Z",
        lesson_identifier: "aula-removida",
        user_id: "user-1",
      },
    ];

    expect(buildStudySummaries(enrollments, completions, catalog)).toHaveLength(
      1,
    );
    expect(buildCompletedLessonSummaries(completions, catalog)).toEqual([
      expect.objectContaining({ identifier: "aula-1", title: "Aula 1" }),
    ]);
  });
});

describe("interfaces pessoais sem Supabase configurado", () => {
  it("mantem Meu aprendizado utilizavel como apresentacao para visitante", () => {
    render(<PersonalLearningDashboard activeTab="resumo" catalog={catalog} />);
    expect(
      screen.getByRole("heading", { name: /acompanhe cursos, trilhas/i }),
    ).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Entrar com GitHub" }),
    ).toBeTruthy();
  });

  it("informa configuracao ausente ao tentar inscrever-se", () => {
    render(
      <EnrollmentButton contentIdentifier="curso-1" contentType="curso" />,
    );
    fireEvent.click(screen.getByRole("button", { name: "Inscrever-se" }));
    expect(screen.getByRole("status").textContent).toMatch(
      /ainda não foi configurado/i,
    );
  });

  it("exige confirmacao explicita para exclusao permanente", () => {
    render(<AccountDeletionButton />);
    fireEvent.click(
      screen.getByRole("button", { name: "Excluir minha conta" }),
    );
    expect(screen.getByRole("dialog")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: "Excluir permanentemente" }),
    ).toBeTruthy();
  });
});
