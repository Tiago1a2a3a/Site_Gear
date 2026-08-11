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
  url: "https://site-gear.vercel.app",
  description:
    "Portal de aprendizado e projetos do Grupo de Estudos Avançados em Robótica.",
  mainNavigation: [
    { href: "/aprendizado", label: "Aprendizado" },
    { href: "/projetos", label: "Projetos" },
    { href: "/calendario", label: "Calendário" },
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
      href: "https://chat.whatsapp.com/HOL41xgwO2TJmchxJbON0h",
      label: "Grupo de avisos no WhatsApp",
      opensInNewTab: true,
    },
  ],
} as const satisfies Readonly<{
  name: string;
  url: `https://${string}`;
  description: string;
  mainNavigation: readonly NavigationItem[];
  institutionalNavigation: readonly NavigationItem[];
  legalNavigation: readonly NavigationItem[];
  socialLinks: readonly SocialLink[];
}>;
