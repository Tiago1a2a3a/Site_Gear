import Image from "next/image";
import Link from "next/link";

import { siteConfig } from "@shared/config/site";

import { Container } from "./Container";

export function Footer() {
  return (
    <footer className="site-footer">
      <Container className="footer-content">
        <div>
          <Link
            aria-label="Ir para a página inicial"
            className="footer-brand"
            href="/"
          >
            <Image
              alt=""
              height={54}
              src="/images/brand/gear-logo.png"
              width={201}
            />
          </Link>
          <p>Robótica, aprendizado e projetos desenvolvidos na UFMG.</p>
        </div>

        <nav aria-label="Navegação institucional">
          <p className="footer-title">Portal</p>
          <ul className="footer-list">
            {siteConfig.institutionalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Redes sociais">
          <p className="footer-title">Redes</p>
          <ul className="footer-list">
            {siteConfig.socialLinks.map((item) => (
              <li key={item.href}>
                {item.opensInNewTab ? (
                  <a href={item.href} rel="noreferrer" target="_blank">
                    {item.label}
                    <span className="visually-hidden"> (abre em nova aba)</span>
                  </a>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Links legais">
          <p className="footer-title">Legal</p>
          <ul className="footer-list">
            {siteConfig.legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
