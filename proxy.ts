import type { NextRequest } from "next/server";

import { updateSupabaseSession } from "@shared/lib/supabase/proxy";

export function proxy(request: NextRequest) {
  return updateSupabaseSession(request);
}

export const config = {
  matcher: ["/login", "/meu-aprendizado/:path*", "/auth/callback"],
};
