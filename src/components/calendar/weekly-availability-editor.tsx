"use client";

import { useMemo, useState } from "react";

import { DayAvailabilityRow } from "@/components/calendar/day-availability-row";
import { BookingStatusToggle } from "@/components/calendar/booking-status-toggle";
import { UnsavedChangesBar } from "@/components/shared/unsaved-changes-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  allDayNumbers,
  areWeeklySchedulesEqual,
  cloneWeeklySchedule,
  createAvailabilityRange,
  createDayAvailability,
  createEmptyWeeklySchedule,
  hasAvailabilityValidationErrors,
  validateWeeklyAvailabilitySchedule,
  weekdayNumbers,
  weekDays,
} from "@/lib/availability/schedule";
import { replaceWeeklyAvailabilityBlocks } from "@/lib/availability/service";
import { getQuarterHourTimeOptions } from "@/lib/availability/time-options";
import type {
  AvailabilityRange,
  AvailabilityValidationErrors,
  DayOfWeek,
  WeeklyAvailabilitySchedule,
} from "@/lib/availability/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const weeklyAvailabilityFormId = "weekly-availability-form";

type WeeklyAvailabilityEditorProps = {
  initialIsAcceptingBookings: boolean;
  initialSchedule: WeeklyAvailabilitySchedule;
  specialistProfileId: string;
  timezone: string;
};

function createPresetSchedule({
  days,
  endTime,
  startTime,
}: {
  days: DayOfWeek[];
  endTime: string;
  startTime: string;
}) {
  const schedule = createEmptyWeeklySchedule();

  days.forEach((dayOfWeek) => {
    schedule[dayOfWeek] = createDayAvailability({
      dayOfWeek,
      enabled: true,
      ranges: [createAvailabilityRange(startTime, endTime)],
    });
  });

  return schedule;
}

