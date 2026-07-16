import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(
  page: import("@playwright/test").Page,
) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test("menu móvel abre e fecha por teclado sem prender o foco", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");

  const menuButton = page.getByRole("button", { name: "Abrir menu" });
  await menuButton.focus();
  await page.keyboard.press("Enter");

  const firstLink = page
    .getByRole("navigation", { name: "Navegação principal móvel" })
    .getByRole("link", { name: "Aprendizado" });
  await expect(firstLink).toBeFocused();

  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Abrir menu" })).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Navegação principal móvel" }),
  ).toHaveCount(0);
});

test("não há overflow horizontal no móvel estreito", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/aprendizado/trilhas/busca");
  await expectNoHorizontalOverflow(page);
});

test("não há overflow horizontal no desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/aprendizado/trilhas/busca");
  await expectNoHorizontalOverflow(page);
});
