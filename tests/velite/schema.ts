import { defineCollection, s } from "velite";

export const exemplos = defineCollection({
  name: "Exemplo",
  pattern: "*.mdx",
  schema: s.object({
    titulo: s.string().min(1),
    conteudo: s.mdx(),
  }),
});
