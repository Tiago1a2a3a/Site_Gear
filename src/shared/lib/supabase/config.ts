export function getPublicSupabaseConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!url || !publishableKey) return null;

  return { publishableKey, url } as const;
}

export function isSupabaseConfigured() {
  return getPublicSupabaseConfig() !== null;
}
