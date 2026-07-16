"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { siteConfig } from "@shared/config/site";

import { Container } from "./Container";

function isCurrentSection(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    firstMobileLinkRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  return (
    <header className="site-header">
      <Container className="header-content">
        <Link className="site-name" href="/">
          <Image
            alt="GEAR — Grupo de Estudos Avançados em Robótica"
            height={54}
            priority
            src="/images/brand/gear-logo.png"
            width={201}
          />
        </Link>

        <nav aria-label="Navegação principal" className="desktop-navigation">
          <ul className="navigation-list">
            {siteConfig.mainNavigation.map((item) => {
              const isCurrent = isCurrentSection(pathname, item.href);

              return (
                <li key={item.href}>
                  <Link
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="navigation-link"
                    data-current={isCurrent || undefined}
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          className="menu-button"
          onClick={() => setIsMenuOpen((current) => !current)}
          ref={menuButtonRef}
          type="button"
        >
          {isMenuOpen ? "Fechar menu" : "Abrir menu"}
        </button>
      </Container>

      {isMenuOpen ? (
        <nav
          aria-label="Navegação principal móvel"
          className="mobile-navigation"
          id="mobile-navigation"
        >
          <Container>
            <ul className="mobile-navigation-list">
              {siteConfig.mainNavigation.map((item, index) => {
                const isCurrent = isCurrentSection(pathname, item.href);

                return (
                  <li key={item.href}>
                    <Link
                      aria-current={pathname === item.href ? "page" : undefined}
                      className="navigation-link mobile-navigation-link"
                      data-current={isCurrent || undefined}
                      href={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
