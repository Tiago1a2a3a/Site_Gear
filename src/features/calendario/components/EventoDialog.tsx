"use client";

import { useId } from "react";

import { formatEventPeriod } from "../services/calendario";
import { buildGoogleCalendarUrl } from "../services/google-calendar";
import type { CalendarEvent } from "../types";
import { DialogCalendario } from "./DialogCalendario";

type EventoDialogProps = Readonly<{
  event: CalendarEvent;
  onClose: () => void;
}>;

export function EventoDialog({ event, onClose }: EventoDialogProps) {
  const titleId = useId();
  const googleCalendarUrl = buildGoogleCalendarUrl(event);

  return (
    <DialogCalendario labelledBy={titleId} onClose={onClose}>
      <div className="calendar-dialog__topline">
        <p className="calendar-dialog__eyebrow">Evento do GEAR</p>
        <button
          aria-label="Fechar detalhes do evento"
          className="calendar-dialog__close"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
      </div>
      <div className="calendar-dialog__content">
        <div>
          <p className="calendar-dialog__eyebrow">
            {event.confirmation === "confirmed"
              ? "Data confirmada"
              : "Data a definir"}
          </p>
          <h2 id={titleId}>{event.name}</h2>
          <p className="calendar-dialog__date">{formatEventPeriod(event)}</p>
        </div>
        {event.description ? <p>{event.description}</p> : null}
      </div>
      <div className="calendar-dialog__actions">
        {event.link ? (
          <a
            aria-label="Mais informações sobre o evento; abre em nova aba"
            className="button button--secondary"
            href={event.link}
            rel="noreferrer"
            target="_blank"
          >
            Mais informações
          </a>
        ) : null}
        {googleCalendarUrl ? (
          <a
            aria-label="Adicionar evento ao Google Agenda; abre em nova aba"
            className="button button--primary"
            href={googleCalendarUrl}
            rel="noreferrer"
            target="_blank"
          >
            Adicionar ao Google Agenda
          </a>
        ) : null}
      </div>
    </DialogCalendario>
  );
}
