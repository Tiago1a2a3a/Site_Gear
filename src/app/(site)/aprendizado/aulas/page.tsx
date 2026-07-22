import { Suspense } from "react";

import { BuscaLocal } from "@features/busca/components/BuscaLocal";
import { prepararBusca } from "@features/busca/data/indices";

export default function AulasPage() {
  const busca = prepararBusca("aula");

  return (
    <Suspense fallback={<p>Carregando Aulas...</p>}>
      <BuscaLocal {...busca} tipo="aula" />
    </Suspense>
  );
}
