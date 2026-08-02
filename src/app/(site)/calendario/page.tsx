import type { Metadata } from "next";

import { AssinarCalendario } from "@features/calendario/components/AssinarCalendario";
import { CalendarioPublico } from "@features/calendario/components/CalendarioPublico";
import { listPublicCalendarEvents } from "@features/calendario/data/eventos";
import { Breadcrumbs } from "@shared/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  description: "Acompanhe os próximos eventos públicos do GEAR UFMG.",
  openGraph: {
    description: "Acompanhe os próximos eventos públicos do GEAR UFMG.",
    title: "Calendário",
  },
  title: "Calendário",
};

export const revalidate = 300;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function CalendarioPage() {
  const referenceDate = new Date();
  const result = await listPublicCalendarEvents(referenceDate);
  const isUnavailable = result.status === "unavailable";

  return (
    <div className="calendar-page">
      <Breadcrumbs items={[{ label: "Calendário" }]} />
      <header className="page-heading calendar-heading">
        <h1>Calendário</h1>
        <AssinarCalendario disabled={isUnavailable} />
      </header>

      {isUnavailable ? (
        <section className="calendar-source-state" role="status">
          <h2>Calendário temporariamente indisponível</h2>
          <p>
            Não foi possível carregar os eventos. Tente novamente em alguns
            minutos.
          </p>
        </section>
      ) : result.events.length === 0 ? (
        <section className="calendar-source-state" role="status">
          <h2>Nenhum evento público por enquanto</h2>
          <p>
            Novas atividades do GEAR aparecerão aqui assim que forem publicadas.
          </p>
        </section>
      ) : (
        <CalendarioPublico
          events={result.events}
          initialMonth={referenceDate.getMonth()}
          initialYear={referenceDate.getFullYear()}
          referenceDate={toDateKey(referenceDate)}
        />
      )}
    </div>
  );
}
