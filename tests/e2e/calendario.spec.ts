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

test("calendário desktop navega por mês e abre os detalhes", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/calendario");

  await expect(
    page.getByRole("heading", { level: 1, name: "Calendário" }),
  ).toBeVisible();
  await expect(page.getByTestId("calendar-month-grid")).toBeVisible();
  await expect(page.getByLabel("Legenda do calendário")).toContainText(
    "Data confirmada",
  );

  const currentMonth = await page
    .getByRole("region", { name: "Calendário mensal" })
    .getByRole("heading", { level: 2 })
    .textContent();
  await page.getByRole("button", { name: "Mostrar próximo mês" }).click();
  await expect(
    page
      .getByRole("region", { name: "Calendário mensal" })
      .getByRole("heading", { level: 2 }),
  ).not.toHaveText(currentMonth ?? "");

  await page.getByRole("button", { name: "Mostrar mês anterior" }).click();
  await page
    .getByTestId("calendar-month-grid")
    .getByRole("button", { name: /Palestra aberta de robótica/ })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Palestra aberta de robótica",
  });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Google Agenda — em breve" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expectNoHorizontalOverflow(page);
});

test("celular mostra cinco próximos eventos e permite carregar mais", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/calendario");

  await expect(page.getByTestId("calendar-month-grid")).toBeHidden();
  const upcoming = page.getByRole("region", { name: "O que vem por aí." });
  await expect(upcoming.locator(".calendar-event-list > li")).toHaveCount(5);
  await upcoming.getByRole("button", { name: "Ver mais eventos" }).click();
  await expect(upcoming.locator(".calendar-event-list > li")).toHaveCount(9);

  await upcoming
    .getByRole("button", { name: /Palestra aberta de robótica/ })
    .click();
  await expect(
    page.getByRole("dialog", { name: "Palestra aberta de robótica" }),
  ).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
