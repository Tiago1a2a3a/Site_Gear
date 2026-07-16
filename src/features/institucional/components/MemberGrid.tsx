import Image from "next/image";

import { Card } from "@shared/components/ui/Card";
import type { InstitutionalMember } from "@shared/config/institutional";

function iniciaisDoNome(nome: string) {
  return nome
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toLocaleUpperCase("pt-BR"))
    .join("");
}

export function MemberGrid({
  emptyMessage,
  members,
}: Readonly<{
  emptyMessage: string;
  members: readonly InstitutionalMember[];
}>) {
  if (!members.length) {
    return (
      <Card className="institutional-empty-state">
        <h3>Equipe em atualização</h3>
        <p>{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <ul aria-label="Integrantes do GEAR" className="member-grid">
      {members.map((member) => (
        <li key={`${member.name}-${member.role}`}>
          <Card className="member-card">
            {member.image ? (
              <Image
                alt={`Foto de ${member.name}`}
                height={320}
                sizes="(max-width: 48rem) 50vw, 20vw"
                src={member.image}
                width={320}
              />
            ) : (
              <span aria-hidden="true" className="member-card__initials">
                {iniciaisDoNome(member.name)}
              </span>
            )}
            <div>
              <h3>{member.name}</h3>
              <p className="status-label">{member.role}</p>
              {member.description ? <p>{member.description}</p> : null}
            </div>
          </Card>
        </li>
      ))}
    </ul>
  );
}