export function WeeklyAvailabilityEditor({
  initialIsAcceptingBookings,
  initialSchedule,
  specialistProfileId,
  timezone,
}: WeeklyAvailabilityEditorProps) {
  const [savedSchedule, setSavedSchedule] = useState(initialSchedule);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [validationErrors, setValidationErrors] =
    useState<AvailabilityValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeOptions = useMemo(() => getQuarterHourTimeOptions(), []);
  const hasUnsavedChanges = !areWeeklySchedulesEqual(schedule, savedSchedule);

  function updateDay(
    dayOfWeek: DayOfWeek,
    updater: (day: WeeklyAvailabilitySchedule[DayOfWeek]) => void,
  ) {
    setSchedule((currentSchedule) => {
      const nextSchedule = cloneWeeklySchedule(currentSchedule);
      updater(nextSchedule[dayOfWeek]);
      return nextSchedule;
    });
    setValidationErrors({});
    setError(null);
    setSuccess(null);
  }

  function setSchedulePreset(nextSchedule: WeeklyAvailabilitySchedule) {
    setSchedule(nextSchedule);
    setValidationErrors({});
    setError(null);
    setSuccess(null);
  }

  function handleToggleDay(dayOfWeek: DayOfWeek, enabled: boolean) {
    updateDay(dayOfWeek, (day) => {
      day.enabled = enabled;
      day.ranges = enabled ? [createAvailabilityRange()] : [];
    });
  }

  function handleAddRange(dayOfWeek: DayOfWeek) {
    updateDay(dayOfWeek, (day) => {
      day.ranges.push(createAvailabilityRange());
    });
  }

  function handleRangeChange(dayOfWeek: DayOfWeek, range: AvailabilityRange) {
    updateDay(dayOfWeek, (day) => {
      day.ranges = day.ranges.map((currentRange) =>
        currentRange.id === range.id ? range : currentRange,
      );
    });
  }

  function handleRemoveRange(dayOfWeek: DayOfWeek, rangeId: string) {
    updateDay(dayOfWeek, (day) => {
      day.ranges = day.ranges.filter((range) => range.id !== rangeId);
    });
  }

  function handleCopyDayToDays(dayOfWeek: DayOfWeek, targetDays: DayOfWeek[]) {
    const sourceRanges = schedule[dayOfWeek].ranges.map((range) =>
      createAvailabilityRange(range.startTime, range.endTime),
    );

    if (sourceRanges.length === 0) {
      return;
    }

    setSchedule((currentSchedule) => {
      const nextSchedule = cloneWeeklySchedule(currentSchedule);

      targetDays.forEach((targetDay) => {
        nextSchedule[targetDay] = createDayAvailability({
          dayOfWeek: targetDay,
          enabled: true,
          ranges: sourceRanges.map((range) =>
            createAvailabilityRange(range.startTime, range.endTime),
          ),
        });
      });

      return nextSchedule;
    });
    setValidationErrors({});
    setError(null);
    setSuccess(null);
  }

  function handleCancel() {
    setSchedule(savedSchedule);
    setValidationErrors({});
    setError(null);
    setSuccess(null);
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const nextValidationErrors = validateWeeklyAvailabilitySchedule(schedule);
    setValidationErrors(nextValidationErrors);

    if (hasAvailabilityValidationErrors(nextValidationErrors)) {
      setError("Fix the highlighted availability issues before saving.");
      setSuccess(null);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const supabase = createSupabaseBrowserClient();
    const { error: saveError } = await replaceWeeklyAvailabilityBlocks({
      schedule,
      specialistProfileId,
      supabase,
      timezone,
    });

    if (saveError) {
      setError(saveError.message);
      setIsSaving(false);
      return;
    }

    const nextSavedSchedule = cloneWeeklySchedule(schedule);
    setSavedSchedule(nextSavedSchedule);
    setSchedule(nextSavedSchedule);
    setIsSaving(false);
    setSuccess("Weekly availability saved.");
  }

  return (
    <div>
      <div className="mt-8">
        <BookingStatusToggle
          initialIsAcceptingBookings={initialIsAcceptingBookings}
          profileId={specialistProfileId}
        />
      </div>

      <Card className="mt-6 rounded-3xl border-[#ded5c8] bg-white">
        <CardHeader>
          <CardTitle>Weekly working hours</CardTitle>
          <p className="text-sm leading-6 text-[#66736f]">
            Set recurring hours in 15-minute increments. Booking slots will use
            these hours later.
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              className="h-11 rounded-full border-[#d9ceb9]"
              onClick={() =>
                setSchedulePreset(
                  createPresetSchedule({
                    days: weekdayNumbers,
                    endTime: "17:00",
                    startTime: "09:00",
                  }),
                )
              }
              type="button"
              variant="outline"
            >
              Weekdays 09:00-17:00
            </Button>
            <Button
              className="h-11 rounded-full border-[#d9ceb9]"
              onClick={() =>
                setSchedulePreset(
                  createPresetSchedule({
                    days: allDayNumbers,
                    endTime: "18:00",
                    startTime: "10:00",
                  }),
                )
              }
              type="button"
              variant="outline"
            >
              Every day 10:00-18:00
            </Button>
            <Button
              className="h-11 rounded-full border-[#d9ceb9] text-[#9a4c2f] hover:bg-[#f6ddd4]"
              onClick={() => setSchedulePreset(createEmptyWeeklySchedule())}
              type="button"
              variant="outline"
            >
              Clear all
            </Button>
          </div>
        </CardContent>
      </Card>

      <form
        className="mt-6 space-y-4 pb-24"
        id={weeklyAvailabilityFormId}
        onSubmit={handleSave}
      >
        {weekDays.map((dayDefinition) => {
          const day = schedule[dayDefinition.dayOfWeek];

          return (
            <DayAvailabilityRow
              day={day}
              errors={validationErrors[dayDefinition.dayOfWeek]}
              key={dayDefinition.dayOfWeek}
              label={dayDefinition.label}
              onAddRange={() => handleAddRange(dayDefinition.dayOfWeek)}
              onCopyToAllDays={() =>
                handleCopyDayToDays(dayDefinition.dayOfWeek, allDayNumbers)
              }
              onCopyToWeekdays={() =>
                handleCopyDayToDays(dayDefinition.dayOfWeek, weekdayNumbers)
              }
              onRangeChange={(range) =>
                handleRangeChange(dayDefinition.dayOfWeek, range)
              }
              onRemoveRange={(rangeId) =>
                handleRemoveRange(dayDefinition.dayOfWeek, rangeId)
              }
              onToggle={(enabled) =>
                handleToggleDay(dayDefinition.dayOfWeek, enabled)
              }
              timeOptions={timeOptions}
            />
          );
        })}

        {error ? (
          <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
            {success}
          </p>
        ) : null}
      </form>

      {hasUnsavedChanges ? (
        <UnsavedChangesBar
          formId={weeklyAvailabilityFormId}
          isSaving={isSaving}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  );
}
