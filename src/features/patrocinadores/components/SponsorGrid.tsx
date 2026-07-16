import Image from "next/image";

import { Card } from "@shared/components/ui/Card";

import { getSponsors } from "../data/sponsors";
import type { Sponsor } from "../types";

export function SponsorGrid({
  sponsors,
}: Readonly<{ sponsors?: readonly Sponsor[] }>) {
  const orderedSponsors = getSponsors(sponsors);

  if (!orderedSponsors.length) {
    return (
      <Card className="institutional-empty-state">
        <h2>Nenhum parceiro publicado</h2>
        <p>Os parceiros aparecerão após a validação dos dados e dos logos.</p>
      </Card>
    );
  }

  return (
    <ul aria-label="Patrocinadores e parceiros" className="sponsor-grid">
      {orderedSponsors.map((sponsor) => (
        <li key={sponsor.url}>
          <Card className="sponsor-grid-card">
            <a href={sponsor.url} rel="noreferrer" target="_blank">
              <span className="sponsor-grid-card__logo">
                <Image
                  alt={`Logo de ${sponsor.name}`}
                  fill
                  sizes="(max-width: 48rem) 80vw, 25vw"
                  src={sponsor.logo}
                />
              </span>
              <span className="sponsor-grid-card__content">
                {sponsor.tier ? <small>{sponsor.tier}</small> : null}
                <strong>{sponsor.name}</strong>
                <span className="text-link">Visitar site</span>
              </span>
              <span className="visually-hidden"> (abre em nova aba)</span>
            </a>
          </Card>
        </li>
      ))}
    </ul>
  );
}
