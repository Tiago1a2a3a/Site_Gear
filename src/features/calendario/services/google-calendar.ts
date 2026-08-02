import type { CalendarEvent } from "../types";

const GOOGLE_CALENDAR_URL = "https://calendar.google.com/calendar/render";
const DEFAULT_TIMED_EVENT_DURATION_MS = 60 * 60 * 1000;

function addDays(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return date.toISOString().slice(0, 10);
}

function formatAllDayDate(dateKey: string) {
  return dateKey.replaceAll("-", "");
}

function formatUtcDate(date: Date) {
  return date
    .toISOString()
    .replaceAll("-", "")
    .replaceAll(":", "")
    .replace(".000", "");
}

function buildDates(event: CalendarEvent) {
  if (event.allDay) {
    const inclusiveEnd = event.endsAt ?? event.startsAt;
    return `${formatAllDayDate(event.startsAt)}/${formatAllDayDate(addDays(inclusiveEnd, 1))}`;
  }

  const start = new Date(event.startsAt);
  const end = event.endsAt
    ? new Date(event.endsAt)
    : new Date(start.getTime() + DEFAULT_TIMED_EVENT_DURATION_MS);

  return `${formatUtcDate(start)}/${formatUtcDate(end)}`;
}

export function buildGoogleCalendarUrl(event: CalendarEvent) {
  if (event.confirmation !== "confirmed") {
    return undefined;
  }

  const details = [event.description, event.link].filter(Boolean).join("\n\n");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.name,
    dates: buildDates(event),
  });

  if (details) {
    params.set("details", details);
  }

  return `${GOOGLE_CALENDAR_URL}?${params.toString()}`;
}
