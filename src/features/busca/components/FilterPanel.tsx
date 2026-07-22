import { useMemo, useState } from "react";

import { normalizarTermoBusca } from "@shared/lib/busca";

import type { FiltroBusca, NomeFiltroBusca } from "../types";

type FilterPanelProps = Readonly<{
  filtros: readonly FiltroBusca[];
  onChange: (nome: NomeFiltroBusca, valor: string, ativo: boolean) => void;
  onClear: () => void;
  selecionados: Readonly<Partial<Record<NomeFiltroBusca, readonly string[]>>>;
}>;

export function FilterPanel({
  filtros,
  onChange,
  onClear,
  selecionados,
}: FilterPanelProps) {
  const haFiltrosAtivos = Object.values(selecionados).some(
    (opcoes) => opcoes.length > 0,
  );

  return (
    <div className="filter-panel">
      {haFiltrosAtivos ? (
        <button className="filter-panel__clear" onClick={onClear} type="button">
          Limpar filtros
        </button>
      ) : null}
      {filtros.map((filtro) => (
        <FilterGroup
          filtro={filtro}
          key={filtro.nome}
          onChange={onChange}
          selecionados={selecionados[filtro.nome] ?? []}
        />
      ))}
    </div>
  );
}

type FilterGroupProps = Readonly<{
  filtro: FiltroBusca;
  onChange: (nome: NomeFiltroBusca, valor: string, ativo: boolean) => void;
  selecionados: readonly string[];
}>;

function FilterGroup({ filtro, onChange, selecionados }: FilterGroupProps) {
  const [aberto, setAberto] = useState(selecionados.length > 0);
  const [consulta, setConsulta] = useState("");
  const [ordem, setOrdem] = useState<"relevancia" | "alfabetica">("relevancia");
  const mostrarFerramentas =
    filtro.nome === "categoria" ||
    filtro.nome === "area" ||
    filtro.opcoes.length > 6;
  const opcoesVisiveis = useMemo(() => {
    const termo = normalizarTermoBusca(consulta);
    return filtro.opcoes
      .filter((opcao) =>
        termo ? normalizarTermoBusca(opcao).includes(termo) : true,
      )
      .toSorted((a, b) =>
        ordem === "relevancia"
          ? filtro.contagens[b] - filtro.contagens[a] ||
            a.localeCompare(b, "pt-BR")
          : a.localeCompare(b, "pt-BR"),
      );
  }, [consulta, filtro, ordem]);

  return (
    <details
      className="filter-panel__group"
      onToggle={(event) => setAberto(event.currentTarget.open)}
      open={aberto}
    >
      <summary>
        <span>{filtro.rotulo}</span>
        {selecionados.length > 0 ? (
          <span className="filter-panel__count">{selecionados.length}</span>
        ) : null}
      </summary>
      <fieldset>
        <legend className="sr-only">{filtro.rotulo}</legend>
        {mostrarFerramentas ? (
          <div className="filter-panel__tools">
            <input
              aria-label={`Buscar em ${filtro.rotulo}`}
              onChange={(event) => setConsulta(event.target.value)}
              placeholder={`Buscar ${filtro.rotulo.toLocaleLowerCase("pt-BR")}…`}
              type="search"
              value={consulta}
            />
            <select
              aria-label={`Ordenar ${filtro.rotulo}`}
              onChange={(event) =>
                setOrdem(event.target.value as "relevancia" | "alfabetica")
              }
              value={ordem}
            >
              <option value="relevancia">Mais usadas</option>
              <option value="alfabetica">A–Z</option>
            </select>
          </div>
        ) : null}
        <div className="filter-panel__options">
          {opcoesVisiveis.map((opcao) => (
            <label key={opcao}>
              <input
                checked={selecionados.includes(opcao)}
                name={filtro.nome}
                onChange={(event) =>
                  onChange(filtro.nome, opcao, event.target.checked)
                }
                type="checkbox"
                value={opcao}
              />
              <span>{opcao}</span>
              <small
                aria-label={`${filtro.contagens[opcao]} conteúdos`}
                className="filter-panel__usage"
              >
                {filtro.contagens[opcao]}
              </small>
            </label>
          ))}
          {opcoesVisiveis.length === 0 ? (
            <p className="filter-panel__empty">Nenhuma opção encontrada.</p>
          ) : null}
        </div>
      </fieldset>
    </details>
  );
}
