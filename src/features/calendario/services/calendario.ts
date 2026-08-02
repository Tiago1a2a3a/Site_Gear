import type {
  CalendarEvent,
  CalendarEventSegment,
  CalendarWeek,
} from "../types";

const monthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "long",
  year: "numeric",
});

const fullDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortMonthFormatter = new Intl.DateTimeFormat("pt-BR", {
  month: "short",
});

export function getDateKey(value: string) {
  return value.slice(0, 10);
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day, 12);
}

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function differenceInDays(start: Date, end: Date) {
  const millisecondsPerDay = 86_400_000;
  return Math.round((end.getTime() - start.getTime()) / millisecondsPerDay);
}

function getEventEndKey(event: CalendarEvent) {
  return getDateKey(event.endsAt ?? event.startsAt);
}

function assignLanes(segments: readonly Omit<CalendarEventSegment, "lane">[]) {
  const laneEnds: number[] = [];

  return segments.map((segment) => {
    const availableLane = laneEnds.findIndex(
      (endColumn) => segment.startColumn > endColumn,
    );
    const lane = availableLane === -1 ? laneEnds.length : availableLane;
    laneEnds[lane] = segment.endColumn;
    return { ...segment, lane };
  });
}

export function buildCalendarMonth(
  year: number,
  month: number,
  events: readonly CalendarEvent[],
): readonly CalendarWeek[] {
  const firstDay = new Date(year, month, 1, 12);
  const lastDay = new Date(year, month + 1, 0, 12);
  const firstDayOffset = (firstDay.getDay() + 6) % 7;
  const lastDayOffset = 6 - ((lastDay.getDay() + 6) % 7);
  const gridStart = addDays(firstDay, -firstDayOffset);
  const gridEnd = addDays(lastDay, lastDayOffset);
  const weekCount = Math.ceil((differenceInDays(gridStart, gridEnd) + 1) / 7);

  return Array.from({ length: weekCount }, (_, weekIndex) => {
    const weekStart = addDays(gridStart, weekIndex * 7);
    const weekEnd = addDays(weekStart, 6);
    const weekStartKey = toDateKey(weekStart);
    const weekEndKey = toDateKey(weekEnd);
    const days = Array.from({ length: 7 }, (__, dayIndex) =>
      addDays(weekStart, dayIndex),
    );
    const rawSegments = events
      .filter((event) => {
        const startKey = getDateKey(event.startsAt);
        const endKey = getEventEndKey(event);
        return startKey <= weekEndKey && endKey >= weekStartKey;
      })
      .map((event) => {
        const eventStart = parseDateKey(getDateKey(event.startsAt));
        const eventEnd = parseDateKey(getEventEndKey(event));
        const clippedStart = eventStart < weekStart ? weekStart : eventStart;
        const clippedEnd = eventEnd > weekEnd ? weekEnd : eventEnd;
        return {
          endColumn: differenceInDays(weekStart, clippedEnd) + 1,
          event,
          isEnd: eventEnd <= weekEnd,
          isStart: eventStart >= weekStart,
          startColumn: differenceInDays(weekStart, clippedStart) + 1,
        };
      })
      .sort(
        (left, right) =>
          left.startColumn - right.startColumn ||
          right.endColumn - left.endColumn ||
          left.event.name.localeCompare(right.event.name, "pt-BR"),
      );

    return { days, segments: assignLanes(rawSegments) };
  });
}

export function formatMonthLabel(year: number, month: number) {
  const label = monthFormatter.format(new Date(year, month, 1, 12));
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatTime(value: string) {
  const match = value.match(/T(\d{2}):(\d{2})/);
  if (!match) return undefined;
  const [, hour, minute] = match;
  return minute === "00" ? `${Number(hour)}h` : `${Number(hour)}h${minute}`;
}

export function formatEventPeriod(event: CalendarEvent) {
  const start = parseDateKey(getDateKey(event.startsAt));
  const end = parseDateKey(getEventEndKey(event));
  const sameDay = getDateKey(event.startsAt) === getEventEndKey(event);
  const startLabel = fullDateFormatter.format(start);

  if (event.confirmation === "tentative") {
    return `Entre ${startLabel} e ${fullDateFormatter.format(end)}. A data exata ainda será confirmada.`;
  }

  if (!sameDay) {
    return `De ${startLabel} a ${fullDateFormatter.format(end)}`;
  }

  const startTime = formatTime(event.startsAt);
  const endTime = event.endsAt ? formatTime(event.endsAt) : undefined;
  if (startTime && endTime)
    return `${startLabel}, das ${startTime} às ${endTime}`;
  if (startTime) return `${startLabel}, às ${startTime}`;
  return startLabel;
}

export function formatMobileEventDate(event: CalendarEvent) {
  const start = parseDateKey(getDateKey(event.startsAt));
  const end = parseDateKey(getEventEndKey(event));
  const startMonth = shortMonthFormatter
    .format(start)
    .replace(".", "")
    .toUpperCase();
  const endMonth = shortMonthFormatter
    .format(end)
    .replace(".", "")
    .toUpperCase();

  if (getDateKey(event.startsAt) === getEventEndKey(event)) {
    return {
      primary: String(start.getDate()).padStart(2, "0"),
      secondary: startMonth,
    };
  }

  if (start.getMonth() === end.getMonth()) {
    return {
      primary: `${String(start.getDate()).padStart(2, "0")}–${String(end.getDate()).padStart(2, "0")}`,
      secondary: startMonth,
    };
  }

  return {
    primary: `${String(start.getDate()).padStart(2, "0")} ${startMonth}`,
    secondary: `a ${String(end.getDate()).padStart(2, "0")} ${endMonth}`,
  };
}

export function listUpcomingEvents(
  events: readonly CalendarEvent[],
  referenceDate = new Date(),
) {
  const todayKey = toDateKey(referenceDate);
  return [...events]
    .filter((event) => getEventEndKey(event) >= todayKey)
    .sort(
      (left, right) =>
        getDateKey(left.startsAt).localeCompare(getDateKey(right.startsAt)) ||
        left.name.localeCompare(right.name, "pt-BR"),
    );
}

export function getEventTime(event: CalendarEvent) {
  return formatTime(event.startsAt);
}
