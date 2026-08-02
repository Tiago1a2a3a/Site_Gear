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
      <header className="page-heading calendar-heading">
        <h1>Calendário</h1>
        <Button className="calendar-coming-soon" disabled variant="secondary">
          Assinar calendário — em breve
        </Button>
      </header>

      <CalendarioPublico
        events={events}
        initialMonth={referenceDate.getMonth()}
        initialYear={referenceDate.getFullYear()}
        referenceDate={toDateKey(referenceDate)}
      />
    </div>
  );
}
