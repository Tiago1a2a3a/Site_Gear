export type NavigationItem = Readonly<{
  href: `/${string}` | "/";
  label: string;
}>;

export type SocialLink = Readonly<{
  href: `https://${string}` | `/${string}`;
  label: string;
  opensInNewTab: boolean;
}>;

export const siteConfig = {
  name: "Portal GEAR",
  description:
    "Portal de aprendizado e projetos do Grupo de Estudos Avançados em Robótica.",
  mainNavigation: [
    { href: "/aprendizado", label: "Aprendizado" },
    { href: "/projetos", label: "Projetos" },
    { href: "/noticias", label: "Notícias" },
    { href: "/sobre", label: "Sobre" },
  ],
  institutionalNavigation: [
    { href: "/sobre", label: "Sobre" },
    { href: "/patrocinadores", label: "Patrocinadores" },
  ],
  legalNavigation: [
    { href: "/privacidade", label: "Privacidade" },
    { href: "/termos", label: "Termos de uso" },
  ],
  socialLinks: [
    {
      href: "https://www.linkedin.com/company/gearufmg/posts/?feedView=all",
      label: "LinkedIn",
      opensInNewTab: true,
    },
    {
      href: "https://www.instagram.com/gearufmg/",
      label: "Instagram",
      opensInNewTab: true,
    },
    {
      href: "/404",
      label: "Grupo de avisos no WhatsApp",
      opensInNewTab: false,
    },
  ],
} as const satisfies Readonly<{
  name: string;
  description: string;
  mainNavigation: readonly NavigationItem[];
  institutionalNavigation: readonly NavigationItem[];
  legalNavigation: readonly NavigationItem[];
  socialLinks: readonly SocialLink[];
}>;
