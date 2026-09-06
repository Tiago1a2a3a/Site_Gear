import { expect, test } from "@playwright/test";

test("preserva o percurso no breadcrumb da trilha até a aula", async ({
  page,
}) => {
  await page.goto("/aprendizado/trilhas/robotica-do-zero");
  await page
    .getByRole("link", { name: /Abrir curso: Fundamentos de robótica/ })
    .click();
  await expect(page).toHaveURL(/trilha=robotica-do-zero/);
  await page
    .getByRole("link", { name: "Abrir aula: Introdução à robótica" })
    .click();
  const breadcrumbs = page.getByRole("navigation", {
    name: "Breadcrumb",
    exact: true,
  });
  await expect(
    breadcrumbs.getByRole("link", { name: "Robótica do zero" }),
  ).toBeVisible();
  await expect(
    breadcrumbs.getByRole("link", { name: "Fundamentos de robótica" }),
  ).toBeVisible();
  await expect(
    breadcrumbs.locator('[aria-current="page"] > span:not([aria-hidden])'),
  ).toHaveText("Introdução à robótica");
});

test("código longo rola dentro do bloco sem alargar a página móvel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/aprendizado/aulas/classes-python");
  const code = page.locator("pre").first();
  await code.focus();
  await code.press("ArrowRight");
  await expect
    .poll(() => code.evaluate((element) => element.scrollLeft))
    .toBeGreaterThan(0);
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth <=
        document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test("conteúdo e breadcrumb permanecem disponíveis sem JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  try {
    await page.goto("/");
    await expect(
      page.getByRole("heading", { name: "Robótica feita para compartilhar." }),
    ).toBeVisible();
    await page.goto("/aprendizado/aulas/introducao-robotica");
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Objetivos" }),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});
