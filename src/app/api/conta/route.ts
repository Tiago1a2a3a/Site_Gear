import { NextResponse } from "next/server";

import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
} from "@shared/lib/supabase/server";

export async function DELETE(request: Request) {
  const url = new URL(request.url);
  const origin = request.headers.get("origin");
  const confirmation = request.headers.get("x-gear-confirm");

  if (origin !== url.origin || confirmation !== "excluir-permanentemente") {
    return NextResponse.json({ error: "invalid_request" }, { status: 403 });
  }

  const supabase = await createServerSupabaseClient();
  const admin = createAdminSupabaseClient();
  if (!supabase || !admin) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { error } = await admin.auth.admin.deleteUser(data.user.id, false);
  if (error) {
    return NextResponse.json({ error: "delete_failed" }, { status: 502 });
  }

  await supabase.auth.signOut();
  return NextResponse.json({ deleted: true });
}
