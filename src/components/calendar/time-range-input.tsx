"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { AvailabilityRange } from "@/lib/availability/types";

type TimeRangeInputProps = {
  canRemove: boolean;
  onChange: (range: AvailabilityRange) => void;
  onRemove: () => void;
  range: AvailabilityRange;
  timeOptions: string[];
};

export function TimeRangeInput({
  canRemove,
  onChange,
  onRemove,
  range,
  timeOptions,
}: TimeRangeInputProps) {
  return (
    <div className="grid gap-3 rounded-2xl border border-[#eee5d9] bg-[#fffaf2] p-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">
      <select
        aria-label="Start time"
        className="h-11 rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-semibold text-[#24312f] outline-none transition focus:border-[#1f5f55]"
        onChange={(event) =>
          onChange({
            ...range,
            startTime: event.target.value,
          })
        }
        value={range.startTime}
      >
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <span className="hidden text-sm font-semibold text-[#8a9894] sm:block">
        —
      </span>
      <select
        aria-label="End time"
        className="h-11 rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-semibold text-[#24312f] outline-none transition focus:border-[#1f5f55]"
        onChange={(event) =>
          onChange({
            ...range,
            endTime: event.target.value,
          })
        }
        value={range.endTime}
      >
        {timeOptions.map((time) => (
          <option key={time} value={time}>
            {time}
          </option>
        ))}
      </select>
      <Button
        aria-label="Remove time range"
        className="h-11 rounded-full border-[#d9ceb9] px-4 text-[#9a4c2f] hover:bg-[#f6ddd4]"
        disabled={!canRemove}
        onClick={onRemove}
        type="button"
        variant="outline"
      >
        <X className="size-4" />
        <span className="sm:hidden">Remove</span>
      </Button>
    </div>
  );
}
