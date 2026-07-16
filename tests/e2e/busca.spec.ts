import { expect, test } from "@playwright/test";

for (const caso of [
  { tipo: "trilha", rota: "/aprendizado/trilhas/busca?q=robotica" },
  { tipo: "curso", rota: "/aprendizado/cursos/busca?q=robotica" },
  { tipo: "aula", rota: "/aprendizado/aulas/busca?q=robotica" },
]) {
  test(`busca de ${caso.tipo} não mistura classificações`, async ({ page }) => {
    await page.goto(caso.rota);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      /Busca de/,
    );
    await expect(page.locator(".search-result-card").first()).toBeVisible();
    const tipos = await page
      .locator(".search-result-card .badge")
      .allTextContents();
    expect(tipos.length).toBeGreaterThan(0);
    expect(
      tipos.every((tipo) => tipo.toLocaleLowerCase("pt-BR") === caso.tipo),
    ).toBe(true);
  });
}

test("termo e filtro ficam na URL e usam interseção", async ({ page }) => {
  await page.goto("/aprendizado/cursos/busca?q=robotica");
  await page.getByLabel("intermediário").check();
  await expect(page).toHaveURL(/q=robotica.*dificuldade=intermedi%C3%A1rio/);
  await expect(page.getByText("2 resultados", { exact: true })).toBeVisible();
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
