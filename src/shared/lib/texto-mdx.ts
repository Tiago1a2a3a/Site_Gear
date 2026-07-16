export function extrairTextoDoMdx(compilado: string) {
  return compilado
    .replace(/\\n/g, " ")
    .replace(/[^\p{L}\p{N}\s-]+/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}
