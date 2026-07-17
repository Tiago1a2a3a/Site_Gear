import { expect, test } from "@playwright/test";

test("Curso preserva a ordem e aponta para URLs canônicas das Aulas", async ({
  page,
}) => {
  await page.goto("/aprendizado/cursos/fundamentos-arduino");

  await expect(
    page.getByRole("heading", { level: 1, name: "Fundamentos de Arduino" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Inscrever-se" }),
  ).toBeVisible();
  const aulas = page.locator(".course-lesson-list > li");
  await expect(aulas).toHaveCount(4);
  await expect(aulas.nth(0)).toContainText("Fundamentos de eletrônica");
  await expect(aulas.nth(1)).toContainText("Introdução ao Arduino");
  await expect(aulas.nth(2)).toContainText("Sensores digitais e analógicos");
  await expect(aulas.nth(3)).toContainText("PWM na prática");
  await expect(
    aulas.nth(0).getByRole("link", { name: /Abrir aula/ }),
  ).toHaveAttribute(
    "href",
    "/aprendizado/aulas/fundamentos-eletronica?curso=fundamentos-arduino",
  );
});

test("Trilha mistura Curso e Aula direta na ordem e preserva contexto", async ({
  page,
}) => {
  await page.goto("/aprendizado/trilhas/robotica-do-zero");
  await expect(
    page.getByRole("button", { name: "Inscrever-se" }),
  ).toBeVisible();

  const percurso = page.locator(".trail-path-list > li");
  await expect(percurso).toHaveCount(3);
  await expect(percurso.nth(0)).toContainText("Aula direta");
  await expect(percurso.nth(0)).toContainText("Segurança em laboratório");
  await expect(percurso.nth(1)).toContainText("Curso");
  await expect(percurso.nth(1)).toContainText("Fundamentos de Arduino");
  await expect(percurso.nth(2)).toContainText("Documentação de projetos");

  await percurso
    .nth(1)
    .getByRole("link", { name: /Abrir curso/ })
    .click();
  await expect(page).toHaveURL(
    /\/aprendizado\/cursos\/fundamentos-arduino\?trilha=robotica-do-zero$/,
  );
  await expect(
    page.getByRole("navigation", { name: "Breadcrumb" }),
  ).toContainText("Robótica do zero");

  await page
    .locator(".course-lesson-list > li")
    .first()
    .getByRole("link", { name: /Abrir aula/ })
    .click();
  await expect(page).toHaveURL(
    /\/aprendizado\/aulas\/fundamentos-eletronica\?curso=fundamentos-arduino&trilha=robotica-do-zero$/,
  );
  const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
  await expect(breadcrumb).toContainText("Robótica do zero");
  await expect(breadcrumb).toContainText("Fundamentos de Arduino");
});

test("rascunhos e slugs ausentes de Curso e Trilha respondem com 404", async ({
  request,
}) => {
  for (const path of [
    "/aprendizado/cursos/curso-interno",
    "/aprendizado/cursos/nao-existe",
    "/aprendizado/trilhas/trilha-interna",
    "/aprendizado/trilhas/nao-existe",
  ]) {
    expect((await request.get(path)).status()).toBe(404);
  }
});

test("listagens e percurso funcionam sem overflow no móvel", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 780 });

  for (const path of [
    "/aprendizado/cursos",
    "/aprendizado/trilhas",
    "/aprendizado/trilhas/robotica-do-zero",
  ]) {
    await page.goto(path);
    const hasOverflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth >
        document.documentElement.clientWidth,
    );
    expect(hasOverflow, `${path} não deve ter overflow horizontal`).toBe(false);
  }
});
