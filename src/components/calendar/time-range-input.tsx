"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Service } from "@/lib/services/types";
import type { AvailabilityRange } from "@/lib/availability/types";

type TimeRangeInputProps = {
  activeServices: Pick<Service, "id" | "title">[];
  canRemove: boolean;
  disabled?: boolean;
  onChange: (range: AvailabilityRange) => void;
  onRemove: () => void;
  range: AvailabilityRange;
  timeOptions: string[];
};

export function TimeRangeInput({
  activeServices,
  canRemove,
  disabled = false,
  onChange,
  onRemove,
  range,
  timeOptions,
}: TimeRangeInputProps) {
  const hasActiveServices = activeServices.length > 0;
  const availabilityScope =
    range.serviceId === null ? "all-services" : "specific-service";

  return (
    <div className="grid gap-3 rounded-2xl border border-[#eee5d9] bg-[#fffaf2] p-3">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-center">
        <select
          aria-label="Start time"
          className="h-11 rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-semibold text-[#24312f] outline-none transition focus:border-[#1f5f55]"
          disabled={disabled}
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
          disabled={disabled}
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
          disabled={disabled || !canRemove}
          onClick={onRemove}
          type="button"
          variant="outline"
        >
          <X className="size-4" />
          <span className="sm:hidden">Remove</span>
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_220px_220px] sm:items-center">
        <p className="text-sm font-medium text-[#66736f]">Available for</p>
        <select
          aria-label="Availability scope"
          className="h-11 rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-medium text-[#24312f] outline-none transition focus:border-[#1f5f55]"
          disabled={disabled}
          onChange={(event) =>
            onChange({
              ...range,
              serviceId:
                event.target.value === "all-services"
                  ? null
                  : activeServices[0]?.id ?? null,
            })
          }
          value={availabilityScope}
        >
          <option value="all-services">All services</option>
          <option value="specific-service">Specific service</option>
        </select>
        {availabilityScope === "specific-service" ? (
          hasActiveServices ? (
            <select
              aria-label="Specific service"
              className="h-11 rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-medium text-[#24312f] outline-none transition focus:border-[#1f5f55]"
              disabled={disabled}
              onChange={(event) =>
                onChange({
                  ...range,
                  serviceId: event.target.value,
                })
              }
              value={range.serviceId ?? activeServices[0].id}
            >
              {activeServices.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.title}
                </option>
              ))}
            </select>
          ) : (
            <div className="rounded-xl border border-dashed border-[#d9ceb9] bg-[#faf7f1] px-3 py-3 text-sm text-[#66736f]">
              Create an active service first.
            </div>
          )
        ) : (
          <div className="hidden sm:block" />
        )}
      </div>
    </div>
  );
}
