"use client";

import { useState } from "react";

import { createBrowserSupabaseClient } from "@shared/lib/supabase/client";
import { normalizeInternalPath } from "@shared/lib/internal-redirect";

export function GitHubLoginButton({ next }: Readonly<{ next?: string }>) {
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("O login ainda não foi configurado neste ambiente.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    const returnPath = normalizeInternalPath(next);
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(returnPath)}`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo },
    });

    if (error) {
      setMessage("Não foi possível iniciar o login. Tente novamente.");
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-action-stack">
      <button
        className="button button--primary"
        disabled={isLoading}
        onClick={login}
        type="button"
      >
        {isLoading ? "Abrindo GitHub..." : "Entrar com GitHub"}
      </button>
      {message ? (
        <p aria-live="polite" className="form-feedback" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
