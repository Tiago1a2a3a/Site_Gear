"use client";

import { useEffect, useId, useRef } from "react";

import { Badge } from "@shared/components/ui/Badge";
import { Button } from "@shared/components/ui/Button";

import { formatEventPeriod } from "../services/calendario";
import type { CalendarEvent } from "../types";

type EventoDialogProps = Readonly<{
  event: CalendarEvent;
  onClose: () => void;
}>;

export function EventoDialog({ event, onClose }: EventoDialogProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    const focusable = () => [
      ...(dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, a[href]:not([aria-disabled="true"])',
      ) ?? []),
    ];
    document.body.style.overflow = "hidden";
    focusable()[0]?.focus();

    function onKeyDown(eventKey: KeyboardEvent) {
      if (eventKey.key === "Escape") return onClose();
      if (eventKey.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (eventKey.shiftKey && document.activeElement === first) {
        eventKey.preventDefault();
        last?.focus();
      } else if (!eventKey.shiftKey && document.activeElement === last) {
        eventKey.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div
      className="calendar-dialog-backdrop"
      onMouseDown={(mouseEvent) => {
        if (mouseEvent.target === mouseEvent.currentTarget) onClose();
      }}
    >
      <div
        aria-labelledby={titleId}
        aria-modal="true"
        className="calendar-dialog"
        ref={dialogRef}
        role="dialog"
      >
        <div className="calendar-dialog__topline">
          <Badge>Evento de demonstração</Badge>
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
          {event.confirmation === "confirmed" ? (
            <Button className="calendar-coming-soon" disabled>
              Google Agenda — em breve
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
