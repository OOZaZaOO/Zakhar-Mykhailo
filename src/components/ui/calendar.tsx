"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CalendarProps = {
  disabled?: (date: Date) => boolean;
  mode?: "single";
  month?: Date;
  onSelect?: (date: Date | undefined) => void;
  selected?: Date;
};

const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
});

function getMonthStart(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function getMonthDays(month: Date) {
  const monthStart = getMonthStart(month);
  const calendarStart = new Date(monthStart);
  const firstDay = (monthStart.getDay() + 6) % 7;
  calendarStart.setDate(monthStart.getDate() - firstDay);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    return date;
  });
}

function isSameDay(firstDate: Date, secondDate: Date) {
  return firstDate.toDateString() === secondDate.toDateString();
}

function isSameMonth(firstDate: Date, secondDate: Date) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth()
  );
}

export function Calendar({
  disabled,
  month,
  onSelect,
  selected,
}: CalendarProps) {
  const [visibleMonth, setVisibleMonth] = useState(
    getMonthStart(month ?? selected ?? new Date()),
  );

  const monthDays = useMemo(() => getMonthDays(visibleMonth), [visibleMonth]);
  const weekdayLabels = useMemo(() => {
    const monday = new Date(2026, 0, 5);
    return Array.from({ length: 7 }, (_, index) =>
      weekdayFormatter.format(new Date(2026, 0, monday.getDate() + index))
    );
  }, []);

  return (
    <div className="rounded-3xl border border-[#e6ddd1] bg-[#fbf8f2] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button
          className="rounded-full border-[#d9ceb9]"
          onClick={() =>
            setVisibleMonth(
              new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1),
            )
          }
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-sm font-semibold text-[#24312f]">
          {visibleMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <Button
          className="rounded-full border-[#d9ceb9]"
          onClick={() =>
            setVisibleMonth(
              new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1),
            )
          }
          size="icon"
          type="button"
          variant="outline"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center">
        {weekdayLabels.map((weekday) => (
          <div
            className="pb-1 text-xs font-bold uppercase tracking-[0.16em] text-[#7d8a86]"
            key={weekday}
          >
            {weekday}
          </div>
        ))}

        {monthDays.map((date) => {
          const isDisabled = disabled?.(date) ?? false;
          const isSelected = selected ? isSameDay(date, selected) : false;
          const isCurrentMonth = isSameMonth(date, visibleMonth);

          return (
            <button
              className={cn(
                "flex aspect-square items-center justify-center rounded-2xl border text-sm font-semibold transition",
                isSelected
                  ? "border-[#1f5f55] bg-[#eef5f1] text-[#1f5f55]"
                  : isDisabled
                    ? "border-[#eee5d9] bg-white text-[#b8aa96]"
                    : isCurrentMonth
                      ? "border-[#d9ceb9] bg-white text-[#24312f] hover:bg-[#f7f3ec]"
                      : "border-[#eee5d9] bg-[#f6f0e7] text-[#9aa59f] hover:bg-[#f1eadf]",
              )}
              disabled={isDisabled}
              key={date.toISOString()}
              onClick={() => onSelect?.(date)}
              type="button"
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
