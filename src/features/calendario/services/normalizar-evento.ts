import type { CalendarEvent } from "../types";

type UnknownRecord = Record<string, unknown>;

export type NotionCalendarPage = Readonly<{
  archived?: unknown;
  id?: unknown;
  in_trash?: unknown;
  object?: unknown;
  properties?: unknown;
}>;

function asRecord(value: unknown): UnknownRecord | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return;
  return value as UnknownRecord;
}

function getProperty(page: NotionCalendarPage, name: string) {
  return asRecord(asRecord(page.properties)?.[name]);
}

function getPropertyIgnoringOuterSpaces(
  page: NotionCalendarPage,
  name: string,
) {
  const properties = asRecord(page.properties);
  if (!properties) return;

  const matches = Object.entries(properties).filter(
    ([propertyName]) => propertyName.trim() === name,
  );
  if (matches.length !== 1) return;
  return asRecord(matches[0]?.[1]);
}

function readPlainText(value: unknown) {
  if (!Array.isArray(value)) return;
  const text = value
    .map((item) => asRecord(item)?.plain_text)
    .filter((item): item is string => typeof item === "string")
    .join("")
    .trim();
  return text || undefined;
}

function isDateOnly(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function isValidDateValue(value: string) {
  if (isDateOnly(value)) {
    const [year, month, day] = value.split("-").map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return (
      date.getUTCFullYear() === year &&
      date.getUTCMonth() === month - 1 &&
      date.getUTCDate() === day
    );
  }
  return !Number.isNaN(Date.parse(value));
}

function isValidHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      value.startsWith("https://") &&
      url.protocol === "https:" &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

function isEndBeforeStart(start: string, end: string, allDay: boolean) {
  return allDay ? end < start : Date.parse(end) < Date.parse(start);
}

export function normalizeNotionCalendarPage(
  page: NotionCalendarPage,
): CalendarEvent | undefined {
  if (
    page.object !== "page" ||
    page.archived === true ||
    page.in_trash === true ||
    typeof page.id !== "string"
  ) {
    return;
  }

  const visibilityProperty = getProperty(page, "Visibilidade");
  const visibilityNames = Array.isArray(visibilityProperty?.multi_select)
    ? visibilityProperty.multi_select
        .map((option) => asRecord(option)?.name)
        .filter((name): name is string => typeof name === "string")
    : [];
  if (
    visibilityProperty?.type !== "multi_select" ||
    visibilityNames.length !== 1 ||
    visibilityNames[0] !== "Público"
  ) {
    return;
  }

  const nameProperty = getProperty(page, "Nome");
  const name =
    nameProperty?.type === "title"
      ? readPlainText(nameProperty.title)
      : undefined;
  if (!name) return;

  const confirmationProperty = getProperty(page, "Confirmação");
  const confirmationName = asRecord(confirmationProperty?.select)?.name;
  const confirmation =
    confirmationName === "Confirmado"
      ? "confirmed"
      : confirmationName === "A definir"
        ? "tentative"
        : undefined;
  if (!confirmation) return;

  const periodProperty = getProperty(page, "Período");
  const period = asRecord(periodProperty?.date);
  const startsAt = period?.start;
  const endsAt = period?.end;
  if (
    periodProperty?.type !== "date" ||
    typeof startsAt !== "string" ||
    !isValidDateValue(startsAt) ||
    (endsAt !== null &&
      endsAt !== undefined &&
      (typeof endsAt !== "string" || !isValidDateValue(endsAt)))
  ) {
    return;
  }

  const allDay = isDateOnly(startsAt);
  if (
    (typeof endsAt === "string" && isDateOnly(endsAt) !== allDay) ||
    (typeof endsAt === "string" &&
      isEndBeforeStart(startsAt, endsAt, allDay)) ||
    (confirmation === "tentative" && typeof endsAt !== "string")
  ) {
    return;
  }

  const descriptionProperty = getPropertyIgnoringOuterSpaces(
    page,
    "Descrição",
  );
  const description =
    descriptionProperty?.type === "rich_text"
      ? readPlainText(descriptionProperty.rich_text)
      : undefined;

  const linkProperty = getProperty(page, "Link");
  const rawLink = linkProperty?.type === "url" ? linkProperty.url : undefined;
  if (rawLink !== null && rawLink !== undefined) {
    if (typeof rawLink !== "string" || !isValidHttpsUrl(rawLink)) return;
  }

  return {
    allDay,
    confirmation,
    ...(description ? { description } : {}),
    ...(typeof endsAt === "string" ? { endsAt } : {}),
    id: page.id,
    ...(typeof rawLink === "string"
      ? { link: rawLink as `https://${string}` }
      : {}),
    name,
    startsAt,
  };
}

export function normalizePublicNotionEvents(
  pages: readonly NotionCalendarPage[],
) {
  return pages
    .map(normalizeNotionCalendarPage)
    .filter((event): event is CalendarEvent => event !== undefined)
    .sort(
      (left, right) =>
        left.startsAt.localeCompare(right.startsAt) ||
        left.name.localeCompare(right.name, "pt-BR") ||
        left.id.localeCompare(right.id),
    );
}
