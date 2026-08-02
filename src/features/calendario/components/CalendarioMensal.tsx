import type { CSSProperties } from "react";

import { buildCalendarMonth, formatEventPeriod } from "../services/calendario";
import type { CalendarEvent } from "../types";

const weekdays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];

type CalendarioMensalProps = Readonly<{
  events: readonly CalendarEvent[];
  month: number;
  onSelectEvent: (event: CalendarEvent) => void;
  year: number;
}>;

export function CalendarioMensal({
  events,
  month,
  onSelectEvent,
  year,
}: CalendarioMensalProps) {
  const weeks = buildCalendarMonth(year, month, events);

  return (
    <div className="calendar-month" data-testid="calendar-month-grid">
      <div aria-hidden="true" className="calendar-weekdays">
        {weekdays.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      {weeks.map((week) => (
        <div className="calendar-week" key={week.days[0].toISOString()}>
          <div className="calendar-week__days">
            {week.days.map((day) => {
              const isOutsideMonth = day.getMonth() !== month;
              return (
                <div
                  className="calendar-day"
                  data-outside-month={isOutsideMonth || undefined}
                  key={day.toISOString()}
                >
                  <time dateTime={day.toISOString().slice(0, 10)}>
                    {day.getDate()}
                  </time>
                </div>
              );
            })}
          </div>

          <div className="calendar-week__events">
            {week.segments.map((segment) => {
              const classes = [
                "calendar-event",
                `calendar-event--${segment.event.confirmation}`,
                !segment.isStart && "calendar-event--continues-before",
                !segment.isEnd && "calendar-event--continues-after",
              ]
                .filter(Boolean)
                .join(" ");
              const style = {
                gridColumn: `${segment.startColumn} / ${segment.endColumn + 1}`,
                gridRow: segment.lane + 1,
              } satisfies CSSProperties;

              return (
                <button
                  aria-label={`${segment.event.name}. ${formatEventPeriod(segment.event)}`}
                  className={classes}
                  key={`${segment.event.id}-${week.days[0].toISOString()}`}
                  onClick={() => onSelectEvent(segment.event)}
                  style={style}
                  type="button"
                >
                  <span>{segment.event.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
