"use client";

import { useMemo, useState } from "react";

import { formatMonthLabel, listUpcomingEvents } from "../services/calendario";
import type { CalendarEvent } from "../types";
import { CalendarioMensal } from "./CalendarioMensal";
import { EventoDialog } from "./EventoDialog";
import { LegendaCalendario } from "./LegendaCalendario";
import { ListaProximosEventos } from "./ListaProximosEventos";

type CalendarioPublicoProps = Readonly<{
  events: readonly CalendarEvent[];
  initialMonth: number;
  initialYear: number;
  referenceDate: string;
}>;

export function CalendarioPublico({
  events,
  initialMonth,
  initialYear,
  referenceDate,
}: CalendarioPublicoProps) {
  const [displayedMonth, setDisplayedMonth] = useState({
    month: initialMonth,
    year: initialYear,
  });
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent>();
  const [visibleCount, setVisibleCount] = useState(5);
  const upcomingEvents = useMemo(
    () => listUpcomingEvents(events, new Date(`${referenceDate}T12:00:00`)),
    [events, referenceDate],
  );

  function moveMonth(amount: number) {
    setDisplayedMonth((current) => {
      const date = new Date(current.year, current.month + amount, 1, 12);
      return { month: date.getMonth(), year: date.getFullYear() };
    });
  }

  return (
    <>
      <section aria-label="Calendário mensal" className="calendar-desktop">
        <div className="calendar-toolbar">
          <button
            aria-label="Mostrar mês anterior"
            className="calendar-toolbar__arrow"
            onClick={() => moveMonth(-1)}
            type="button"
          >
            ←
          </button>
          <h2 aria-live="polite">
            {formatMonthLabel(displayedMonth.year, displayedMonth.month)}
          </h2>
          <button
            aria-label="Mostrar próximo mês"
            className="calendar-toolbar__arrow"
            onClick={() => moveMonth(1)}
            type="button"
          >
            →
          </button>
        </div>
        <CalendarioMensal
          events={events}
          month={displayedMonth.month}
          onSelectEvent={setSelectedEvent}
          today={referenceDate}
          year={displayedMonth.year}
        />
        <LegendaCalendario />
      </section>

      <ListaProximosEventos
        events={upcomingEvents}
        onLoadMore={() => setVisibleCount((current) => current + 5)}
        onSelectEvent={setSelectedEvent}
        visibleCount={visibleCount}
      />

      {selectedEvent ? (
        <EventoDialog
          event={selectedEvent}
          onClose={() => setSelectedEvent(undefined)}
        />
      ) : null}
    </>
  );
}
