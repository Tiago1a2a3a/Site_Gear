import { expect, test } from "@playwright/test";

const plannedRoutes = [
  ["/", "Conhecimento que move ideias."],
  ["/aprendizado", "Aprendizado"],
  ["/aprendizado/trilhas", "Trilhas"],
  ["/aprendizado/trilhas/busca", "Trilhas"],
  ["/aprendizado/trilhas/robotica-inicial", "Primeiros passos em robótica"],
  ["/aprendizado/cursos", "Cursos"],
  ["/aprendizado/cursos/busca", "Cursos"],
  ["/aprendizado/cursos/git-para-robotica", "Git para projetos de robótica"],
  ["/aprendizado/aulas", "Aulas"],
  ["/aprendizado/aulas/busca", "Aulas"],
  ["/aprendizado/aulas/introducao-robotica", "Introdução à robótica"],
  ["/projetos", "Projetos"],
  ["/projetos/robo-exemplo", "Robô móvel de demonstração"],
  ["/noticias", "Notícias"],
  ["/noticias/fundacao-mdx", "Portal adota conteúdo estruturado em MDX"],
  ["/sobre", "Sobre o GEAR"],
  ["/patrocinadores", "Patrocinadores e parceiros"],
  ["/privacidade", "Privacidade"],
  ["/termos", "Termos de uso"],
] as const;

test("todas as rotas planejadas respondem sem 404 inesperada", async ({
  page,
}) => {
  for (const [path, heading] of plannedRoutes) {
    const response = await page.goto(path);

    expect(response?.status(), `${path} deve responder com sucesso`).toBe(200);
    await expect(
      page.getByRole("heading", { level: 1, name: heading }),
    ).toBeVisible();
  }
});

test("links internos da navegação principal e do rodapé são válidos", async ({
  page,
  request,
}) => {
  await page.goto("/");

  const hrefs = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) =>
      Array.from(
        new Set(
          links
            .map((link) => link.getAttribute("href"))
            .filter(
              (href) =>
                Boolean(href) &&
                !["/404", "/login", "/meu-aprendizado"].includes(href!),
            ),
        ),
      ),
    );

  for (const href of hrefs) {
    const response = await request.get(href!);
    expect(response.status(), `${href} não deve estar quebrado`).toBeLessThan(
      400,
    );
  }
});

test("indica a página atual na navegação desktop", async ({ page }) => {
  await page.goto("/projetos");

  await expect(
    page
      .getByRole("navigation", { name: "Navegação principal", exact: true })
      .getByRole("link", { name: "Projetos" }),
  ).toHaveAttribute("aria-current", "page");
});

test("exibe os parceiros no layout global com links seguros", async ({
  page,
}) => {
  await page.goto("/aprendizado");

  const sponsorRegion = page.getByRole("complementary", {
    name: "Quem apoia o GEAR",
  });
  await expect(sponsorRegion).toBeVisible();
  await expect(
    sponsorRegion.getByRole("link", {
      name: /Universidade Federal de Minas Gerais.*abre em nova aba/,
    }),
  ).toHaveAttribute("rel", "noreferrer");
});

test("URL inexistente mostra a página 404 e um retorno funcional", async ({
  page,
}) => {
  const response = await page.goto("/rota-que-nao-existe");

  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
  ).toBeVisible();

  await page
    .getByRole("link", { name: "Voltar para a página inicial" })
    .click();
  await expect(page).toHaveURL(/\/$/);
});

test("grupo de avisos usa a 404 enquanto o link oficial não existe", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Grupo de avisos no WhatsApp" }).click();

  await expect(
    page.getByRole("heading", { level: 1, name: "Página não encontrada" }),
  ).toBeVisible();
});

test("rotas pessoais existem e preservam o acesso publico", async ({
  page,
  request,
}) => {
  for (const rota of ["/meu-aprendizado", "/login"]) {
    expect((await request.get(rota)).status()).toBe(200);
  }

  await page.goto("/");
  await page
    .getByRole("link", { exact: true, name: "Aprendizado" })
    .first()
    .focus();
  await expect(
    page.getByRole("link", { name: "Meu aprendizado" }).first(),
  ).toHaveAttribute("href", "/meu-aprendizado");
  await expect(
    page.getByRole("link", { name: "Login" }).first(),
  ).toHaveAttribute("href", "/login");

  await page.goto("/meu-aprendizado");
  await expect(
    page.getByRole("heading", { name: /acompanhe cursos, trilhas/i }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );

  await page.goto("/login");
  await expect(
    page.getByRole("heading", { name: /entre para acompanhar/i }),
  ).toBeVisible();
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    /noindex/,
  );

  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).not.toContain("/login");
  expect(sitemap).not.toContain("/meu-aprendizado");
});

test("Aprendizado apresenta as três formas de explorar conteúdo", async ({
  page,
}) => {
  await page.goto("/aprendizado");

  await expect(
    page.getByRole("heading", { level: 1, name: "Aprendizado" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Explorar" })).toBeVisible();

  for (const area of ["Aulas", "Cursos", "Trilhas"]) {
    await expect(
      page.getByRole("link", { name: `Explorar ${area}` }),
    ).toHaveAttribute("href", `/aprendizado/${area.toLowerCase()}`);
  }
});
