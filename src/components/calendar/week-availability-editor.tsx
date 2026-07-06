"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { BookingStatusToggle } from "@/components/calendar/booking-status-toggle";
import { DateAvailabilityRow } from "@/components/calendar/date-availability-row";
import { UnsavedChangesBar } from "@/components/shared/unsaved-changes-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { createAvailabilityRange } from "@/lib/availability/schedule";
import {
  addWeeks,
  areWeekSchedulesEqual,
  cloneWeekSchedule,
  createEmptyWeekSchedule,
  createWeekScheduleFromAvailabilityExceptions,
  formatDateKey,
  getThisWeekStart,
  getWeekDates,
  getWeekLabel,
  hasWeekAvailabilityValidationErrors,
  isDateInPast,
  isWeekBeyondPlanningWindow,
  validateWeekAvailabilitySchedule,
} from "@/lib/availability/week";
import {
  getAvailableExceptionsForSpecialistWeek,
  replaceWeekAvailabilityExceptions,
} from "@/lib/availability/service";
import { getQuarterHourTimeOptions } from "@/lib/availability/time-options";
import type {
  AvailabilityRange,
  DateAvailabilityValidationErrors,
  WeekAvailabilitySchedule,
} from "@/lib/availability/types";

const weekAvailabilityFormId = "week-availability-form";

type WeekAvailabilityEditorProps = {
  initialIsAcceptingBookings: boolean;
  initialSchedule: WeekAvailabilitySchedule;
  selectedWeekStart: string;
  specialistProfileId: string;
  timezone: string;
};

