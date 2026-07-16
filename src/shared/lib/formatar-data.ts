const formatadorDeDataLonga = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
});

export function formatarDataLonga(data: string) {
  return formatadorDeDataLonga.format(new Date(`${data}T00:00:00Z`));
}
