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
import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@shared/components/ui/Breadcrumbs";

import { FilterDrawer } from "./FilterDrawer";
import { FilterPanel } from "./FilterPanel";
import { ResultList } from "./ResultList";
import { SearchBar } from "./SearchBar";
import {
  filtrarDocumentos,
  idsDosResultados,
  opcoesDoIndice,
  ordenarDocumentos,
} from "../data/motor";
import type {
  DocumentoBusca,
  FiltroBusca,
  NomeFiltroBusca,
  OrdemResultados,
  TipoBusca,
  TipoDocumentoBusca,
} from "../types";

type BuscaLocalProps = Readonly<{
  documentos: readonly DocumentoBusca[];
  filtros: readonly FiltroBusca[];
  indiceSerializado: string;
  tipo: TipoBusca;
}>;

const rotulos: Record<TipoDocumentoBusca, string> = {
  aula: "Aulas",
  curso: "Cursos",
  trilha: "Trilhas",
};

const descricoes: Record<TipoDocumentoBusca, string> = {
  aula: "Veja todas as aulas publicadas e encontre o próximo conteúdo para aprender.",
  curso:
    "Veja todos os cursos publicados e encontre o próximo conteúdo para aprender.",
  trilha:
    "Veja todas as trilhas publicadas e encontre o próximo conteúdo para aprender.",
};

const ITENS_POR_PAGINA = 12;

function lerOrdem(valor: string | null): OrdemResultados {
  return valor === "recentes" || valor === "antigas" ? valor : "alfabetica";
}

function lerPagina(valor: string | null) {
  const pagina = Number.parseInt(valor ?? "1", 10);
  return Number.isFinite(pagina) && pagina > 0 ? pagina : 1;
}

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
  const ordemDaUrl = lerOrdem(searchParams.get("ordem"));
  const paginaDaUrl = lerPagina(searchParams.get("pagina"));
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
  const [ordem, definirOrdemOtimista] = useOptimistic(ordemDaUrl);
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
      atualizarUrl((params) => {
        if (valor) {
          params.set("q", valor);
        } else {
          params.delete("q");
        }
        params.delete("pagina");
      });
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
        params.delete("pagina");
      }, "push");
    });
  }

  function atualizarOrdem(valor: OrdemResultados) {
    startTransition(() => {
      definirOrdemOtimista(valor);
      atualizarUrl((params) => {
        if (valor === "alfabetica") {
          params.delete("ordem");
        } else {
          params.set("ordem", valor);
        }
        params.delete("pagina");
      });
    });
  }

  function atualizarPagina(pagina: number) {
    atualizarUrl((params) => {
      if (pagina === 1) {
        params.delete("pagina");
      } else {
        params.set("pagina", String(pagina));
      }
    }, "push");
  }

  function limparFiltros() {
    startTransition(() => {
      definirSelecionadosOtimistas({});
      atualizarUrl((params) => {
        for (const filtro of filtros) {
          params.delete(filtro.nome);
        }
        params.delete("pagina");
      }, "push");
    });
  }

  function limparTudo() {
    startTransition(() => {
      definirTermoOtimista("");
      definirOrdemOtimista("alfabetica");
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
        resultados: ordenarDocumentos(
          filtrarDocumentos(candidatos, selecionados),
          ordem,
        ),
      };
    } catch {
      return { erro: true, resultados: [] };
    }
  }, [documentos, indiceSerializado, ordem, selecionados, termo]);

  const totalDePaginas = Math.max(
    1,
    Math.ceil(estado.resultados.length / ITENS_POR_PAGINA),
  );
  const paginaAtual = Math.min(paginaDaUrl, totalDePaginas);
  const inicioDaPagina = (paginaAtual - 1) * ITENS_POR_PAGINA;
  const resultadosDaPagina = estado.resultados.slice(
    inicioDaPagina,
    inicioDaPagina + ITENS_POR_PAGINA,
  );

  const fecharDrawer = useCallback(() => setDrawerAberto(false), []);

  const buscaGeral = tipo === "geral";
  const rotulo = buscaGeral ? "todos os conteúdos" : rotulos[tipo];
  const breadcrumbs: BreadcrumbItem[] = [
    { href: "/aprendizado", label: "Aprendizado" },
  ];

  if (!buscaGeral) {
    breadcrumbs.push({ label: rotulos[tipo] });
  } else {
    breadcrumbs.push({ label: "Todos os conteúdos" });
  }

  return (
    <div className="search-page">
      <div className="learning-list-breadcrumbs">
        <Breadcrumbs items={breadcrumbs} />
      </div>
      <header className="page-heading">
        <h1>{buscaGeral ? "Todos os conteúdos" : rotulos[tipo]}</h1>
        <p>
          {buscaGeral
            ? "Explore aulas, cursos e trilhas publicados em um só lugar."
            : descricoes[tipo]}
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
        <div aria-hidden="true" className="search-layout__heading-spacer" />
        <div className="search-content__heading">
          <div>
            <p className="status-label" id="search-results-title">
              Resultados
            </p>
            <p aria-live="polite" className="search-result-count">
              {`${estado.resultados.length} resultado${estado.resultados.length === 1 ? "" : "s"}`}
            </p>
          </div>
          <div className="search-content__actions">
            <label>
              <span>Ordenar por</span>
              <select
                onChange={(event) =>
                  atualizarOrdem(event.target.value as OrdemResultados)
                }
                value={ordem}
              >
                <option value="alfabetica">A–Z</option>
                <option value="recentes">Mais recentes</option>
                <option value="antigas">Mais antigas</option>
              </select>
            </label>
            {termo || haFiltros ? (
              <Button onClick={limparTudo} variant="secondary">
                Limpar busca e filtros
              </Button>
            ) : null}
          </div>
        </div>
        <aside aria-label="Filtros da busca" className="search-sidebar">
          <h2>Filtros</h2>
          <FilterPanel
            filtros={filtros}
            onChange={atualizarFiltro}
            onClear={limparFiltros}
            selecionados={selecionados}
          />
        </aside>

        <section
          aria-labelledby="search-results-title"
          className="search-content"
        >
          {estado.erro ? (
            <div className="search-state card" role="alert">
              <h2>Não foi possível carregar o índice</h2>
              <p>Atualize a página e tente novamente.</p>
            </div>
          ) : estado.resultados.length ? (
            <>
              <ResultList documentos={resultadosDaPagina} />
              {totalDePaginas > 1 ? (
                <nav
                  aria-label="Paginação dos resultados"
                  className="pagination search-pagination"
                >
                  <button
                    disabled={paginaAtual === 1}
                    onClick={() => atualizarPagina(paginaAtual - 1)}
                    type="button"
                  >
                    Anterior
                  </button>
                  <span>
                    Página {paginaAtual} de {totalDePaginas}
                  </span>
                  <button
                    disabled={paginaAtual === totalDePaginas}
                    onClick={() => atualizarPagina(paginaAtual + 1)}
                    type="button"
                  >
                    Próxima
                  </button>
                </nav>
              ) : null}
            </>
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
          onClear={limparFiltros}
          onClose={fecharDrawer}
          selecionados={selecionados}
        />
      ) : null}
    </div>
  );
}
