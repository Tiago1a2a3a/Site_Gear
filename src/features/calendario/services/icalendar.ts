import type { CalendarEvent } from "../types";

const DEFAULT_TIMED_EVENT_DURATION_MS = 60 * 60 * 1000;
const MAX_LINE_BYTES = 75;

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

function escapeText(value: string) {
  return value
    .replaceAll("\\", "\\\\")
    .replaceAll("\n", "\\n")
    .replaceAll(";", "\\;")
    .replaceAll(",", "\\,");
}

function byteLength(value: string) {
  return new TextEncoder().encode(value).length;
}

function foldLine(line: string) {
  const folded: string[] = [];
  let current = "";

  for (const character of line) {
    if (current && byteLength(`${current}${character}`) > MAX_LINE_BYTES) {
      folded.push(current);
      current = ` ${character}`;
    } else {
      current += character;
    }
  }

  folded.push(current);
  return folded.join("\r\n");
}

function stableUid(event: CalendarEvent, siteUrl: string) {
  const hostname = new URL(siteUrl).hostname;
  const safeId = event.id.replace(/[^a-zA-Z0-9._-]/g, "-");

  return `${safeId}@${hostname}`;
}

function serializeEvent(
  event: CalendarEvent,
  siteUrl: string,
  generatedAt: Date,
) {
  const lines = [
    "BEGIN:VEVENT",
    `UID:${stableUid(event, siteUrl)}`,
    `DTSTAMP:${formatUtcDate(generatedAt)}`,
  ];

  if (event.allDay) {
    const inclusiveEnd = event.endsAt ?? event.startsAt;
    lines.push(`DTSTART;VALUE=DATE:${formatAllDayDate(event.startsAt)}`);
    lines.push(
      `DTEND;VALUE=DATE:${formatAllDayDate(addDays(inclusiveEnd, 1))}`,
    );
  } else {
    const start = new Date(event.startsAt);
    const end = event.endsAt
      ? new Date(event.endsAt)
      : new Date(start.getTime() + DEFAULT_TIMED_EVENT_DURATION_MS);

    lines.push(`DTSTART:${formatUtcDate(start)}`);
    lines.push(`DTEND:${formatUtcDate(end)}`);
  }

  lines.push(`SUMMARY:${escapeText(event.name)}`);

  const description = [event.description, event.link]
    .filter(Boolean)
    .join("\n\n");
  if (description) {
    lines.push(`DESCRIPTION:${escapeText(description)}`);
  }

  if (event.link) {
    lines.push(`URL:${event.link}`);
  }

  lines.push("STATUS:CONFIRMED", "END:VEVENT");
  return lines;
}

export function serializeCalendar(
  events: CalendarEvent[],
  options: { siteUrl: string; generatedAt?: Date },
) {
  const generatedAt = options.generatedAt ?? new Date();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Portal GEAR//Calendario Publico//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:GEAR",
    ...events
      .filter((event) => event.confirmation === "confirmed")
      .flatMap((event) => serializeEvent(event, options.siteUrl, generatedAt)),
    "END:VCALENDAR",
  ];

  return `${lines.map(foldLine).join("\r\n")}\r\n`;
}
