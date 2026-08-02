import { afterEach, describe, expect, it, vi } from "vitest";

import { listPublicCalendarEvents } from "@features/calendario/data/eventos";
import { buildGoogleCalendarUrl } from "@features/calendario/services/google-calendar";
import { serializeCalendar } from "@features/calendario/services/icalendar";
import {
  normalizeNotionCalendarPage,
  normalizePublicNotionEvents,
  type NotionCalendarPage,
} from "@features/calendario/services/normalizar-evento";
import { queryPublicNotionCalendar } from "@features/calendario/services/notion";
import type { CalendarEvent } from "@features/calendario/types";

vi.mock("server-only", () => ({}));

afterEach(() => {
  vi.unstubAllEnvs();
});

const confirmedEvent: CalendarEvent = {
  allDay: true,
  confirmation: "confirmed",
  description: "Robótica, visão e controle; entrada gratuita.",
  endsAt: "2026-08-08",
  id: "notion-page-1",
  link: "https://gear.example/evento",
  name: "Semana da Robótica",
  startsAt: "2026-08-07",
};

const tentativeEvent: CalendarEvent = {
  allDay: true,
  confirmation: "tentative",
  endsAt: "2026-08-15",
  id: "notion-page-2",
  name: "Oficina a definir",
  startsAt: "2026-08-10",
};

function notionPage(
  overrides: Record<string, unknown> = {},
): NotionCalendarPage {
  return {
    id: "notion-page-1",
    object: "page",
    properties: {
      Confirmação: {
        select: { name: "Confirmado" },
        type: "select",
      },
      "Descrição ": {
        rich_text: [{ plain_text: "Evento público." }],
        type: "rich_text",
      },
      Link: { type: "url", url: "https://gear.example/evento" },
      Nome: { title: [{ plain_text: "Palestra aberta" }], type: "title" },
      Período: { date: { end: null, start: "2026-08-07" }, type: "date" },
      Visibilidade: {
        multi_select: [{ name: "Público" }],
        type: "multi_select",
      },
      ...overrides,
    },
  };
}

describe("normalização do calendário do Notion", () => {
  it("converte somente uma página pública válida", () => {
    expect(normalizeNotionCalendarPage(notionPage())).toEqual({
      allDay: true,
      confirmation: "confirmed",
      description: "Evento público.",
      id: "notion-page-1",
      link: "https://gear.example/evento",
      name: "Palestra aberta",
      startsAt: "2026-08-07",
    });
  });

  it.each([
    [
      "interno",
      {
        Visibilidade: {
          multi_select: [{ name: "Interno" }],
          type: "multi_select",
        },
      },
    ],
    [
      "com visibilidade ambígua",
      {
        Visibilidade: {
          multi_select: [{ name: "Público" }, { name: "Interno" }],
          type: "multi_select",
        },
      },
    ],
    [
      "confirmação desconhecida",
      { Confirmação: { select: { name: "Talvez" }, type: "select" } },
    ],
    ["link inseguro", { Link: { type: "url", url: "http://gear.example" } }],
    [
      "janela indefinida sem fim",
      { Confirmação: { select: { name: "A definir" }, type: "select" } },
    ],
  ])("descarta um registro %s", (_label, overrides) => {
    expect(normalizeNotionCalendarPage(notionPage(overrides))).toBeUndefined();
  });

  it("ordena somente os registros válidos", () => {
    const later = notionPage({
      Nome: { title: [{ plain_text: "Evento posterior" }], type: "title" },
      Período: { date: { end: null, start: "2026-09-01" }, type: "date" },
    });
    expect(
      normalizePublicNotionEvents([later, notionPage()]).map(
        (event) => event.name,
      ),
    ).toEqual(["Palestra aberta", "Evento posterior"]);
  });
});

describe("consulta server-only do Notion", () => {
  it("não publica eventos fictícios quando a integração não está configurada", async () => {
    vi.stubEnv("NOTION_API_KEY", "");
    vi.stubEnv("NOTION_CALENDAR_DATA_SOURCE_ID", "");

    await expect(listPublicCalendarEvents()).resolves.toEqual({
      events: [],
      status: "unavailable",
    });
  });

  it("filtra Visibilidade pública no servidor e percorre a paginação", async () => {
    const fetcher = vi
      .fn<typeof fetch>()
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            has_more: true,
            next_cursor: "next",
            results: [notionPage()],
          }),
        ),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ has_more: false, next_cursor: null, results: [] }),
        ),
      );

    const pages = await queryPublicNotionCalendar({
      apiKey: "secret",
      dataSourceId: "source/id",
      fetcher,
    });

    expect(pages).toHaveLength(1);
    expect(fetcher).toHaveBeenCalledTimes(2);
    expect(fetcher.mock.calls[0]?.[0]).toContain("source%2Fid/query");
    const firstRequest = fetcher.mock.calls[0]?.[1];
    expect(firstRequest?.headers).toMatchObject({
      Authorization: "Bearer secret",
      "Notion-Version": "2026-03-11",
    });
    expect(JSON.parse(String(firstRequest?.body))).toMatchObject({
      filter: {
        multi_select: { contains: "Público" },
        property: "Visibilidade",
      },
    });
    expect(JSON.parse(String(fetcher.mock.calls[1]?.[1]?.body))).toMatchObject({
      start_cursor: "next",
    });
  });
});

describe("exportações de agenda", () => {
  it("gera o link do Google com fim exclusivo para evento de dia inteiro", () => {
    const url = new URL(buildGoogleCalendarUrl(confirmedEvent)!);
    expect(url.hostname).toBe("calendar.google.com");
    expect(url.searchParams.get("text")).toBe("Semana da Robótica");
    expect(url.searchParams.get("dates")).toBe("20260807/20260809");
    expect(url.searchParams.get("details")).toContain(confirmedEvent.link);
    expect(buildGoogleCalendarUrl(tentativeEvent)).toBeUndefined();
  });

  it("gera um feed compatível, estável e sem eventos a definir", () => {
    const feed = serializeCalendar([confirmedEvent, tentativeEvent], {
      generatedAt: new Date("2026-08-01T12:00:00Z"),
      siteUrl: "https://site-gear.vercel.app",
    });

    expect(feed).toContain("BEGIN:VCALENDAR\r\n");
    expect(feed).toContain("UID:notion-page-1@site-gear.vercel.app\r\n");
    expect(feed).toContain("DTSTART;VALUE=DATE:20260807\r\n");
    expect(feed).toContain("DTEND;VALUE=DATE:20260809\r\n");
    expect(feed).toContain("Robótica\\, visão e controle\\; entrada gratuita.");
    expect(feed).not.toContain("Oficina a definir");
    expect(
      feed
        .split("\r\n")
        .every((line) => new TextEncoder().encode(line).length <= 75),
    ).toBe(true);
    expect(feed.endsWith("\r\n")).toBe(true);
  });
});
