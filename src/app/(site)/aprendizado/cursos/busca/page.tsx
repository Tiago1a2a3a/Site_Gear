import { Suspense } from "react";

import { BuscaLocal } from "@features/busca/components/BuscaLocal";
import { prepararBusca } from "@features/busca/data/indices";

export default function BuscaDeCursosPage() {
  const busca = prepararBusca("curso");
  return (
    <Suspense fallback={<p>Carregando busca de Cursos...</p>}>
      <BuscaLocal {...busca} tipo="curso" />
    </Suspense>
  );
}
