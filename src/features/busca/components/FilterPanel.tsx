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
        <fieldset key={filtro.nome}>
          <legend>{filtro.rotulo}</legend>
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
        </fieldset>
      ))}
    </div>
  );
}
