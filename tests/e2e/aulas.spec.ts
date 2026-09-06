import { expect, test } from "@playwright/test";

test("visitante lista e abre a aula Introdução à robótica", async ({
  page,
}) => {
  await page.goto("/aprendizado/aulas");

  await expect(
    page.getByRole("heading", { level: 1, name: "Aulas" }),
  ).toBeVisible();
  await page
    .getByRole("link", { name: "Abrir aula: Introdução à robótica" })
    .click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Introdução à robótica" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Objetivos" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Marcar como concluída" }),
  ).toBeVisible();
});

test("slugs inexistentes e demonstrativos removidos respondem com 404", async ({
  request,
}) => {
  for (const slug of ["nao-existe", "conteudo-demonstrativo-removido"]) {
    const response = await request.get(`/aprendizado/aulas/${slug}`);
    expect(response.status()).toBe(404);
  }
});

test("Aula permanece legível e sem overflow no móvel", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/aprendizado/aulas/introducao-robotica");

  const hasHorizontalOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasHorizontalOverflow).toBe(false);

  const headings = await page
    .locator("article h1, article h2")
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        level: node.tagName,
        text: node.textContent?.trim(),
      })),
    );
  expect(headings[0]).toEqual({
    level: "H1",
    text: "Introdução à robótica",
  });
  expect(headings.slice(1).every((heading) => heading.level === "H2")).toBe(
    true,
  );
});
