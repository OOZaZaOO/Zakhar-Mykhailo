import {
  createAvailabilityRange,
  hasAvailabilityValidationErrors,
} from "@/lib/availability/schedule";
import {
  compareTimes,
  isQuarterHourTime,
} from "@/lib/availability/time-options";
import {
  utcToZonedDateTime,
  zonedDateTimeToUtc,
} from "@/lib/availability/timezone";
import type {
  AvailabilityException,
  DateAvailability,
  DateAvailabilityValidationErrors,
  WeekAvailabilitySchedule,
} from "@/lib/availability/types";

const dayFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
  weekday: "long",
});

const shortDateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

export function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}

export function addWeeks(date: Date, weeks: number) {
  return addDays(date, weeks * 7);
}

export function getWeekStart(date: Date) {
  const nextDate = new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
  const day = nextDate.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  nextDate.setUTCDate(nextDate.getUTCDate() + mondayOffset);
  return nextDate;
}

export function getThisWeekStart() {
  return getWeekStart(new Date());
}

export function getWeekDates(weekStart: Date) {
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
}

export function getWeekLabel(weekStart: Date) {
  const weekEnd = addDays(weekStart, 6);
  const startParts = shortDateFormatter.formatToParts(weekStart);
  const endParts = shortDateFormatter.formatToParts(weekEnd);
  const startMonth = startParts.find((part) => part.type === "month")?.value;
  const startDay = startParts.find((part) => part.type === "day")?.value;
  const endMonth = endParts.find((part) => part.type === "month")?.value;
  const endDay = endParts.find((part) => part.type === "day")?.value;
  const year = weekEnd.getUTCFullYear();

  return startMonth === endMonth
    ? `${startMonth} ${startDay}-${endDay}, ${year}`
    : `${startMonth} ${startDay}-${endMonth} ${endDay}, ${year}`;
}

export function getDateLabel(dateKey: string) {
  return dayFormatter.format(parseDateKey(dateKey));
}

export function getWeekStartFromParam(value?: string) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return getThisWeekStart();
  }

  return getWeekStart(parseDateKey(value));
}

export function isDateInPast(dateKey: string) {
  const today = new Date();
  const todayKey = formatDateKey(
    new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())),
  );

  return dateKey < todayKey;
}

export function isWeekBeyondPlanningWindow(weekStart: Date) {
  return weekStart > addWeeks(getThisWeekStart(), 8);
}

export function createEmptyWeekSchedule(weekStart: Date) {
  return getWeekDates(weekStart).reduce((schedule, date) => {
    const dateKey = formatDateKey(date);

    schedule[dateKey] = {
      date: dateKey,
      enabled: false,
      ranges: [],
    };

    return schedule;
  }, {} as WeekAvailabilitySchedule);
}

function sortDateRanges(date: DateAvailability) {
  return {
    ...date,
    ranges: [...date.ranges].sort((firstRange, secondRange) =>
      compareTimes(firstRange.startTime, secondRange.startTime),
    ),
  };
}

export function createWeekScheduleFromAvailabilityExceptions({
  exceptions,
  timezone,
  weekStart,
}: {
  exceptions: AvailabilityException[];
  timezone: string;
  weekStart: Date;
}) {
  const schedule = createEmptyWeekSchedule(weekStart);

  exceptions
    .filter(
      (exception) =>
        exception.is_active && exception.exception_type === "available",
    )
    .forEach((exception) => {
      const startsAt = utcToZonedDateTime({
        isoString: exception.starts_at,
        timezone,
      });
      const endsAt = utcToZonedDateTime({
        isoString: exception.ends_at,
        timezone,
      });

      if (!schedule[startsAt.date] || startsAt.date !== endsAt.date) {
        return;
      }

      schedule[startsAt.date] = sortDateRanges({
        date: startsAt.date,
        enabled: true,
        ranges: [
          ...schedule[startsAt.date].ranges,
          createAvailabilityRange(
            startsAt.time,
            endsAt.time,
            exception.service_id ?? null,
          ),
        ],
      });
    });

  return schedule;
}

