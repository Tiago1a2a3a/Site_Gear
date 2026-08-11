export const CONTENT_PLACEHOLDER_SLUG = "em-producao";

export function isContentPlaceholder(entry: { slug: string }) {
  return entry.slug === CONTENT_PLACEHOLDER_SLUG;
}
