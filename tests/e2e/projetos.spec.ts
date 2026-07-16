import { expect, test } from "@playwright/test";

test("lista e abre um Projeto por URL canônica", async ({ page }) => {
  await page.goto("/projetos");
  await expect(
    page.getByRole("heading", { level: 1, name: "Projetos" }),
  ).toBeVisible();
  const card = page
    .locator(".project-card")
    .filter({ hasText: "Robô móvel de demonstração" });
  await expect(card).toContainText("em andamento");
  await expect(card).toContainText("ESP32");
  await card
    .getByRole("link", { name: "Robô móvel de demonstração", exact: true })
    .click();
  await expect(page).toHaveURL(/\/projetos\/robo-exemplo$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Robô móvel de demonstração" }),
  ).toBeVisible();
});

test("detalhe apresenta mídia e omite recursos opcionais ausentes", async ({
  page,
}) => {
  await page.goto("/projetos/robo-exemplo");
  await expect(
    page.getByRole("region", { name: /Galeria do projeto/ }),
  ).toBeVisible();
  await expect(page.locator(".video-embed iframe")).toHaveAttribute(
    "src",
    /youtube-nocookie/,
  );

  await expect(
    page.getByRole("heading", { name: "Recursos do projeto" }),
  ).toHaveCount(0);
});

test("slug inexistente de Projeto responde com 404", async ({ request }) => {
  expect((await request.get("/projetos/nao-existe")).status()).toBe(404);
});

test("Projeto em destaque aparece na Home e páginas não têm overflow móvel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(
    page.getByRole("link", {
      name: "Robô móvel de demonstração",
      exact: true,
    }),
  ).toHaveAttribute("href", "/projetos/robo-exemplo");

  for (const rota of ["/", "/projetos", "/projetos/robo-exemplo"]) {
    await page.goto(rota);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow, `${rota} não deve ter overflow horizontal`).toBe(false);
  }
});