export function cloneWeekSchedule(schedule: WeekAvailabilitySchedule) {
  return Object.fromEntries(
    Object.entries(schedule).map(([date, day]) => [
      date,
      {
        date,
        enabled: day.enabled,
        ranges: day.ranges.map((range) => ({ ...range })),
      },
    ]),
  ) as WeekAvailabilitySchedule;
}

export function getComparableWeekSchedule(schedule: WeekAvailabilitySchedule) {
  return Object.values(schedule)
    .sort((firstDay, secondDay) => firstDay.date.localeCompare(secondDay.date))
    .map((day) => ({
      date: day.date,
      enabled: day.enabled,
      ranges: day.enabled
        ? sortDateRanges(day).ranges.map((range) => ({
          endTime: range.endTime,
          serviceId: range.serviceId,
          startTime: range.startTime,
        }))
        : [],
    }));
}

export function areWeekSchedulesEqual(
  firstSchedule: WeekAvailabilitySchedule,
  secondSchedule: WeekAvailabilitySchedule,
) {
  return (
    JSON.stringify(getComparableWeekSchedule(firstSchedule)) ===
    JSON.stringify(getComparableWeekSchedule(secondSchedule))
  );
}

export function validateWeekAvailabilitySchedule(
  schedule: WeekAvailabilitySchedule,
) {
  const errors: DateAvailabilityValidationErrors = {};

  Object.values(schedule).forEach((dateAvailability) => {
    const dayErrors: string[] = [];

    if (isDateInPast(dateAvailability.date) && dateAvailability.enabled) {
      dayErrors.push("Past dates cannot be configured.");
    }

    if (!dateAvailability.enabled) {
      if (dayErrors.length > 0) {
        errors[dateAvailability.date] = dayErrors;
      }
      return;
    }

    if (dateAvailability.ranges.length === 0) {
      dayErrors.push("Enabled date must have at least one time range.");
    }

    const sortedRanges = sortDateRanges(dateAvailability).ranges;

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

      if (range.serviceId === undefined) {
        dayErrors.push("Choose all services or select one specific service.");
      }

      const previousRange = sortedRanges[index - 1];

      if (
        previousRange &&
        compareTimes(previousRange.endTime, range.startTime) > 0
      ) {
        dayErrors.push("Time ranges on the same date cannot overlap.");
      }
    });

    if (dayErrors.length > 0) {
      errors[dateAvailability.date] = Array.from(new Set(dayErrors));
    }
  });

  return errors;
}

export function hasWeekAvailabilityValidationErrors(
  errors: DateAvailabilityValidationErrors,
) {
  return hasAvailabilityValidationErrors(errors);
}

export function getWeekUtcRange(weekStart: Date, timezone: string) {
  const weekStartDate = formatDateKey(weekStart);
  const weekEndDate = formatDateKey(addDays(weekStart, 7));

  return {
    weekEndUtc: zonedDateTimeToUtc({
      date: weekEndDate,
      time: "00:00",
      timezone,
    }),
    weekStartUtc: zonedDateTimeToUtc({
      date: weekStartDate,
      time: "00:00",
      timezone,
    }),
  };
}

export function createAvailabilityExceptionPayload({
  schedule,
  specialistProfileId,
  timezone,
}: {
  schedule: WeekAvailabilitySchedule;
  specialistProfileId: string;
  timezone: string;
}) {
  return getComparableWeekSchedule(schedule)
    .filter((day) => day.enabled)
    .flatMap((day) =>
      day.ranges.map((range) => ({
        ends_at: zonedDateTimeToUtc({
          date: day.date,
          time: range.endTime,
          timezone,
        }).toISOString(),
        exception_type: "available" as const,
        is_active: true,
        service_id: range.serviceId,
        specialist_profile_id: specialistProfileId,
        starts_at: zonedDateTimeToUtc({
          date: day.date,
          time: range.startTime,
          timezone,
        }).toISOString(),
      })),
    );
}
