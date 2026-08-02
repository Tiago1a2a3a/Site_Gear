export type CalendarEventConfirmation = "confirmed" | "tentative";

export type CalendarEvent = Readonly<{
  id: string;
  name: string;
  startsAt: string;
  endsAt?: string;
  allDay: boolean;
  confirmation: CalendarEventConfirmation;
  description?: string;
  link?: `https://${string}`;
}>;

export type CalendarEventSegment = Readonly<{
  event: CalendarEvent;
  endColumn: number;
  isEnd: boolean;
  isStart: boolean;
  lane: number;
  startColumn: number;
}>;

export type CalendarWeek = Readonly<{
  days: readonly Date[];
  segments: readonly CalendarEventSegment[];
}>;
