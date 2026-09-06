import { expect, test } from "@playwright/test";

test("lista e abre um Projeto por URL canônica", async ({ page }) => {
  await page.goto("/projetos");
  await expect(
    page.getByRole("heading", { level: 1, name: "Projetos" }),
  ).toBeVisible();
  const card = page
    .locator(".other-projects-list > li")
    .filter({ hasText: "Carrinho virtual — projeto didático" });
  await expect(card).toContainText("em andamento");
  await card
    .getByRole("link", {
      name: "Carrinho virtual — projeto didático",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/projetos\/carrinho-virtual$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Carrinho virtual — projeto didático",
    }),
  ).toBeVisible();
});

test("detalhe apresenta mídia e omite recursos opcionais ausentes", async ({
  page,
}) => {
  await page.goto("/projetos/carrinho-virtual");
  await expect(
    page.getByRole("region", { name: /Galeria do projeto/ }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Sobre o projeto",
      exact: true,
    }),
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Recursos do projeto" }),
  ).toHaveCount(0);
});

test("slug inexistente de Projeto responde com 404", async ({ request }) => {
  expect((await request.get("/projetos/nao-existe")).status()).toBe(404);
});

test("Home aponta para Projetos e páginas não têm overflow móvel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(
    page.getByRole("link", { name: "Conhecer projetos" }),
  ).toHaveAttribute("href", "/projetos");

  for (const rota of ["/", "/projetos", "/projetos/carrinho-virtual"]) {
    await page.goto(rota);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow, `${rota} não deve ter overflow horizontal`).toBe(false);
  }
});
