import { expect, test } from "@playwright/test";

test("visitante lista, abre e consome uma Aula completa", async ({ page }) => {
  await page.goto("/aprendizado/aulas");

  await expect(
    page.getByRole("heading", { level: 1, name: "Aulas" }),
  ).toBeVisible();
  await expect(page.getByText("Aula em preparação")).toHaveCount(0);
  await page
    .getByRole("link", { name: "Abrir aula: Introdução à robótica" })
    .click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Introdução à robótica" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Primeiro experimento" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Recursos da aula" }),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Baixar Guia de exemplo" }),
  ).toHaveAttribute("download", "");
  await expect(page.locator("iframe[loading='lazy']")).toHaveCount(1);
  await expect(page.locator("text=Giscus")).toHaveCount(0);
});

test("pré-requisito usa a URL canônica da Aula", async ({ page }) => {
  await page.goto("/aprendizado/aulas/git-branches");

  const prerequisite = page.getByRole("link", {
    name: "Criando um repositório Git",
  });
  await expect(prerequisite).toHaveAttribute(
    "href",
    "/aprendizado/aulas/git-repositorio",
  );
});

test("slug inexistente e rascunho respondem com 404", async ({ request }) => {
  for (const slug of ["nao-existe", "rascunho-interno"]) {
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
