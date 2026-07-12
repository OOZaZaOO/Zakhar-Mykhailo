"use client";

import { Plus } from "lucide-react";

import { TimeRangeInput } from "@/components/calendar/time-range-input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { getDateLabel } from "@/lib/availability/week";
import type { Service } from "@/lib/services/types";
import type {
  AvailabilityRange,
  DateAvailability,
} from "@/lib/availability/types";

type DateAvailabilityRowProps = {
  activeServices: Pick<Service, "id" | "title">[];
  dateAvailability: DateAvailability;
  disabled?: boolean;
  errors?: string[];
  onAddRange: () => void;
  onRangeChange: (range: AvailabilityRange) => void;
  onRemoveRange: (rangeId: string) => void;
  onToggle: (enabled: boolean) => void;
  timeOptions: string[];
};

export function DateAvailabilityRow({
  activeServices,
  dateAvailability,
  disabled = false,
  errors = [],
  onAddRange,
  onRangeChange,
  onRemoveRange,
  onToggle,
  timeOptions,
}: DateAvailabilityRowProps) {
  return (
    <div className="rounded-3xl border border-[#ded5c8] bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Switch
            aria-label={`${dateAvailability.enabled ? "Disable" : "Enable"} ${getDateLabel(dateAvailability.date)}`}
            checked={dateAvailability.enabled}
            className="data-[state=checked]:bg-[#1f5f55]"
            disabled={disabled}
            onCheckedChange={onToggle}
          />
          <div>
            <h2 className="text-lg font-semibold text-[#24312f]">
              {getDateLabel(dateAvailability.date)}
            </h2>
            <p className="text-sm font-medium text-[#66736f]">
              {disabled
                ? "Past date"
                : dateAvailability.enabled
                  ? "Available for bookings"
                  : "Unavailable"}
            </p>
          </div>
        </div>
      </div>

      {dateAvailability.enabled ? (
        <div className="mt-4 space-y-3">
          {dateAvailability.ranges.map((range) => (
            <TimeRangeInput
              activeServices={activeServices}
              canRemove={dateAvailability.ranges.length > 1 && !disabled}
              disabled={disabled}
              key={range.id}
              onChange={onRangeChange}
              onRemove={() => onRemoveRange(range.id)}
              range={range}
              timeOptions={timeOptions}
            />
          ))}

          <Button
            className="h-11 rounded-full border-[#d9ceb9] px-4"
            disabled={disabled}
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
