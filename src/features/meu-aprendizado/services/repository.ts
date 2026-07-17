import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  LearningContentType,
  LearningEnrollment,
  LessonCompletion,
  RelatedEnrollment,
} from "../types";

function throwOnError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export async function loadPersonalLearning(
  supabase: SupabaseClient,
  userId: string,
) {
  const [enrollmentsResult, completionsResult] = await Promise.all([
    supabase
      .from("learning_enrollments")
      .select(
        "user_id,content_type,content_identifier,enrolled_at,last_activity_at",
      )
      .eq("user_id", userId)
      .order("last_activity_at", { ascending: false }),
    supabase
      .from("lesson_completions")
      .select("user_id,lesson_identifier,completed_at")
      .eq("user_id", userId)
      .order("completed_at", { ascending: false }),
  ]);

  throwOnError(enrollmentsResult.error);
  throwOnError(completionsResult.error);

  return {
    completions: (completionsResult.data ?? []) as LessonCompletion[],
    enrollments: (enrollmentsResult.data ?? []) as LearningEnrollment[],
  };
}

export async function setEnrollment(
  supabase: SupabaseClient,
  userId: string,
  contentType: LearningContentType,
  contentIdentifier: string,
  enrolled: boolean,
) {
  if (!enrolled) {
    const { error } = await supabase
      .from("learning_enrollments")
      .delete()
      .eq("user_id", userId)
      .eq("content_type", contentType)
      .eq("content_identifier", contentIdentifier);
    throwOnError(error);
    return;
  }

  const now = new Date().toISOString();
  const { error } = await supabase.from("learning_enrollments").upsert(
    {
      content_identifier: contentIdentifier,
      content_type: contentType,
      enrolled_at: now,
      last_activity_at: now,
      user_id: userId,
    },
    { onConflict: "user_id,content_type,content_identifier" },
  );
  throwOnError(error);
}

export async function setLessonCompletion(
  supabase: SupabaseClient,
  userId: string,
  lessonIdentifier: string,
  completed: boolean,
  relatedEnrollments: readonly RelatedEnrollment[],
) {
  if (completed) {
    const { error } = await supabase.from("lesson_completions").upsert(
      {
        completed_at: new Date().toISOString(),
        lesson_identifier: lessonIdentifier,
        user_id: userId,
      },
      { onConflict: "user_id,lesson_identifier" },
    );
    throwOnError(error);
  } else {
    const { error } = await supabase
      .from("lesson_completions")
      .delete()
      .eq("user_id", userId)
      .eq("lesson_identifier", lessonIdentifier);
    throwOnError(error);
  }

  const now = new Date().toISOString();
  for (const related of relatedEnrollments) {
    const { error } = await supabase
      .from("learning_enrollments")
      .update({ last_activity_at: now })
      .eq("user_id", userId)
      .eq("content_type", related.contentType)
      .eq("content_identifier", related.contentIdentifier);
    throwOnError(error);
  }
}
