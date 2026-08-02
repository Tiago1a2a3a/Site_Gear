import {
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { CalendarioPublico } from "@features/calendario/components/CalendarioPublico";
import {
  buildCalendarMonth,
  formatEventPeriod,
  listUpcomingEvents,
} from "@features/calendario/services/calendario";
import type { CalendarEvent } from "@features/calendario/types";

afterEach(cleanup);

const confirmedEvent: CalendarEvent = {
  allDay: false,
  confirmation: "confirmed",
  description: "Descrição do evento confirmado.",
  endsAt: "2026-08-07T21:00:00-03:00",
  id: "confirmed-event",
  name: "Palestra confirmada",
  startsAt: "2026-08-07T19:00:00-03:00",
};

const tentativeEvent: CalendarEvent = {
  allDay: true,
  confirmation: "tentative",
  description: "A data dependerá da disponibilidade de sala.",
  endsAt: "2026-08-15",
  id: "tentative-event",
  name: "Oficina a definir",
  startsAt: "2026-08-10",
};

describe("Calendário público", () => {
  it("divide um evento entre semanas sem perder sua identidade", () => {
    const crossingEvent: CalendarEvent = {
      ...confirmedEvent,
      allDay: true,
      endsAt: "2026-08-11",
      id: "crossing-event",
      startsAt: "2026-08-07",
    };
    const weeks = buildCalendarMonth(2026, 7, [crossingEvent]);
    const segments = weeks.flatMap((week) => week.segments);

    expect(segments).toHaveLength(2);
    expect(segments[0]).toMatchObject({ isEnd: false, isStart: true });
    expect(segments[1]).toMatchObject({ isEnd: true, isStart: false });
    expect(
      segments.every((segment) => segment.event.id === "crossing-event"),
    ).toBe(true);
  });

  it("separa eventos simultâneos em faixas clicáveis diferentes", () => {
    const secondEvent: CalendarEvent = {
      ...confirmedEvent,
      id: "second-event",
      name: "Segundo evento",
    };
    const week = buildCalendarMonth(2026, 7, [
      confirmedEvent,
      secondEvent,
    ]).find((calendarWeek) =>
      calendarWeek.segments.some(
        (segment) => segment.event.id === confirmedEvent.id,
      ),
    );

    expect(week?.segments).toHaveLength(2);
    expect(week?.segments.map((segment) => segment.lane)).toEqual([0, 1]);
  });

  it("ordena próximos eventos e remove os que já terminaram", () => {
    const pastEvent: CalendarEvent = {
      ...confirmedEvent,
      endsAt: "2026-07-02",
      id: "past-event",
      startsAt: "2026-07-01",
    };

    expect(
      listUpcomingEvents(
        [tentativeEvent, pastEvent, confirmedEvent],
        new Date("2026-08-01T12:00:00"),
      ).map((event) => event.id),
    ).toEqual(["confirmed-event", "tentative-event"]);
  });

  it("explica corretamente uma janela com data a definir", () => {
    expect(formatEventPeriod(tentativeEvent)).toContain(
      "A data exata ainda será confirmada",
    );
  });

  it("navega entre meses e abre detalhes acessíveis", () => {
    render(
      <CalendarioPublico
        events={[confirmedEvent, tentativeEvent]}
        initialMonth={7}
        initialYear={2026}
        referenceDate="2026-08-01"
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Agosto de 2026" }),
    ).toBeDefined();
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar próximo mês" }),
    );
    expect(
      screen.getByRole("heading", { name: "Setembro de 2026" }),
    ).toBeDefined();
    fireEvent.click(
      screen.getByRole("button", { name: "Mostrar mês anterior" }),
    );

    const grid = screen.getByTestId("calendar-month-grid");
    fireEvent.click(
      within(grid).getByRole("button", { name: /Palestra confirmada/ }),
    );

    const dialog = screen.getByRole("dialog", { name: "Palestra confirmada" });
    expect(
      within(dialog).getByText("Descrição do evento confirmado."),
    ).toBeDefined();
    const googleCalendarLink = within(dialog).getByRole("link", {
      name: /Adicionar evento ao Google Agenda/,
    }) as HTMLAnchorElement;
    expect(googleCalendarLink.href).toContain("calendar.google.com");
    fireEvent.click(
      within(dialog).getByRole("button", { name: "Fechar detalhes do evento" }),
    );
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("não oferece Google Agenda para evento com data a definir", () => {
    render(
      <CalendarioPublico
        events={[tentativeEvent]}
        initialMonth={7}
        initialYear={2026}
        referenceDate="2026-08-01"
      />,
    );

    fireEvent.click(
      within(screen.getByTestId("calendar-month-grid")).getByRole("button", {
        name: /Oficina a definir/,
      }),
    );

    expect(
      screen.getByRole("dialog", { name: "Oficina a definir" }),
    ).toBeDefined();
    expect(screen.queryByRole("link", { name: /Google Agenda/ })).toBeNull();
  });
});
