"use client";

import { useRef, useState } from "react";

import { createBrowserSupabaseClient } from "@shared/lib/supabase/client";

export function AccountDeletionButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  function openDialog() {
    setMessage("");
    setIsOpen(true);
    window.setTimeout(() => cancelButtonRef.current?.focus(), 0);
  }

  async function deleteAccount() {
    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/conta", {
        headers: { "x-gear-confirm": "excluir-permanentemente" },
        method: "DELETE",
      });
      if (!response.ok) throw new Error("delete_failed");

      const supabase = createBrowserSupabaseClient();
      await supabase?.auth.signOut({ scope: "local" });
      window.location.assign("/?conta=excluida");
    } catch {
      setMessage("Não foi possível excluir a conta. Tente novamente.");
      setIsLoading(false);
    }
  }

  return (
    <div className="danger-zone">
      <div className="danger-zone__content">
        <h2>Excluir minha conta</h2>
        <p>
          Remove permanentemente a conta, inscrições e conclusões. Esta ação não
          pode ser desfeita.
        </p>
      </div>
      <button
        className="button button--danger"
        onClick={openDialog}
        type="button"
      >
        Excluir minha conta
      </button>

      {isOpen ? (
        <div
          aria-labelledby="delete-account-title"
          aria-modal="true"
          className="modal-backdrop"
          onKeyDown={(event) => {
            if (event.key === "Escape" && !isLoading) setIsOpen(false);
          }}
          role="dialog"
        >
          <div className="confirmation-modal">
            <h2 id="delete-account-title">Exclusão permanente</h2>
            <p>
              Todas as suas inscrições e aulas concluídas serão apagadas. Não
              existe recuperação nesta fase.
            </p>
            <div className="modal-actions">
              <button
                className="button button--secondary"
                disabled={isLoading}
                onClick={() => setIsOpen(false)}
                ref={cancelButtonRef}
                type="button"
              >
                Cancelar
              </button>
              <button
                className="button button--danger"
                disabled={isLoading}
                onClick={deleteAccount}
                type="button"
              >
                {isLoading ? "Excluindo..." : "Excluir permanentemente"}
              </button>
            </div>
            {message ? <p role="alert">{message}</p> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
