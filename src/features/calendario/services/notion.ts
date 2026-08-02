import type { NotionCalendarPage } from "./normalizar-evento";

const NOTION_API_VERSION = "2026-03-11";
const NOTION_PAGE_SIZE = 100;
const MAX_NOTION_PAGES = 10;
const NOTION_TIMEOUT_MS = 8_000;

type NotionQueryResponse = Readonly<{
  has_more?: unknown;
  next_cursor?: unknown;
  results?: unknown;
}>;

export class CalendarSourceError extends Error {
  constructor() {
    super("calendar_source_unavailable");
    this.name = "CalendarSourceError";
  }
}

function isNotionPage(value: unknown): value is NotionCalendarPage {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export async function queryPublicNotionCalendar({
  apiKey,
  dataSourceId,
  fetcher = fetch,
}: Readonly<{
  apiKey: string;
  dataSourceId: string;
  fetcher?: typeof fetch;
}>): Promise<readonly NotionCalendarPage[]> {
  const pages: NotionCalendarPage[] = [];
  let cursor: string | undefined;

  for (let requestIndex = 0; requestIndex < MAX_NOTION_PAGES; requestIndex++) {
    let response: Response;
    try {
      response = await fetcher(
        `https://api.notion.com/v1/data_sources/${encodeURIComponent(dataSourceId)}/query`,
        {
          body: JSON.stringify({
            filter: {
              checkbox: { equals: true },
              property: "Público",
            },
            page_size: NOTION_PAGE_SIZE,
            result_type: "page",
            sorts: [{ direction: "ascending", property: "Período" }],
            ...(cursor ? { start_cursor: cursor } : {}),
          }),
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "Notion-Version": NOTION_API_VERSION,
          },
          method: "POST",
          next: { revalidate: 300, tags: ["calendar-events"] },
          signal: AbortSignal.timeout(NOTION_TIMEOUT_MS),
        },
      );
    } catch {
      throw new CalendarSourceError();
    }

    if (!response.ok) throw new CalendarSourceError();

    let payload: NotionQueryResponse;
    try {
      payload = (await response.json()) as NotionQueryResponse;
    } catch {
      throw new CalendarSourceError();
    }

    if (!Array.isArray(payload.results)) throw new CalendarSourceError();
    pages.push(...payload.results.filter(isNotionPage));

    if (payload.has_more !== true) return pages;
    if (typeof payload.next_cursor !== "string" || !payload.next_cursor) {
      throw new CalendarSourceError();
    }
    cursor = payload.next_cursor;
  }

  throw new CalendarSourceError();
}
