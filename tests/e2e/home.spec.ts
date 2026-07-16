import { expect, test } from "@playwright/test";

test("abre a página inicial com os landmarks públicos", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Conhecimento que move ideias.",
    }),
  ).toBeVisible();
  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("main")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
});

test("expõe os CTAs principais, aprendizado e Projeto em destaque", async ({
  page,
}) => {
  await page.goto("/");

  await expect(
    page.getByRole("link", { name: "Explorar aprendizado" }),
  ).toHaveAttribute("href", "/aprendizado");
  await expect(
    page.getByRole("link", { name: "Conhecer projetos" }),
  ).toHaveAttribute("href", "/projetos");
  await expect(page.getByText("Trilhas em preparação")).toBeVisible();
  await expect(
    page.getByRole("link", {
      name: "Robô móvel de demonstração",
      exact: true,
    }),
  ).toHaveAttribute("href", "/projetos/robo-exemplo");
});

for (const viewport of [
  { name: "móvel", width: 360, height: 800 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1280, height: 800 },
]) {
  test(`mantém a Home legível e operável no ${viewport.name}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    const primaryCta = page.getByRole("link", {
      name: "Explorar aprendizado",
    });
    await expect(primaryCta).toBeVisible();

    const box = await primaryCta.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);

    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
}
