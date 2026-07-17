"use client";

import { useEffect, useState } from "react";

import { buildLoginPath } from "@shared/lib/internal-redirect";
import { createBrowserSupabaseClient } from "@shared/lib/supabase/client";
import { isSupabaseConfigured } from "@shared/lib/supabase/config";

import { setEnrollment } from "../services/repository";
import type { LearningContentType } from "../types";

export function EnrollmentButton({
  contentIdentifier,
  contentType,
  initialEnrolled = false,
  onEnrollmentChange,
}: Readonly<{
  contentIdentifier: string;
  contentType: LearningContentType;
  initialEnrolled?: boolean;
  onEnrollmentChange?: (enrolled: boolean) => void;
}>) {
  const [enrolled, setEnrolled] = useState(initialEnrolled);
  const [isLoading, setIsLoading] = useState(() => isSupabaseConfigured());
  const [message, setMessage] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    let mounted = true;
    void (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user || !mounted) {
        if (mounted) setIsLoading(false);
        return;
      }

      const currentUrl = new URL(window.location.href);
      const shouldCompleteIntent =
        currentUrl.searchParams.get("acao") === "inscrever" &&
        currentUrl.searchParams.get("tipo") === contentType &&
        currentUrl.searchParams.get("conteudo") === contentIdentifier;

      if (shouldCompleteIntent) {
        currentUrl.searchParams.delete("acao");
        currentUrl.searchParams.delete("tipo");
        currentUrl.searchParams.delete("conteudo");
        window.history.replaceState(
          {},
          "",
          `${currentUrl.pathname}${currentUrl.search}`,
        );
        try {
          await setEnrollment(
            supabase,
            data.user.id,
            contentType,
            contentIdentifier,
            true,
          );
          if (mounted) {
            setEnrolled(true);
            onEnrollmentChange?.(true);
            setMessage("Inscrição concluída.");
          }
        } catch {
          if (mounted) setMessage("Não foi possível concluir a inscrição.");
        }
      } else {
        const result = await supabase
          .from("learning_enrollments")
          .select("content_identifier")
          .eq("user_id", data.user.id)
          .eq("content_type", contentType)
          .eq("content_identifier", contentIdentifier)
          .maybeSingle();
        if (mounted) setEnrolled(Boolean(result.data));
      }

      if (mounted) setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [contentIdentifier, contentType, onEnrollmentChange]);

  async function toggleEnrollment() {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) {
      setMessage("O recurso pessoal ainda não foi configurado neste ambiente.");
      return;
    }

    setIsLoading(true);
    setMessage("");
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      const next = new URL(window.location.href);
      next.searchParams.set("acao", "inscrever");
      next.searchParams.set("tipo", contentType);
      next.searchParams.set("conteudo", contentIdentifier);
      window.location.assign(buildLoginPath(`${next.pathname}${next.search}`));
      return;
    }

    if (enrolled) {
      const confirmed = window.confirm(
        `Deseja realmente sair ${contentType === "curso" ? "do curso" : "da trilha"}? Suas aulas concluídas serão preservadas.`,
      );
      if (!confirmed) {
        setIsLoading(false);
        return;
      }
    }

    try {
      await setEnrollment(
        supabase,
        data.user.id,
        contentType,
        contentIdentifier,
        !enrolled,
      );
      setEnrolled(!enrolled);
      onEnrollmentChange?.(!enrolled);
      setMessage(enrolled ? "Inscrição removida." : "Inscrição concluída.");
    } catch {
      setMessage("Não foi possível atualizar sua inscrição.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="personal-action">
      <button
        aria-pressed={enrolled}
        className="button button--primary"
        disabled={isLoading}
        onClick={toggleEnrollment}
        type="button"
      >
        {isLoading
          ? "Carregando..."
          : enrolled
            ? contentType === "curso"
              ? "Sair do curso"
              : "Sair da trilha"
            : "Inscrever-se"}
      </button>
      {message ? (
        <p aria-live="polite" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
