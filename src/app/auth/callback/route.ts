import { NextResponse } from "next/server";

import { normalizeInternalPath } from "@shared/lib/internal-redirect";
import { createServerSupabaseClient } from "@shared/lib/supabase/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const providerError = url.searchParams.get("error");
  const next = normalizeInternalPath(url.searchParams.get("next"));

  if (!code || providerError) {
    return NextResponse.redirect(
      new URL(`/login?erro=oauth&next=${encodeURIComponent(next)}`, url.origin),
    );
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return NextResponse.redirect(
      new URL(
        `/login?erro=configuracao&next=${encodeURIComponent(next)}`,
        url.origin,
      ),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(
      new URL(
        `/login?erro=callback&next=${encodeURIComponent(next)}`,
        url.origin,
      ),
    );
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
