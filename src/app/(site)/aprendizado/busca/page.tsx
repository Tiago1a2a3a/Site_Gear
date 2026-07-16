import { Suspense } from "react";

import { BuscaLocal } from "@features/busca/components/BuscaLocal";
import { prepararBusca } from "@features/busca/data/indices";

export default function BuscaDeConteudosPage() {
  const busca = prepararBusca("geral");

  return (
    <Suspense fallback={<p>Carregando busca de conteúdos...</p>}>
      <BuscaLocal {...busca} tipo="geral" />
    </Suspense>
  );
}
