"use client";

import { useEffect, useState } from "react";

import { buildLoginPath } from "@shared/lib/internal-redirect";
import { createBrowserSupabaseClient } from "@shared/lib/supabase/client";
import { isSupabaseConfigured } from "@shared/lib/supabase/config";

import { setLessonCompletion } from "../services/repository";
import type { RelatedEnrollment } from "../types";

export function LessonCompletionButton({
  lessonIdentifier,
  relatedEnrollments,
}: Readonly<{
  lessonIdentifier: string;
  relatedEnrollments: readonly RelatedEnrollment[];
}>) {
  const [completed, setCompleted] = useState(false);
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
        currentUrl.searchParams.get("acao") === "concluir-aula" &&
        currentUrl.searchParams.get("conteudo") === lessonIdentifier;

      if (shouldCompleteIntent) {
        currentUrl.searchParams.delete("acao");
        currentUrl.searchParams.delete("conteudo");
        window.history.replaceState(
          {},
          "",
          `${currentUrl.pathname}${currentUrl.search}`,
        );
        try {
          await setLessonCompletion(
            supabase,
            data.user.id,
            lessonIdentifier,
            true,
            relatedEnrollments,
          );
          if (mounted) {
            setCompleted(true);
            setMessage("Aula marcada como concluída.");
          }
        } catch {
          if (mounted) setMessage("Não foi possível concluir a aula.");
        }
      } else {
        const result = await supabase
          .from("lesson_completions")
          .select("lesson_identifier")
          .eq("user_id", data.user.id)
          .eq("lesson_identifier", lessonIdentifier)
          .maybeSingle();
        if (mounted) setCompleted(Boolean(result.data));
      }

      if (mounted) setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, [lessonIdentifier, relatedEnrollments]);

  async function toggleCompletion() {
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
      next.searchParams.set("acao", "concluir-aula");
      next.searchParams.set("conteudo", lessonIdentifier);
      window.location.assign(buildLoginPath(`${next.pathname}${next.search}`));
      return;
    }

    try {
      await setLessonCompletion(
        supabase,
        data.user.id,
        lessonIdentifier,
        !completed,
        relatedEnrollments,
      );
      setCompleted(!completed);
      setMessage(
        completed ? "Conclusão desfeita." : "Aula marcada como concluída.",
      );
    } catch {
      setMessage("Não foi possível atualizar a conclusão da aula.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="lesson-completion">
      <button
        aria-pressed={completed}
        className="button button--primary lesson-completion__button"
        disabled={isLoading}
        onClick={toggleCompletion}
        type="button"
      >
        {isLoading
          ? "Carregando..."
          : completed
            ? "Desmarcar como concluída"
            : "Marcar como concluída"}
      </button>
      {message ? (
        <p aria-live="polite" className="visually-hidden" role="status">
          {message}
        </p>
      ) : null}
    </div>
  );
}
