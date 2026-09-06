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
  const events = page.getByTestId("calendar-month-grid").getByRole("button");
  if (await events.count()) {
    await events.first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
  }
  await expectNoHorizontalOverflow(page);
});

test("permite copiar o endereço de assinatura e expõe o feed iCalendar", async ({
  page,
}) => {
  await page.goto("/calendario");
  await page.getByRole("button", { name: "Assinar calendário" }).click();

  const dialog = page.getByRole("dialog", { name: "Assinar calendário" });
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("textbox", { name: "Endereço do calendário" }),
  ).toHaveValue(/\/calendario\/feed\.ics$/);
  await expect(
    dialog.getByRole("link", { name: "Abrir arquivo .ics" }),
  ).toHaveAttribute("href", "/calendario/feed.ics");

  const feedResponse = await page.request.get("/calendario/feed.ics");
  expect(feedResponse.ok()).toBe(true);
  expect(feedResponse.headers()["content-type"]).toContain("text/calendar");
  expect(await feedResponse.text()).toContain("BEGIN:VCALENDAR\r\n");
});

test("celular mostra cinco próximos eventos e permite carregar mais", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/calendario");

  await expect(page.getByTestId("calendar-month-grid")).toBeHidden();
  const upcoming = page.getByRole("region", { name: "O que vem por aí." });
  const events = upcoming.locator(".calendar-event-list > li");
  expect(await events.count()).toBeLessThanOrEqual(5);
  const more = upcoming.getByRole("button", { name: "Ver mais eventos" });
  if (await more.count()) {
    await more.click();
    await expect.poll(() => events.count()).toBeGreaterThan(5);
    expect(await events.count()).toBeLessThanOrEqual(10);
  }
  if (await events.count()) {
    await events.first().getByRole("button").click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  }
  await expectNoHorizontalOverflow(page);
});
