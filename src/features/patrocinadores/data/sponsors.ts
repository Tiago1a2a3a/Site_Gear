import type { Sponsor } from "../types";

const sponsorData = [
  {
    name: "Universidade Federal de Minas Gerais",
    logo: "/images/sponsors/ufmg.png",
    url: "https://www.ufmg.br/",
    order: 1,
  },
  {
    name: "VERLab",
    logo: "/images/sponsors/verlab.png",
    url: "https://www.verlab.dcc.ufmg.br/",
    order: 2,
  },
  {
    name: "Escola de Engenharia da UFMG",
    logo: "/images/sponsors/escola-engenharia-ufmg.png",
    url: "https://www.eng.ufmg.br/portal/",
    order: 3,
  },
  {
    name: "Departamento de Ciência da Computação da UFMG",
    logo: "/images/sponsors/dcc-ufmg.png",
    url: "https://dcc.ufmg.br/",
    order: 4,
  },
] as const satisfies readonly Sponsor[];

export function getSponsors(data: readonly Sponsor[] = sponsorData) {
  const orders = new Set<number>();

  for (const sponsor of data) {
    if (!sponsor.name.trim()) {
      throw new Error("Patrocinador inválido: o nome é obrigatório.");
    }

    if (!sponsor.url.startsWith("https://")) {
      throw new Error(
        `Patrocinador inválido (${sponsor.name}): use uma URL HTTPS.`,
      );
    }

    if (!sponsor.logo.startsWith("/")) {
      throw new Error(
        `Patrocinador inválido (${sponsor.name}): o logo deve usar um caminho público absoluto.`,
      );
    }

    if (!Number.isInteger(sponsor.order) || sponsor.order < 0) {
      throw new Error(
        `Patrocinador inválido (${sponsor.name}): a ordem deve ser um inteiro não negativo.`,
      );
    }

    if (orders.has(sponsor.order)) {
      throw new Error(
        `Patrocinadores inválidos: a ordem ${sponsor.order} está duplicada.`,
      );
    }

    orders.add(sponsor.order);
  }

  return [...data].sort(
    (first, second) =>
      first.order - second.order ||
      first.name.localeCompare(second.name, "pt-BR"),
  );
}