export function WeekAvailabilityEditor({
  initialIsAcceptingBookings,
  initialSchedule,
  selectedWeekStart,
  specialistProfileId,
  timezone,
}: WeekAvailabilityEditorProps) {
  const weekStart = useMemo(
    () => new Date(`${selectedWeekStart}T00:00:00.000Z`),
    [selectedWeekStart],
  );
  const [savedSchedule, setSavedSchedule] = useState(initialSchedule);
  const [schedule, setSchedule] = useState(initialSchedule);
  const [validationErrors, setValidationErrors] =
    useState<DateAvailabilityValidationErrors>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentWeekStart, setCurrentWeekStart] = useState(() =>
    getThisWeekStart(),
  );
  const timeOptions = useMemo(() => getQuarterHourTimeOptions(), []);
  const hasUnsavedChanges = !areWeekSchedulesEqual(schedule, savedSchedule);
  const isBeyondPlanningWindow = isWeekBeyondPlanningWindow(weekStart);
  const weekDates = getWeekDates(weekStart);
  const previousWeekHref = getWeekHref(addWeeks(weekStart, -1));
  const nextWeekHref = getWeekHref(addWeeks(weekStart, 1));
  const thisWeekHref = getWeekHref(currentWeekStart);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentWeekStart(getThisWeekStart());
    }, 60_000);

    return () => window.clearInterval(intervalId);
  }, []);

  function getWeekHref(nextWeekStart: Date) {
    return `/dashboard/calendar?week=${formatDateKey(nextWeekStart)}`;
  }

  function updateDate(
    date: string,
    updater: (dateAvailability: WeekAvailabilitySchedule[string]) => void,
  ) {
    setSchedule((currentSchedule) => {
      const nextSchedule = cloneWeekSchedule(currentSchedule);
      updater(nextSchedule[date]);
      return nextSchedule;
    });
    setValidationErrors({});
    setError(null);
    setSuccess(null);
  }

  function handleToggleDate(date: string, enabled: boolean) {
    if (isDateInPast(date)) {
      return;
    }

    updateDate(date, (dateAvailability) => {
      dateAvailability.enabled = enabled;
      dateAvailability.ranges = enabled ? [createAvailabilityRange()] : [];
    });
  }

  function handleAddRange(date: string) {
    updateDate(date, (dateAvailability) => {
      dateAvailability.ranges.push(createAvailabilityRange());
    });
  }

  function handleRangeChange(date: string, range: AvailabilityRange) {
    updateDate(date, (dateAvailability) => {
      dateAvailability.ranges = dateAvailability.ranges.map((currentRange) =>
        currentRange.id === range.id ? range : currentRange,
      );
    });
  }

  function handleRemoveRange(date: string, rangeId: string) {
    updateDate(date, (dateAvailability) => {
      dateAvailability.ranges = dateAvailability.ranges.filter(
        (range) => range.id !== rangeId,
      );
    });
  }

  async function loadScheduleForWeek(targetWeekStart: Date) {
    const supabase = createSupabaseBrowserClient();
    const { data, error: loadError } =
      await getAvailableExceptionsForSpecialistWeek({
        specialistProfileId,
        supabase,
        timezone,
        weekStart: targetWeekStart,
      });

    if (loadError) {
      setError(loadError.message);
      return null;
    }

    return createWeekScheduleFromAvailabilityExceptions({
      exceptions: data ?? [],
      timezone,
      weekStart: targetWeekStart,
    });
  }

  async function handleCopyFromPreviousWeek() {
    const previousWeekStart = addWeeks(weekStart, -1);
    const previousSchedule = await loadScheduleForWeek(previousWeekStart);

    if (!previousSchedule) {
      return;
    }

    const nextSchedule = createEmptyWeekSchedule(weekStart);
    const previousDates = getWeekDates(previousWeekStart).map(formatDateKey);
    const currentDates = getWeekDates(weekStart).map(formatDateKey);

    previousDates.forEach((previousDate, index) => {
      const currentDate = currentDates[index];
      nextSchedule[currentDate] = {
        date: currentDate,
        enabled: previousSchedule[previousDate].enabled,
        ranges: previousSchedule[previousDate].ranges.map((range) =>
          createAvailabilityRange(range.startTime, range.endTime),
        ),
      };
    });

    setSchedule(nextSchedule);
    setValidationErrors({});
    setSuccess("Previous week copied. Save changes to keep it.");
  }

  async function saveScheduleForWeek({
    scheduleToSave,
    targetWeekStart,
  }: {
    scheduleToSave: WeekAvailabilitySchedule;
    targetWeekStart: Date;
  }) {
    const supabase = createSupabaseBrowserClient();
    return replaceWeekAvailabilityExceptions({
      schedule: scheduleToSave,
      specialistProfileId,
      supabase,
      timezone,
      weekStart: targetWeekStart,
    });
  }

  async function handleCopyCurrentWeekToFutureWeeks(weeks: number) {
    const nextValidationErrors = validateWeekAvailabilitySchedule(schedule);
    setValidationErrors(nextValidationErrors);

    if (hasWeekAvailabilityValidationErrors(nextValidationErrors)) {
      setError("Fix this week before copying it.");
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    for (let weekOffset = 1; weekOffset <= weeks; weekOffset += 1) {
      const targetWeekStart = addWeeks(weekStart, weekOffset);

      if (isWeekBeyondPlanningWindow(targetWeekStart)) {
        continue;
      }

      const targetSchedule = createEmptyWeekSchedule(targetWeekStart);
      const sourceDates = getWeekDates(weekStart).map(formatDateKey);
      const targetDates = getWeekDates(targetWeekStart).map(formatDateKey);

      sourceDates.forEach((sourceDate, index) => {
        const targetDate = targetDates[index];
        targetSchedule[targetDate] = {
          date: targetDate,
          enabled: schedule[sourceDate].enabled,
          ranges: schedule[sourceDate].ranges.map((range) =>
            createAvailabilityRange(range.startTime, range.endTime),
          ),
        };
      });

      const { error: saveError } = await saveScheduleForWeek({
        scheduleToSave: targetSchedule,
        targetWeekStart,
      });

      if (saveError) {
        setError(saveError.message);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    setSuccess(
      weeks === 1
        ? "This week copied to next week."
        : "This week applied to the next 4 weeks.",
    );
  }

  function handleClearWeek() {
    setSchedule(createEmptyWeekSchedule(weekStart));
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

    if (isSaving || isBeyondPlanningWindow) {
      return;
    }

    const nextValidationErrors = validateWeekAvailabilitySchedule(schedule);
    setValidationErrors(nextValidationErrors);

    if (hasWeekAvailabilityValidationErrors(nextValidationErrors)) {
      setError("Fix the highlighted availability issues before saving.");
      setSuccess(null);
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const { error: saveError } = await saveScheduleForWeek({
      scheduleToSave: schedule,
      targetWeekStart: weekStart,
    });

    if (saveError) {
      setError(saveError.message);
      setIsSaving(false);
      return;
    }

    const nextSavedSchedule = cloneWeekSchedule(schedule);
    setSavedSchedule(nextSavedSchedule);
    setSchedule(nextSavedSchedule);
    setIsSaving(false);
    setSuccess("Week availability saved.");
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
          <CardTitle>Week schedule</CardTitle>
          <p className="text-sm leading-6 text-[#66736f]">
            Configure actual dates in this week. Times are interpreted in{" "}
            {timezone}.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <Button
                asChild
                className="size-11 rounded-full border-[#d9ceb9] p-0"
                variant="outline"
              >
                <Link aria-label="Previous week" href={previousWeekHref} scroll={false}>
                  <ChevronLeft className="size-4" />
                </Link>
              </Button>
              <p className="min-w-0 flex-1 px-2 text-center text-xl font-semibold text-[#24312f] sm:min-w-64">
                {getWeekLabel(weekStart)}
              </p>
              <Button
                asChild
                className="size-11 rounded-full border-[#d9ceb9] p-0"
                variant="outline"
              >
                <Link aria-label="Next week" href={nextWeekHref} scroll={false}>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
            <Button
              asChild
              className="h-11 w-full rounded-full border-[#d9ceb9] lg:w-auto"
              variant="outline"
            >
              <Link href={thisWeekHref} scroll={false}>This week</Link>
            </Button>
          </div>

          {isBeyondPlanningWindow ? (
            <div className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-semibold leading-6 text-[#9a4c2f]">
              Availability can be configured up to 8 weeks ahead for the MVP.
            </div>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                className="h-11 rounded-full border-[#d9ceb9] px-4"
                disabled={isSaving}
                onClick={handleCopyFromPreviousWeek}
                type="button"
                variant="outline"
              >
                Copy previous
              </Button>
              <Button
                className="h-11 rounded-full border-[#d9ceb9] px-4"
                disabled={isSaving}
                onClick={() => handleCopyCurrentWeekToFutureWeeks(1)}
                type="button"
                variant="outline"
              >
                Copy to next
              </Button>
              <Button
                className="h-11 rounded-full border-[#d9ceb9] px-4"
                disabled={isSaving}
                onClick={() => handleCopyCurrentWeekToFutureWeeks(4)}
                type="button"
                variant="outline"
              >
                Apply next 4
              </Button>
              <Button
                className="h-11 rounded-full border-[#d9ceb9] px-4 text-[#9a4c2f] hover:bg-[#f6ddd4]"
                disabled={isSaving}
                onClick={handleClearWeek}
                type="button"
                variant="outline"
              >
                Clear
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {!isBeyondPlanningWindow ? (
        <form
          className="mt-6 space-y-4 pb-24"
          id={weekAvailabilityFormId}
          onSubmit={handleSave}
        >
          {weekDates.map((date) => {
            const dateKey = formatDateKey(date);

            return (
              <DateAvailabilityRow
                dateAvailability={schedule[dateKey]}
                disabled={isDateInPast(dateKey)}
                errors={validationErrors[dateKey]}
                key={dateKey}
                onAddRange={() => handleAddRange(dateKey)}
                onRangeChange={(range) => handleRangeChange(dateKey, range)}
                onRemoveRange={(rangeId) => handleRemoveRange(dateKey, rangeId)}
                onToggle={(enabled) => handleToggleDate(dateKey, enabled)}
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
      ) : null}

      {hasUnsavedChanges && !isBeyondPlanningWindow ? (
        <UnsavedChangesBar
          formId={weekAvailabilityFormId}
          isSaving={isSaving}
          onCancel={handleCancel}
        />
      ) : null}
    </div>
  );
}
