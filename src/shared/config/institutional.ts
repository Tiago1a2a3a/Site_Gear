export type ResearchArea = Readonly<{
  description: string;
  name: string;
  shortCode: string;
}>;

export const institutionalContent = {
  eyebrow: "Grupo de Estudos Avançados em Robótica — UFMG",
  heroDescription:
    "Aprenda robótica, acompanhe projetos desenvolvidos por estudantes e transforme conhecimento em soluções reais.",
  mission:
    "O GEAR aproxima estudantes da robótica por meio de estudo colaborativo, experimentação e desenvolvimento de projetos que conectam teoria e prática.",
  researchAreas: [
    {
      shortCode: "AUT",
      name: "Automação e controle",
      description:
        "Sistemas que percebem, decidem e atuam com precisão em desafios do mundo real.",
    },
    {
      shortCode: "EMB",
      name: "Sistemas embarcados",
      description:
        "Eletrônica e programação integradas para criar dispositivos eficientes e confiáveis.",
    },
    {
      shortCode: "MEC",
      name: "Mecatrônica",
      description:
        "Integração entre mecânica, eletrônica e computação no desenvolvimento de robôs.",
    },
  ],
} as const satisfies Readonly<{
  eyebrow: string;
  heroDescription: string;
  mission: string;
  researchAreas: readonly ResearchArea[];
}>;
