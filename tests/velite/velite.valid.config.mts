import { defineConfig } from "velite";

import { exemplos } from "./schema";

export default defineConfig({
  root: "tests/velite/fixtures/valid",
  strict: true,
  output: { data: ".velite/proof-valid" },
  collections: { exemplos },
});
