import type { CalendarEvent } from "../types";

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function atTime(date: Date, time: string) {
  return `${toDateKey(date)}T${time}:00-03:00`;
}

export function listarEventosDeExemplo(
  referenceDate = new Date(),
): readonly CalendarEvent[] {
  const dates = Array.from({ length: 12 }, (_, index) =>
    addDays(referenceDate, index * 5 + 2),
  );

  return [
    {
      allDay: false,
      confirmation: "confirmed",
      description:
        "Um encontro demonstrativo para visualizar como título, horário e descrição aparecerão quando o calendário estiver conectado ao Notion.",
      endsAt: atTime(dates[0], "20:30"),
      id: "demo-palestra-robotica",
      name: "Palestra aberta de robótica",
      startsAt: atTime(dates[0], "19:00"),
    },
    {
      allDay: true,
      confirmation: "tentative",
      description:
        "A atividade está prevista para esta janela, mas o dia exato dependerá da disponibilidade de sala.",
      endsAt: toDateKey(addDays(dates[1], 4)),
      id: "demo-oficina-a-definir",
      name: "Oficina de prototipagem",
      startsAt: toDateKey(dates[1]),
    },
    {
      allDay: true,
      confirmation: "confirmed",
      description:
        "Evento demonstrativo de vários dias para validar a continuidade visual entre semanas e meses.",
      endsAt: toDateKey(addDays(dates[2], 2)),
      id: "demo-mostra-projetos",
      name: "Mostra de projetos do GEAR",
      startsAt: toDateKey(dates[2]),
    },
    {
      allDay: false,
      confirmation: "confirmed",
      description:
        "Atividade fictícia usada para testar a apresentação de um evento confirmado com horário.",
      endsAt: atTime(dates[3], "17:30"),
      id: "demo-visita-laboratorio",
      name: "Visita guiada ao laboratório",
      startsAt: atTime(dates[3], "15:00"),
    },
    {
      allDay: false,
      confirmation: "confirmed",
      description:
        "Encontro de exemplo sobre fundamentos e aplicações de sensores em projetos de robótica.",
      endsAt: atTime(dates[4], "20:00"),
      id: "demo-encontro-sensores",
      name: "Encontro sobre sensores",
      startsAt: atTime(dates[4], "18:30"),
    },
    {
      allDay: true,
      confirmation: "tentative",
      description:
        "Semana reservada provisoriamente para uma atividade aberta. A confirmação virá pelo calendário oficial.",
      endsAt: toDateKey(addDays(dates[5], 5)),
      id: "demo-semana-introducao",
      name: "Introdução à eletrônica",
      startsAt: toDateKey(dates[5]),
    },
    {
      allDay: false,
      confirmation: "confirmed",
      description:
        "Evento fictício para demonstrar a expansão da lista de próximos eventos no celular.",
      endsAt: atTime(dates[6], "21:00"),
      id: "demo-arduino",
      name: "Arduino na prática",
      startsAt: atTime(dates[6], "19:00"),
    },
    {
      allDay: true,
      confirmation: "confirmed",
      description:
        "Atividade demonstrativa de dia inteiro para validar diferentes formatos de data.",
      id: "demo-desafio-robotica",
      name: "Desafio de robótica",
      startsAt: toDateKey(dates[7]),
    },
    {
      allDay: false,
      confirmation: "confirmed",
      description:
        "Conversa de demonstração sobre caminhos de estudo e participação nas atividades do grupo.",
      endsAt: atTime(dates[8], "20:30"),
      id: "demo-conversa-gear",
      name: "Conversa aberta com o GEAR",
      startsAt: atTime(dates[8], "19:00"),
    },
  ];
}
