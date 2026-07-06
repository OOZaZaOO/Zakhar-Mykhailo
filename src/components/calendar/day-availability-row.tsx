"use client";

import { Plus } from "lucide-react";

import { TimeRangeInput } from "@/components/calendar/time-range-input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type {
  AvailabilityRange,
  DayAvailability,
} from "@/lib/availability/types";

type DayAvailabilityRowProps = {
  day: DayAvailability;
  errors?: string[];
  label: string;
  onAddRange: () => void;
  onCopyToAllDays: () => void;
  onCopyToWeekdays: () => void;
  onRangeChange: (range: AvailabilityRange) => void;
  onRemoveRange: (rangeId: string) => void;
  onToggle: (enabled: boolean) => void;
  timeOptions: string[];
};

export function DayAvailabilityRow({
  day,
  errors = [],
  label,
  onAddRange,
  onCopyToAllDays,
  onCopyToWeekdays,
  onRangeChange,
  onRemoveRange,
  onToggle,
  timeOptions,
}: DayAvailabilityRowProps) {
  return (
    <div className="rounded-3xl border border-[#ded5c8] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Switch
            aria-label={`${day.enabled ? "Disable" : "Enable"} ${label}`}
            checked={day.enabled}
            className="data-[state=checked]:bg-[#1f5f55]"
            onCheckedChange={onToggle}
          />
          <div>
            <h2 className="text-lg font-semibold text-[#24312f]">{label}</h2>
            <p className="text-sm font-medium text-[#66736f]">
              {day.enabled ? "Available for bookings" : "Unavailable"}
            </p>
          </div>
        </div>

        {day.enabled ? (
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-11 rounded-full border-[#d9ceb9] px-4 text-sm"
              onClick={onCopyToWeekdays}
              type="button"
              variant="outline"
            >
              Copy to weekdays
            </Button>
            <Button
              className="h-11 rounded-full border-[#d9ceb9] px-4 text-sm"
              onClick={onCopyToAllDays}
              type="button"
              variant="outline"
            >
              Copy to all days
            </Button>
          </div>
        ) : null}
      </div>

      {day.enabled ? (
        <div className="mt-4 space-y-3">
          {day.ranges.map((range) => (
            <TimeRangeInput
              canRemove={day.ranges.length > 1}
              key={range.id}
              onChange={onRangeChange}
              onRemove={() => onRemoveRange(range.id)}
              range={range}
              timeOptions={timeOptions}
            />
          ))}

          <Button
            className="h-11 rounded-full border-[#d9ceb9] px-4"
            onClick={onAddRange}
            type="button"
            variant="outline"
          >
            <Plus className="size-4" />
            Add time range
          </Button>
        </div>
      ) : (
        <p className="mt-4 rounded-2xl bg-[#f7f3ec] px-4 py-3 text-sm font-semibold text-[#66736f]">
          Unavailable
        </p>
      )}

      {errors.length > 0 ? (
        <div className="mt-4 rounded-2xl bg-[#f6ddd4] px-4 py-3">
          {errors.map((error) => (
            <p
              className="text-sm font-semibold leading-6 text-[#9a4c2f]"
              key={error}
            >
              {error}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
