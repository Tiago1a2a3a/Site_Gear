const FALLBACK_PATH = "/meu-aprendizado";

export function normalizeInternalPath(
  candidate: string | null | undefined,
  fallback = FALLBACK_PATH,
) {
  if (!candidate) return fallback;

  try {
    const decoded = decodeURIComponent(candidate);
    if (
      !candidate.startsWith("/") ||
      candidate.startsWith("//") ||
      decoded.startsWith("//") ||
      candidate.includes("\\") ||
      /[\u0000-\u001f]/.test(decoded)
    ) {
      return fallback;
    }

    const parsed = new URL(candidate, "https://portal.gear.local");
    if (parsed.origin !== "https://portal.gear.local") return fallback;

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return fallback;
  }
}

export function buildLoginPath(next: string) {
  return `/login?next=${encodeURIComponent(normalizeInternalPath(next))}`;
}
