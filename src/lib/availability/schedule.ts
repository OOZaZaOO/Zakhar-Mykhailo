import type {
  AvailabilityBlock,
  AvailabilityDayDefinition,
  AvailabilityRange,
  AvailabilityValidationErrors,
  DayAvailability,
  DayOfWeek,
  WeeklyAvailabilitySchedule,
} from "@/lib/availability/types";
import {
  compareTimes,
  isQuarterHourTime,
  normalizeDatabaseTime,
} from "@/lib/availability/time-options";

export const weekDays: AvailabilityDayDefinition[] = [
  { dayOfWeek: 1, label: "Monday" },
  { dayOfWeek: 2, label: "Tuesday" },
  { dayOfWeek: 3, label: "Wednesday" },
  { dayOfWeek: 4, label: "Thursday" },
  { dayOfWeek: 5, label: "Friday" },
  { dayOfWeek: 6, label: "Saturday" },
  { dayOfWeek: 0, label: "Sunday" },
];

export const weekdayNumbers: DayOfWeek[] = [1, 2, 3, 4, 5];
export const allDayNumbers: DayOfWeek[] = [1, 2, 3, 4, 5, 6, 0];

export function createAvailabilityRange(
  startTime = "09:00",
  endTime = "17:00",
  serviceId: string | null = null,
): AvailabilityRange {
  return {
    endTime,
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    serviceId,
    startTime,
  };
}

export function createEmptyWeeklySchedule(): WeeklyAvailabilitySchedule {
  return allDayNumbers.reduce((schedule, dayOfWeek) => {
    schedule[dayOfWeek] = {
      dayOfWeek,
      enabled: false,
      ranges: [],
    };

    return schedule;
  }, {} as WeeklyAvailabilitySchedule);
}

function sortRanges(ranges: AvailabilityRange[]) {
  return [...ranges].sort((firstRange, secondRange) =>
    compareTimes(firstRange.startTime, secondRange.startTime),
  );
}

export function createScheduleFromAvailabilityBlocks(
  blocks: AvailabilityBlock[],
) {
  const schedule = createEmptyWeeklySchedule();

  blocks
    .filter((block) => block.is_active)
    .forEach((block) => {
      const dayOfWeek = block.day_of_week as DayOfWeek;

      schedule[dayOfWeek] = {
        dayOfWeek,
        enabled: true,
        ranges: sortRanges([
          ...schedule[dayOfWeek].ranges,
          createAvailabilityRange(
            normalizeDatabaseTime(block.start_time),
            normalizeDatabaseTime(block.end_time),
            null,
          ),
        ]),
      };
    });

  return schedule;
}

export function cloneWeeklySchedule(schedule: WeeklyAvailabilitySchedule) {
  return allDayNumbers.reduce((nextSchedule, dayOfWeek) => {
    nextSchedule[dayOfWeek] = {
      dayOfWeek,
      enabled: schedule[dayOfWeek].enabled,
      ranges: schedule[dayOfWeek].ranges.map((range) => ({ ...range })),
    };

    return nextSchedule;
  }, {} as WeeklyAvailabilitySchedule);
}

export function getComparableSchedule(schedule: WeeklyAvailabilitySchedule) {
  return allDayNumbers.map((dayOfWeek) => ({
    dayOfWeek,
    enabled: schedule[dayOfWeek].enabled,
    ranges: schedule[dayOfWeek].enabled
      ? sortRanges(schedule[dayOfWeek].ranges).map((range) => ({
          endTime: range.endTime,
          serviceId: range.serviceId,
          startTime: range.startTime,
        }))
      : [],
  }));
}

export function areWeeklySchedulesEqual(
  firstSchedule: WeeklyAvailabilitySchedule,
  secondSchedule: WeeklyAvailabilitySchedule,
) {
  return (
    JSON.stringify(getComparableSchedule(firstSchedule)) ===
    JSON.stringify(getComparableSchedule(secondSchedule))
  );
}

export function validateWeeklyAvailabilitySchedule(
  schedule: WeeklyAvailabilitySchedule,
) {
  const errors: AvailabilityValidationErrors = {};

  allDayNumbers.forEach((dayOfWeek) => {
    const day = schedule[dayOfWeek];
    const dayErrors: string[] = [];

    if (!day.enabled) {
      return;
    }

    if (day.ranges.length === 0) {
      dayErrors.push("Enabled day must have at least one time range.");
    }

    const sortedRanges = sortRanges(day.ranges);

    sortedRanges.forEach((range, index) => {
      if (
        !isQuarterHourTime(range.startTime) ||
        !isQuarterHourTime(range.endTime)
      ) {
        dayErrors.push("Use 15-minute time increments only.");
      }

      if (compareTimes(range.startTime, range.endTime) >= 0) {
        dayErrors.push("Start time must be before end time.");
      }

      const previousRange = sortedRanges[index - 1];

      if (
        previousRange &&
        compareTimes(previousRange.endTime, range.startTime) > 0
      ) {
        dayErrors.push("Time ranges on the same day cannot overlap.");
      }
    });

    if (dayErrors.length > 0) {
      errors[dayOfWeek] = Array.from(new Set(dayErrors));
    }
  });

  return errors;
}

export function hasAvailabilityValidationErrors(
  errors: AvailabilityValidationErrors,
) {
  return Object.values(errors).some((dayErrors) => dayErrors.length > 0);
}

export function createDayAvailability({
  dayOfWeek,
  enabled,
  ranges,
}: {
  dayOfWeek: DayOfWeek;
  enabled: boolean;
  ranges: AvailabilityRange[];
}): DayAvailability {
  return {
    dayOfWeek,
    enabled,
    ranges: enabled ? sortRanges(ranges) : [],
  };
}
