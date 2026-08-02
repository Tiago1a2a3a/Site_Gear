import { Button } from "@shared/components/ui/Button";

import { formatMobileEventDate, getEventTime } from "../services/calendario";
import type { CalendarEvent } from "../types";

type ListaProximosEventosProps = Readonly<{
  events: readonly CalendarEvent[];
  onLoadMore: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
  visibleCount: number;
}>;

export function ListaProximosEventos({
  events,
  onLoadMore,
  onSelectEvent,
  visibleCount,
}: ListaProximosEventosProps) {
  const visibleEvents = events.slice(0, visibleCount);

  return (
    <section
      aria-labelledby="upcoming-events-title"
      className="calendar-mobile"
    >
      <div className="calendar-mobile__heading">
        <p className="section-index">PRÓXIMOS EVENTOS</p>
        <h2 id="upcoming-events-title">O que vem por aí.</h2>
      </div>
      <ol className="calendar-event-list">
        {visibleEvents.map((event) => {
          const date = formatMobileEventDate(event);
          const time = getEventTime(event);
          return (
            <li key={event.id}>
              <button
                className={`calendar-list-event calendar-list-event--${event.confirmation}`}
                onClick={() => onSelectEvent(event)}
                type="button"
              >
                <span className="calendar-list-event__date">
                  <strong>{date.primary}</strong>
                  <small>{date.secondary}</small>
                </span>
                <span className="calendar-list-event__content">
                  <strong>{event.name}</strong>
                  <small>{time ?? "Consulte os detalhes"}</small>
                </span>
                <span aria-hidden="true" className="calendar-list-event__arrow">
                  →
                </span>
              </button>
            </li>
          );
        })}
      </ol>
      {visibleCount < events.length ? (
        <Button onClick={onLoadMore} variant="secondary">
          Ver mais eventos
        </Button>
      ) : null}
    </section>
  );
}
