"use client";

import { useEffect, useRef } from "react";

import { Button } from "@shared/components/ui/Button";

import { FilterPanel } from "./FilterPanel";
import type { FiltroBusca, NomeFiltroBusca } from "../types";

type FilterDrawerProps = Readonly<{
  filtros: readonly FiltroBusca[];
  onChange: (nome: NomeFiltroBusca, valor: string, ativo: boolean) => void;
  onClose: () => void;
  selecionados: Readonly<Partial<Record<NomeFiltroBusca, readonly string[]>>>;
}>;

export function FilterDrawer(props: FilterDrawerProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const { onClose } = props;

  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const focusable = () => [
      ...(dialogRef.current?.querySelectorAll<HTMLElement>("button, input") ??
        []),
    ];
    focusable()[0]?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") return onClose();
      if (event.key !== "Tab") return;
      const elements = focusable();
      const first = elements[0];
      const last = elements.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previousFocus?.focus();
    };
  }, [onClose]);

  return (
    <div className="filter-drawer__backdrop">
      <div
        aria-labelledby="filter-drawer-title"
        aria-modal="true"
        className="filter-drawer"
        ref={dialogRef}
        role="dialog"
      >
        <div className="filter-drawer__heading">
          <h2 id="filter-drawer-title">Filtrar resultados</h2>
          <Button onClick={props.onClose} variant="secondary">
            Fechar
          </Button>
        </div>
        <FilterPanel
          filtros={props.filtros}
          onChange={props.onChange}
          selecionados={props.selecionados}
        />
      </div>
    </div>
  );
}
