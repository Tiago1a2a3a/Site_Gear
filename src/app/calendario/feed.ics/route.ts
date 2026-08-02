import { listPublicCalendarEvents } from "@features/calendario/data/eventos";
import { serializeCalendar } from "@features/calendario/services/icalendar";
import { siteConfig } from "@shared/config/site";

export const dynamic = "force-dynamic";

function getSiteUrl() {
  const configuredUrl = process.env.SITE_URL?.trim();
  if (!configuredUrl) return siteConfig.url;

  try {
    return new URL(configuredUrl).origin;
  } catch {
    return siteConfig.url;
  }
}

export async function GET() {
  const result = await listPublicCalendarEvents();

  if (result.status === "unavailable") {
    return new Response("Calendário temporariamente indisponível.", {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  }

  return new Response(
    serializeCalendar([...result.events], {
      siteUrl: getSiteUrl(),
    }),
    {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        "Content-Disposition": 'inline; filename="calendario-gear.ics"',
        "Content-Type": "text/calendar; charset=utf-8",
      },
    },
  );
}
