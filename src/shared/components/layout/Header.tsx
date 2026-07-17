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

export function Header({
  accountAccess,
  mobileAccountAccess,
}: Readonly<{
  accountAccess?: React.ReactNode;
  mobileAccountAccess?: React.ReactNode;
}>) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAboutMenuOpen, setIsAboutMenuOpen] = useState(false);
  const [isLearningMenuOpen, setIsLearningMenuOpen] = useState(false);
  const [isMobileAboutOpen, setIsMobileAboutOpen] = useState(false);
  const [isMobileLearningOpen, setIsMobileLearningOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMobileItemRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isMenuOpen) return;

    firstMobileItemRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;

      setIsMenuOpen(false);
      menuButtonRef.current?.focus();
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [isMenuOpen]);

  function closeMobileMenu() {
    setIsMenuOpen(false);
    setIsMobileAboutOpen(false);
    setIsMobileLearningOpen(false);
  }

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

        <div className="header-actions">
          <nav aria-label="Navegação principal" className="desktop-navigation">
            <ul className="navigation-list">
              {siteConfig.mainNavigation.map((item) => {
                const isCurrent = isCurrentSection(pathname, item.href);

                if (item.href === "/aprendizado") {
                  return (
                    <li
                      className="navigation-dropdown"
                      key={item.href}
                      onBlur={(event) => {
                        if (
                          !event.currentTarget.contains(event.relatedTarget)
                        ) {
                          setIsLearningMenuOpen(false);
                        }
                      }}
                      onFocus={() => setIsLearningMenuOpen(true)}
                      onMouseEnter={() => setIsLearningMenuOpen(true)}
                      onMouseLeave={() => setIsLearningMenuOpen(false)}
                    >
                      <Link
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className="navigation-link"
                        data-current={isCurrent || undefined}
                        href={item.href}
                      >
                        {item.label}
                        <span aria-hidden="true">⌄</span>
                      </Link>
                      {isLearningMenuOpen ? (
                        <ul className="navigation-dropdown-menu navigation-dropdown-menu--learning">
                          <li className="navigation-nested-dropdown">
                            <Link
                              className="navigation-dropdown-link"
                              href="/aprendizado"
                            >
                              Aprendizado <span aria-hidden="true">›</span>
                            </Link>
                            <ul className="navigation-nested-menu">
                              <li>
                                <Link
                                  className="navigation-dropdown-link"
                                  href="/aprendizado/aulas"
                                >
                                  Explorar aulas
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="navigation-dropdown-link"
                                  href="/aprendizado/cursos"
                                >
                                  Explorar cursos
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="navigation-dropdown-link"
                                  href="/aprendizado/trilhas"
                                >
                                  Explorar trilhas
                                </Link>
                              </li>
                              <li>
                                <Link
                                  className="navigation-dropdown-link"
                                  href="/aprendizado/busca"
                                >
                                  Explorar geral
                                </Link>
                              </li>
                            </ul>
                          </li>
                          <li>
                            <Link
                              className="navigation-dropdown-link"
                              href="/meu-aprendizado"
                            >
                              Meu aprendizado
                            </Link>
                          </li>
                        </ul>
                      ) : null}
                    </li>
                  );
                }

                if (item.href === "/sobre") {
                  return (
                    <li
                      className="navigation-dropdown"
                      key={item.href}
                      onMouseEnter={() => setIsAboutMenuOpen(true)}
                      onMouseLeave={() => setIsAboutMenuOpen(false)}
                    >
                      <button
                        aria-expanded={isAboutMenuOpen}
                        aria-haspopup="true"
                        className="navigation-link navigation-dropdown-trigger"
                        onClick={() =>
                          setIsAboutMenuOpen((current) => !current)
                        }
                        type="button"
                      >
                        {item.label}
                        <span aria-hidden="true">⌄</span>
                      </button>
                      {isAboutMenuOpen ? (
                        <ul className="navigation-dropdown-menu">
                          {siteConfig.institutionalNavigation.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                aria-current={
                                  pathname === subItem.href ? "page" : undefined
                                }
                                className="navigation-dropdown-link"
                                href={subItem.href}
                                onClick={() => setIsAboutMenuOpen(false)}
                              >
                                {subItem.href === "/sobre"
                                  ? "O que é o GEAR?"
                                  : "Nossos patrocinadores"}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  );
                }

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

          {accountAccess ?? (
            <Link className="login-link" href="/login">
              Login
            </Link>
          )}
        </div>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={isMenuOpen}
          className="menu-button"
          onClick={() => {
            setIsMenuOpen((current) => {
              if (current) {
                setIsMobileAboutOpen(false);
                setIsMobileLearningOpen(false);
              }
              return !current;
            });
          }}
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
              <li className="mobile-navigation-section">
                <button
                  aria-controls="mobile-learning-navigation"
                  aria-expanded={isMobileLearningOpen}
                  className="mobile-navigation-trigger"
                  onClick={() =>
                    setIsMobileLearningOpen((current) => !current)
                  }
                  ref={firstMobileItemRef}
                  type="button"
                >
                  <span>Aprendizado</span>
                  <span
                    aria-hidden="true"
                    className="mobile-navigation-trigger__icon"
                  >
                    +
                  </span>
                </button>
                {isMobileLearningOpen ? (
                  <ul
                    className="mobile-navigation-submenu"
                    id="mobile-learning-navigation"
                  >
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/aprendizado"
                        onClick={closeMobileMenu}
                      >
                        Visão geral
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/aprendizado/aulas"
                        onClick={closeMobileMenu}
                      >
                        Explorar aulas
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/aprendizado/cursos"
                        onClick={closeMobileMenu}
                      >
                        Explorar cursos
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/aprendizado/trilhas"
                        onClick={closeMobileMenu}
                      >
                        Explorar trilhas
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/aprendizado/busca"
                        onClick={closeMobileMenu}
                      >
                        Explorar tudo
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="mobile-navigation-sublink mobile-navigation-sublink--personal"
                        href="/meu-aprendizado"
                        onClick={closeMobileMenu}
                      >
                        Meu aprendizado
                      </Link>
                    </li>
                  </ul>
                ) : null}
              </li>

              {siteConfig.mainNavigation
                .filter(
                  (item) =>
                    item.href !== "/aprendizado" && item.href !== "/sobre",
                )
                .map((item) => {
                  const isCurrent = isCurrentSection(pathname, item.href);
                  return (
                    <li className="mobile-navigation-section" key={item.href}>
                      <Link
                        aria-current={
                          pathname === item.href ? "page" : undefined
                        }
                        className="navigation-link mobile-navigation-link"
                        data-current={isCurrent || undefined}
                        href={item.href}
                        onClick={closeMobileMenu}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                })}

              <li className="mobile-navigation-section">
                <button
                  aria-controls="mobile-about-navigation"
                  aria-expanded={isMobileAboutOpen}
                  className="mobile-navigation-trigger"
                  onClick={() => setIsMobileAboutOpen((current) => !current)}
                  type="button"
                >
                  <span>Sobre</span>
                  <span
                    aria-hidden="true"
                    className="mobile-navigation-trigger__icon"
                  >
                    +
                  </span>
                </button>
                {isMobileAboutOpen ? (
                  <ul
                    className="mobile-navigation-submenu"
                    id="mobile-about-navigation"
                  >
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/sobre"
                        onClick={closeMobileMenu}
                      >
                        O que é o GEAR?
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="mobile-navigation-sublink"
                        href="/patrocinadores"
                        onClick={closeMobileMenu}
                      >
                        Nossos patrocinadores
                      </Link>
                    </li>
                  </ul>
                ) : null}
              </li>

              <li className="mobile-navigation-account">
                {mobileAccountAccess ?? (
                    <Link
                      className="navigation-link mobile-navigation-link"
                      href="/login"
                      onClick={closeMobileMenu}
                    >
                      Login
                    </Link>
                )}
              </li>
            </ul>
          </Container>
        </nav>
      ) : null}
    </header>
  );
}
