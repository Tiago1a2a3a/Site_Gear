import { describe, expect, it } from "vitest";

import { siteConfig } from "@shared/config/site";

describe("configuração central do site", () => {
  it("mantém links internos absolutos e sem duplicatas em cada grupo", () => {
    const navigationGroups = [
      siteConfig.mainNavigation,
      siteConfig.institutionalNavigation,
      siteConfig.legalNavigation,
    ];

    for (const group of navigationGroups) {
      const hrefs = group.map((item) => item.href);

      expect(hrefs.every((href) => href.startsWith("/"))).toBe(true);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it("mantém links sociais em HTTPS", () => {
    expect(
      siteConfig.socialLinks
        .filter((item) => item.opensInNewTab)
        .every((item) => item.href.startsWith("https://")),
    ).toBe(true);
  });

  it("mantém o grupo de avisos apontando para a 404 temporária", () => {
    expect(
      siteConfig.socialLinks.find((item) => item.label.includes("WhatsApp"))
        ?.href,
    ).toBe("/404");
  });
});
