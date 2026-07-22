import { Suspense } from "react";

import { BuscaLocal } from "@features/busca/components/BuscaLocal";
import { prepararBusca } from "@features/busca/data/indices";

export default function TrilhasPage() {
  const busca = prepararBusca("trilha");

  return (
    <Suspense fallback={<p>Carregando Trilhas...</p>}>
      <BuscaLocal {...busca} tipo="trilha" />
    </Suspense>
  );
}
