"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { createBrowserSupabaseClient } from "@shared/lib/supabase/client";
import { isSupabaseConfigured } from "@shared/lib/supabase/config";

type AccountState = "loading" | "signed-in" | "signed-out";

export function AccountAccess({
  mobile = false,
}: Readonly<{ mobile?: boolean }>) {
  const [state, setState] = useState<AccountState>(() =>
    isSupabaseConfigured() ? "loading" : "signed-out",
  );

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    let mounted = true;
    void supabase.auth.getUser().then(({ data }) => {
      if (mounted) setState(data.user ? "signed-in" : "signed-out");
    });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) setState(session?.user ? "signed-in" : "signed-out");
    });

    return () => {
      mounted = false;
      data.subscription.unsubscribe();
    };
  }, []);

  async function logout() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    await supabase.auth.signOut();
    setState("signed-out");
    window.location.assign("/");
  }

  if (state === "signed-in") {
    if (mobile) {
      return (
        <button
          className="navigation-link mobile-navigation-link account-logout-link"
          onClick={logout}
          type="button"
        >
          Sair
        </button>
      );
    }

    return (
      <div
        className={`account-access${mobile ? " account-access--mobile" : ""}`}
      >
        <Link
          className={
            mobile
              ? "navigation-link mobile-navigation-link"
              : "my-learning-link"
          }
          href="/meu-aprendizado"
        >
          Meu aprendizado
        </Link>
        <button
          className={
            mobile
              ? "navigation-link mobile-navigation-link account-logout-link"
              : "account-logout-link"
          }
          onClick={logout}
          type="button"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <Link
      aria-busy={state === "loading" || undefined}
      className={
        mobile ? "navigation-link mobile-navigation-link" : "login-link"
      }
      href="/login"
    >
      Login
    </Link>
  );
}
