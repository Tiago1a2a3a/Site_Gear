import { expect, test } from "@playwright/test";

test("Curso apresenta suas aulas em ordem", async ({ page }) => {
  await page.goto("/aprendizado/cursos/fundamentos-robotica");

  await expect(
    page.getByRole("heading", { level: 1, name: "Fundamentos de robótica" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Inscrever-se" }),
  ).toBeVisible();
  await expect(page.locator(".course-lesson-list > li")).toHaveCount(3);
});

test("Trilha apresenta cursos e aulas diretas", async ({ page }) => {
  await page.goto("/aprendizado/trilhas/robotica-do-zero");
  await expect(
    page.getByRole("heading", { level: 1, name: "Robótica do zero" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Inscrever-se" }),
  ).toBeVisible();
  await expect(page.locator(".trail-path-list > li")).toHaveCount(3);
});

test("slugs demonstrativos removidos de Curso e Trilha respondem com 404", async ({
  request,
}) => {
  for (const path of [
    "/aprendizado/cursos/conteudo-demonstrativo-removido",
    "/aprendizado/cursos/nao-existe",
    "/aprendizado/trilhas/conteudo-demonstrativo-removido",
    "/aprendizado/trilhas/nao-existe",
  ]) {
    expect((await request.get(path)).status()).toBe(404);
  }
});

test("listagens e percurso funcionam sem overflow no móvel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });

  for (const path of [
    "/aprendizado/cursos",
    "/aprendizado/trilhas",
    "/aprendizado/trilhas/robotica-do-zero",
  ]) {
    await page.goto(path);
    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow, `${path} não deve ter overflow horizontal`).toBe(false);
  }
});
