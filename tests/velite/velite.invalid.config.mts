import { defineConfig } from "velite";

import { exemplos } from "./schema";

export default defineConfig({
  root: "fixtures/invalid",
  strict: true,
  output: {
    data: "../../.velite/proof-invalid",
  },
  collections: { exemplos },
});
