import { Suspense } from "react";

import { BuscaLocal } from "@features/busca/components/BuscaLocal";
import { prepararBusca } from "@features/busca/data/indices";

export default function BuscaDeAulasPage() {
  const busca = prepararBusca("aula");
  return (
    <Suspense fallback={<p>Carregando busca de Aulas...</p>}>
      <BuscaLocal {...busca} tipo="aula" />
    </Suspense>
  );
}
