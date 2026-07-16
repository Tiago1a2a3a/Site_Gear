import Image from "next/image";

import { Container } from "@shared/components/layout/Container";

import { getSponsors } from "../data/sponsors";
import type { Sponsor } from "../types";

type SponsorStripProps = Readonly<{
  sponsors?: readonly Sponsor[];
}>;

export function SponsorStrip({ sponsors }: SponsorStripProps) {
  const orderedSponsors = getSponsors(sponsors);

  if (orderedSponsors.length === 0) return null;

  return (
    <aside aria-labelledby="sponsor-strip-title" className="sponsor-strip">
      <Container className="sponsor-strip-content">
        <div className="sponsor-strip-heading">
          <p className="section-index">PARCEIROS</p>
          <h2 id="sponsor-strip-title">Quem apoia o GEAR</h2>
        </div>
        <ul className="sponsor-list">
          {orderedSponsors.map((sponsor) => (
            <li key={sponsor.url}>
              <a
                className="sponsor-link"
                href={sponsor.url}
                rel="noreferrer"
                target="_blank"
              >
                <span className="sponsor-logo">
                  <Image
                    alt={`Logo de ${sponsor.name}`}
                    fill
                    sizes="(max-width: 48rem) 10rem, 14vw"
                    src={sponsor.logo}
                  />
                </span>
                <span className="sponsor-name">
                  {sponsor.name}
                  {sponsor.tier ? <small>{sponsor.tier}</small> : null}
                </span>
                <span className="visually-hidden"> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </aside>
  );
}
