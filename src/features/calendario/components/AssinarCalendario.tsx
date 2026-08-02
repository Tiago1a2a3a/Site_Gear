"use client";

import { useId, useState } from "react";

import { Button } from "@shared/components/ui/Button";

import { DialogCalendario } from "./DialogCalendario";

const FEED_PATH = "/calendario/feed.ics";

type AssinarCalendarioProps = Readonly<{
  disabled?: boolean;
}>;

export function AssinarCalendario({
  disabled = false,
}: AssinarCalendarioProps) {
  const titleId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [feedUrl, setFeedUrl] = useState(FEED_PATH);
  const [copyStatus, setCopyStatus] = useState("");

  function openDialog() {
    setFeedUrl(new URL(FEED_PATH, window.location.origin).href);
    setCopyStatus("");
    setIsOpen(true);
  }

  async function copyFeedUrl() {
    try {
      await navigator.clipboard.writeText(feedUrl);
      setCopyStatus("Link copiado.");
    } catch {
      setCopyStatus("Não foi possível copiar. Selecione o link acima.");
    }
  }

  return (
    <>
      <Button disabled={disabled} onClick={openDialog} variant="secondary">
        Assinar calendário
      </Button>

      {isOpen ? (
        <DialogCalendario labelledBy={titleId} onClose={() => setIsOpen(false)}>
          <div className="calendar-dialog__topline">
            <p className="calendar-dialog__eyebrow">Agenda do GEAR</p>
            <button
              aria-label="Fechar instruções de assinatura"
              className="calendar-dialog__close"
              onClick={() => setIsOpen(false)}
              type="button"
            >
              ×
            </button>
          </div>
          <div className="calendar-dialog__content calendar-subscribe">
            <div>
              <h2 id={titleId}>Assinar calendário</h2>
              <p>
                Copie o endereço abaixo para acompanhar automaticamente os
                eventos confirmados do GEAR no seu aplicativo de agenda.
              </p>
            </div>
            <label className="calendar-subscribe__field">
              Endereço do calendário
              <input readOnly value={feedUrl} />
            </label>
            <p className="calendar-subscribe__hint">
              No Google Agenda, abra “Outros calendários”, escolha “A partir do
              URL” e cole esse endereço.
            </p>
            <p aria-live="polite" className="calendar-subscribe__status">
              {copyStatus}
            </p>
          </div>
          <div className="calendar-dialog__actions">
            <a
              className="button button--secondary"
              href={FEED_PATH}
              rel="noreferrer"
              target="_blank"
            >
              Abrir arquivo .ics
            </a>
            <Button onClick={copyFeedUrl}>Copiar endereço</Button>
          </div>
        </DialogCalendario>
      ) : null}
    </>
  );
}
