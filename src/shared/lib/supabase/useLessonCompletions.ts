"use client";

import { useEffect, useState } from "react";

import { createBrowserSupabaseClient } from "./client";

export function useLessonCompletions() {
  const [completedLessonIds, setCompletedLessonIds] = useState<
    ReadonlySet<string>
  >(() => new Set());

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    if (!supabase) return;

    let mounted = true;

    void (async () => {
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user || !mounted) return;

      const { data } = await supabase
        .from("lesson_completions")
        .select("lesson_identifier")
        .eq("user_id", authData.user.id);

      if (mounted) {
        setCompletedLessonIds(
          new Set(
            (data ?? []).map((completion) => completion.lesson_identifier),
          ),
        );
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return completedLessonIds;
}
