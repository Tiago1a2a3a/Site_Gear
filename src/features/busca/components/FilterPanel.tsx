import type { FiltroBusca, NomeFiltroBusca } from "../types";

type FilterPanelProps = Readonly<{
  filtros: readonly FiltroBusca[];
  onChange: (nome: NomeFiltroBusca, valor: string, ativo: boolean) => void;
  selecionados: Readonly<Partial<Record<NomeFiltroBusca, readonly string[]>>>;
}>;

export function FilterPanel({
  filtros,
  onChange,
  selecionados,
}: FilterPanelProps) {
  return (
    <div className="filter-panel">
      {filtros.map((filtro) => (
        <details
          className="filter-panel__group"
          key={filtro.nome}
          open={(selecionados[filtro.nome]?.length ?? 0) > 0}
        >
          <summary>
            <span>{filtro.rotulo}</span>
            {(selecionados[filtro.nome]?.length ?? 0) > 0 ? (
              <span className="filter-panel__count">
                {selecionados[filtro.nome]?.length}
              </span>
            ) : null}
          </summary>
          <fieldset>
            <legend className="sr-only">{filtro.rotulo}</legend>
            <div className="filter-panel__options">
              {filtro.opcoes.map((opcao) => (
                <label key={opcao}>
                  <input
                    checked={selecionados[filtro.nome]?.includes(opcao) ?? false}
                    name={filtro.nome}
                    onChange={(event) =>
                      onChange(filtro.nome, opcao, event.target.checked)
                    }
                    type="checkbox"
                    value={opcao}
                  />
                  <span>{opcao}</span>
                </label>
              ))}
            </div>
          </fieldset>
        </details>
      ))}
    </div>
  );
}
