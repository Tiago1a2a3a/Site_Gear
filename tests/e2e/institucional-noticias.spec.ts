import { expect, test } from "@playwright/test";

test("Sobre e Home compartilham o conteúdo institucional", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Robótica feita para compartilhar." }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Pessoas que movem o grupo." }),
  ).toBeVisible();

  await page.goto("/sobre");
  await expect(
    page.getByRole("heading", { level: 1, name: "Sobre o GEAR" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Robótica feita para compartilhar." }),
  ).toBeVisible();
  await expect(page.getByText("Automação e controle")).toBeVisible();
  await expect(page.getByText("Equipe em atualização")).toBeVisible();
});

test("Patrocinadores usa a grade expandida e o canal institucional", async ({
  page,
}) => {
  await page.goto("/patrocinadores");
  await expect(
    page.getByRole("heading", { level: 1, name: "Patrocinadores e parceiros" }),
  ).toBeVisible();
  await expect(
    page
      .getByRole("list", { name: "Patrocinadores e parceiros" })
      .getByRole("listitem"),
  ).toHaveCount(4);
  await expect(
    page.getByRole("link", { name: /Falar pelo LinkedIn/ }),
  ).toHaveAttribute("href", /linkedin\.com/);
});

test("Notícias lista, pesquisa e abre MDX sem misturar Aprendizado", async ({
  page,
}) => {
  await page.goto("/noticias");
  await expect(
    page.getByRole("heading", { level: 1, name: "Notícias" }),
  ).toBeVisible();

  const busca = page.getByLabel("Buscar somente em Notícias");
  await busca.fill("Portal");
  await expect(page.getByText("1 notícia")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      name: "Portal adota conteúdo estruturado em MDX",
    }),
  ).toBeVisible();

  await busca.fill("Introdução à robótica");
  await expect(page.getByText("Nenhuma notícia encontrada")).toBeVisible();

  await busca.fill("Portal");
  await page
    .getByRole("link", {
      name: "Portal adota conteúdo estruturado em MDX",
      exact: true,
    })
    .click();
  await expect(page).toHaveURL(/\/noticias\/fundacao-mdx$/);
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Portal adota conteúdo estruturado em MDX",
    }),
  ).toBeVisible();
  await expect(page.getByText(/cinco entidades editoriais/)).toBeVisible();
});

test("Notícia inexistente responde 404 e páginas não têm overflow móvel", async ({
  page,
  request,
}) => {
  expect((await request.get("/noticias/nao-existe")).status()).toBe(404);

  await page.setViewportSize({ width: 360, height: 800 });
  for (const rota of [
    "/sobre",
    "/patrocinadores",
    "/noticias",
    "/noticias/fundacao-mdx",
  ]) {
    await page.goto(rota);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(overflow, `${rota} não deve ter overflow horizontal`).toBe(false);
  }
});
