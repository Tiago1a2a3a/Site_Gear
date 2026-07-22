import { expect, test } from "@playwright/test";

for (const caso of [
  {
    titulo: "Trilhas",
    tipo: "trilha",
    rota: "/aprendizado/trilhas?q=robotica",
  },
  { titulo: "Cursos", tipo: "curso", rota: "/aprendizado/cursos?q=robotica" },
  { titulo: "Aulas", tipo: "aula", rota: "/aprendizado/aulas?q=robotica" },
]) {
  test(`busca de ${caso.tipo} não mistura classificações`, async ({ page }) => {
    await page.goto(caso.rota);
    await expect(
      page.getByRole("heading", { level: 1, name: caso.titulo }),
    ).toBeVisible();
    await expect(page.locator(".search-result-card").first()).toBeVisible();
    const cards = page.locator(".search-result-card");
    expect(await cards.count()).toBeGreaterThan(0);
    for (const card of await cards.all()) {
      await expect(card).toHaveAttribute(
        "aria-label",
        new RegExp(`^Abrir ${caso.tipo}:`),
      );
    }
  });
}

test("termo e filtro ficam na URL e usam interseção", async ({ page }) => {
  await page.goto("/aprendizado/cursos?q=robotica");
  await page
    .locator("details", { hasText: "Dificuldade" })
    .locator("summary")
    .click();
  await page.getByLabel("intermediário").check();
  await expect(page).toHaveURL(/q=robotica.*dificuldade=intermedi%C3%A1rio/);
  await expect(page.getByText("2 resultados", { exact: true })).toBeVisible();
  await page.locator("details", { hasText: "Tags" }).locator("summary").click();
  await page.getByLabel("firmware").check();
  await expect(page).toHaveURL(/tag=firmware/);
  await expect(page.getByText("1 resultado", { exact: true })).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Programação para robótica" }),
  ).toBeVisible();
  await page.goBack();
  await expect(page.getByLabel("firmware")).not.toBeChecked();
  await expect(page.getByText("2 resultados", { exact: true })).toBeVisible();
});

test("categoria permite buscar e ordenar opções", async ({ page }) => {
  await page.goto("/aprendizado/cursos");
  await page
    .locator("details", { hasText: "Categoria" })
    .locator("summary")
    .click();

  await expect(page.getByLabel("Buscar em Categoria")).toBeVisible();
  await expect(page.getByLabel("Ordenar Categoria")).toBeVisible();
});

test("área permite buscar e ordenar opções", async ({ page }) => {
  await page.goto("/aprendizado/trilhas");
  await page.locator("details", { hasText: "Área" }).locator("summary").click();

  await expect(page.getByLabel("Buscar em Área")).toBeVisible();
  await expect(page.getByLabel("Ordenar Área")).toBeVisible();
});

test("resultados são limitados a 12 itens por página", async ({ page }) => {
  await page.goto("/aprendizado/aulas");

  await expect(page.locator(".search-result-card")).toHaveCount(12);
  await expect(page.locator(".search-result-card > p")).toHaveCount(0);
  await expect(page.getByText("Página 1 de 2", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Próxima" }).click();
  await expect(page).toHaveURL(/pagina=2/);
  const itensNaUltimaPagina = await page.locator(".search-result-card").count();
  expect(itensNaUltimaPagina).toBeGreaterThan(0);
  expect(itensNaUltimaPagina).toBeLessThanOrEqual(12);
  await expect(page.getByText("Página 2 de 2", { exact: true })).toBeVisible();
});

test("drawer móvel gerencia foco, fecha por teclado e não causa overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });
  await page.goto("/aprendizado/aulas/busca?q=robotica");

  const trigger = page.getByRole("button", { name: "Filtros", exact: true });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Filtrar resultados" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("button", { name: "Fechar" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();

  const hasOverflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth >
      document.documentElement.clientWidth,
  );
  expect(hasOverflow).toBe(false);
});
