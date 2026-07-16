"use client";

import MiniSearch from "minisearch";
import {
  startTransition,
  useCallback,
  useMemo,
  useOptimistic,
  useState,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@shared/components/ui/Button";

import { FilterDrawer } from "./FilterDrawer";
import { FilterPanel } from "./FilterPanel";
import { ResultList } from "./ResultList";
import { SearchBar } from "./SearchBar";
import {
  filtrarDocumentos,
  idsDosResultados,
  opcoesDoIndice,
} from "../data/motor";
import type {
  DocumentoBusca,
  FiltroBusca,
  NomeFiltroBusca,
  TipoDocumentoBusca,
} from "../types";

type BuscaLocalProps = Readonly<{
  documentos: readonly DocumentoBusca[];
  filtros: readonly FiltroBusca[];
  indiceSerializado: string;
  tipo: TipoDocumentoBusca;
}>;

const rotulos: Record<TipoDocumentoBusca, string> = {
  aula: "Aulas",
  curso: "Cursos",
  trilha: "Trilhas",
};

export function BuscaLocal({
  documentos,
  filtros,
  indiceSerializado,
  tipo,
}: BuscaLocalProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [drawerAberto, setDrawerAberto] = useState(false);
  const termoDaUrl = searchParams.get("q") ?? "";
  const selecionadosDaUrl = useMemo(
    () =>
      Object.fromEntries(
        filtros.map((filtro) => [
          filtro.nome,
          searchParams.getAll(filtro.nome),
        ]),
      ) as Partial<Record<NomeFiltroBusca, string[]>>,
    [filtros, searchParams],
  );
  const [termo, definirTermoOtimista] = useOptimistic(termoDaUrl);
  const [selecionados, definirSelecionadosOtimistas] =
    useOptimistic(selecionadosDaUrl);
  const haFiltros = Object.values(selecionados).some((itens) => itens.length);

  function atualizarUrl(
    mutacao: (params: URLSearchParams) => void,
    modo: "push" | "replace" = "replace",
  ) {
    const params = new URLSearchParams(searchParams.toString());
    mutacao(params);
    const query = params.toString();
    router[modo](query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  function atualizarTermo(valor: string) {
    startTransition(() => {
      definirTermoOtimista(valor);
      atualizarUrl((params) =>
        valor ? params.set("q", valor) : params.delete("q"),
      );
    });
  }

  function atualizarFiltro(
    nome: NomeFiltroBusca,
    valor: string,
    ativo: boolean,
  ) {
    startTransition(() => {
      const novosSelecionados = {
        ...selecionados,
        [nome]: ativo
          ? [...new Set([...(selecionados[nome] ?? []), valor])]
          : (selecionados[nome] ?? []).filter((item) => item !== valor),
      };
      definirSelecionadosOtimistas(novosSelecionados);
      atualizarUrl((params) => {
        params.delete(nome);
        for (const item of novosSelecionados[nome] ?? []) {
          params.append(nome, item);
        }
      }, "push");
    });
  }

  function limparTudo() {
    startTransition(() => {
      definirTermoOtimista("");
      definirSelecionadosOtimistas({});
      router.push(pathname, { scroll: false });
    });
  }

  const estado = useMemo(() => {
    try {
      const indice = MiniSearch.loadJSON<DocumentoBusca>(
        indiceSerializado,
        opcoesDoIndice(),
      );
      const ids = termo.trim()
        ? idsDosResultados(
            indice.search(termo, {
              boost: { titulo: 4, descricao: 2, tags: 2 },
              combineWith: "AND",
              fuzzy: 0.2,
              prefix: true,
            }),
          )
        : null;
      const candidatos = ids
        ? documentos.filter((documento) => ids.has(documento.id))
        : documentos;
      return {
        erro: false,
        resultados: filtrarDocumentos(candidatos, selecionados),
      };
    } catch {
      return { erro: true, resultados: [] };
    }
  }, [documentos, indiceSerializado, selecionados, termo]);

  const fecharDrawer = useCallback(() => setDrawerAberto(false), []);

  const estadoInicial = !termo.trim() && !haFiltros;
  const rotulo = rotulos[tipo];

  return (
    <div className="search-page">
      <header className="page-heading">
        <p className="status-label">Aprendizado / {rotulo} / Busca</p>
        <h1>Busca de {rotulo}</h1>
        <p>
          Esta busca consulta exclusivamente {rotulo.toLocaleLowerCase("pt-BR")}{" "}
          publicados.
        </p>
      </header>

      <SearchBar
        onChange={atualizarTermo}
        onClear={() => atualizarTermo("")}
        rotulo={`Buscar em ${rotulo}`}
        valor={termo}
      />

      <div className="search-mobile-actions">
        <Button onClick={() => setDrawerAberto(true)} variant="secondary">
          Filtros{haFiltros ? " ativos" : ""}
        </Button>
      </div>

      <div className="search-layout">
        <aside aria-label="Filtros da busca" className="search-sidebar">
          <h2>Filtros</h2>
          <FilterPanel
            filtros={filtros}
            onChange={atualizarFiltro}
            selecionados={selecionados}
          />
        </aside>

        <section
          aria-labelledby="search-results-title"
          className="search-content"
        >
          <div className="search-content__heading">
            <div>
              <p className="status-label" id="search-results-title">
                Resultados
              </p>
              <p aria-live="polite" className="search-result-count">
                {estadoInicial
                  ? "Aguardando uma busca"
                  : `${estado.resultados.length} resultado${estado.resultados.length === 1 ? "" : "s"}`}
              </p>
            </div>
            {termo || haFiltros ? (
              <Button onClick={limparTudo} variant="secondary">
                Limpar busca e filtros
              </Button>
            ) : null}
          </div>

          {estado.erro ? (
            <div className="search-state card" role="alert">
              <h2>Não foi possível carregar o índice</h2>
              <p>Atualize a página e tente novamente.</p>
            </div>
          ) : estadoInicial ? (
            <div className="search-state card">
              <h2>Comece pelo tema que procura</h2>
              <p>Digite um termo ou selecione um filtro para ver resultados.</p>
            </div>
          ) : estado.resultados.length ? (
            <ResultList documentos={estado.resultados} />
          ) : (
            <div className="search-state card">
              <h2>Nenhum resultado encontrado</h2>
              <p>Tente outro termo ou remova os filtros ativos.</p>
              <Button onClick={limparTudo} variant="secondary">
                Limpar busca e filtros
              </Button>
            </div>
          )}
        </section>
      </div>

      {drawerAberto ? (
        <FilterDrawer
          filtros={filtros}
          onChange={atualizarFiltro}
          onClose={fecharDrawer}
          selecionados={selecionados}
        />
      ) : null}
    </div>
  );
}
