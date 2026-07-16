import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Space_Grotesk } from "next/font/google";

import { siteConfig } from "@shared/config/site";
import "@styles/globals.css";

const displayFont = Space_Grotesk({
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  subsets: ["latin"],
  variable: "--font-display",
  weight: "variable",
});

const bodyFont = IBM_Plex_Sans({
  display: "swap",
  fallback: ["Arial", "sans-serif"],
  subsets: ["latin"],
  variable: "--font-body",
  weight: "variable",
});

const utilityFont = IBM_Plex_Mono({
  display: "swap",
  fallback: ["Consolas", "monospace"],
  subsets: ["latin"],
  variable: "--font-utility",
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL ?? "http://localhost:3000"),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="pt-BR">
      <body
        className={`${displayFont.variable} ${bodyFont.variable} ${utilityFont.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
