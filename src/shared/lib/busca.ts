export function normalizarTermoBusca(termo: string) {
  return termo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
