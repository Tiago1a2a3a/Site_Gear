import "server-only";

import { listarEventosDeExemplo } from "./eventos-exemplo";
import { queryPublicNotionCalendar } from "../services/notion";
import { normalizePublicNotionEvents } from "../services/normalizar-evento";
import type { CalendarEvent } from "../types";

export type CalendarEventsResult = Readonly<{
  events: readonly CalendarEvent[];
  status: "demo" | "ready" | "unavailable";
}>;

export async function listPublicCalendarEvents(
  referenceDate = new Date(),
): Promise<CalendarEventsResult> {
  const apiKey = process.env.NOTION_API_KEY?.trim();
  const dataSourceId = process.env.NOTION_CALENDAR_DATA_SOURCE_ID?.trim();

  if (!apiKey || !dataSourceId) {
    return {
      events: listarEventosDeExemplo(referenceDate),
      status: "demo",
    };
  }

  try {
    const pages = await queryPublicNotionCalendar({ apiKey, dataSourceId });
    return { events: normalizePublicNotionEvents(pages), status: "ready" };
  } catch {
    return { events: [], status: "unavailable" };
  }
}
