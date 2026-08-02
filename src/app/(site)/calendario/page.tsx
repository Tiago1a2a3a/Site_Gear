import type { Metadata } from "next";

import { CalendarioPublico } from "@features/calendario/components/CalendarioPublico";
import { listarEventosDeExemplo } from "@features/calendario/data/eventos-exemplo";
import { Button } from "@shared/components/ui/Button";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  description: "Acompanhe os próximos eventos públicos do GEAR UFMG.",
  openGraph: {
    description: "Acompanhe os próximos eventos públicos do GEAR UFMG.",
    title: "Calendário",
  },
  title: "Calendário",
};

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function CalendarioPage() {
  const referenceDate = new Date();
  const events = listarEventosDeExemplo(referenceDate);

  return (
    <div className="calendar-page">
      <Breadcrumbs items={[{ label: "Calendário" }]} />
      <header className="calendar-hero">
        <div>
          <p className="section-index">PROGRAMAÇÃO PÚBLICA</p>
          <h1>Calendário</h1>
          <p>
            Encontros, oficinas e atividades abertas organizados em um só lugar.
          </p>
        </div>
        <Button className="calendar-coming-soon" disabled variant="secondary">
          Assinar calendário — em breve
        </Button>
      </header>

      <p className="calendar-demo-note" role="note">
        <strong>Visualização de demonstração.</strong> Os eventos abaixo são
        exemplos enquanto a conexão com o calendário oficial do Notion é
        preparada.
      </p>

      <CalendarioPublico
        events={events}
        initialMonth={referenceDate.getMonth()}
        initialYear={referenceDate.getFullYear()}
        referenceDate={toDateKey(referenceDate)}
      />
    </div>
  );
}
