import type { MetadataRoute } from "next";

import { courses, lessons, news, projects, trails } from "../../.velite";

const publicRoutes = [
  "",
  "/aprendizado",
  "/aprendizado/aulas",
  "/aprendizado/aulas/busca",
  "/aprendizado/cursos",
  "/aprendizado/cursos/busca",
  "/aprendizado/trilhas",
  "/aprendizado/trilhas/busca",
  "/aprendizado/busca",
  "/projetos",
  "/noticias",
  "/sobre",
  "/patrocinadores",
  "/privacidade",
  "/termos",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL ?? "http://localhost:3000";
  const dynamicRoutes = [
    ...lessons
      .filter((item) => item.status === "publicado")
      .map((item) => `/aprendizado/aulas/${item.slug}`),
    ...courses
      .filter((item) => item.status === "publicado")
      .map((item) => `/aprendizado/cursos/${item.slug}`),
    ...trails
      .filter((item) => item.status === "publicado")
      .map((item) => `/aprendizado/trilhas/${item.slug}`),
    ...projects.map((item) => `/projetos/${item.slug}`),
    ...news.map((item) => `/noticias/${item.slug}`),
  ];

  return [...publicRoutes, ...dynamicRoutes].map((path) => ({
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.7,
    url: new URL(path || "/", baseUrl).toString(),
  }));
}
