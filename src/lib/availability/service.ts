import type { SupabaseClient } from "@supabase/supabase-js";

import {
  allDayNumbers,
  getComparableSchedule,
} from "@/lib/availability/schedule";
import type {
  WeekAvailabilitySchedule,
  WeeklyAvailabilitySchedule,
} from "@/lib/availability/types";
import {
  addWeeks,
  createAvailabilityExceptionPayload,
  getThisWeekStart,
  getWeekUtcRange,
} from "@/lib/availability/week";
import { zonedDateTimeToUtc } from "@/lib/availability/timezone";
import type { Database } from "@/lib/supabase/types";

type AvailabilityClient = SupabaseClient<Database>;

export async function getAvailabilityBlocksForSpecialistProfile(
  supabase: AvailabilityClient,
  specialistProfileId: string,
) {
  return supabase
    .from("availability_blocks")
    .select("*")
    .eq("specialist_profile_id", specialistProfileId)
    .order("day_of_week", { ascending: true })
    .order("start_time", { ascending: true });
}

export async function replaceWeeklyAvailabilityBlocks({
  schedule,
  specialistProfileId,
  supabase,
  timezone,
}: {
  schedule: WeeklyAvailabilitySchedule;
  specialistProfileId: string;
  supabase: AvailabilityClient;
  timezone: string;
}) {
  // TODO: When bookings exist, availability updates may need versioning or audit handling.
  const { error: deleteError } = await supabase
    .from("availability_blocks")
    .delete()
    .eq("specialist_profile_id", specialistProfileId);

  if (deleteError) {
    return {
      data: null,
      error: deleteError,
    };
  }

  const payload = getComparableSchedule(schedule)
    .filter((day) => day.enabled)
    .flatMap((day) =>
      day.ranges.map((range) => ({
        day_of_week: day.dayOfWeek,
        end_time: range.endTime,
        is_active: true,
        specialist_profile_id: specialistProfileId,
        start_time: range.startTime,
        timezone,
      })),
    );

  if (payload.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("availability_blocks")
    .insert(payload)
    .select();

  return {
    data,
    error,
  };
}

export function getEmptyAvailabilityCount(schedule: WeeklyAvailabilitySchedule) {
  return allDayNumbers.filter((dayOfWeek) => schedule[dayOfWeek].enabled)
    .length;
}

export async function getAvailableExceptionsForSpecialistWeek({
  specialistProfileId,
  supabase,
  timezone,
  weekStart,
}: {
  specialistProfileId: string;
  supabase: AvailabilityClient;
  timezone: string;
  weekStart: Date;
}) {
  const { weekEndUtc, weekStartUtc } = getWeekUtcRange(weekStart, timezone);

  return supabase
    .from("availability_exceptions")
    .select("*")
    .eq("specialist_profile_id", specialistProfileId)
    .eq("exception_type", "available")
    .eq("is_active", true)
    .lt("starts_at", weekEndUtc.toISOString())
    .gt("ends_at", weekStartUtc.toISOString())
    .order("starts_at", { ascending: true });
}

export async function getBookingAvailabilityExceptionsForSpecialistProfile({
  specialistProfileId,
  supabase,
  timezone,
}: {
  specialistProfileId: string;
  supabase: AvailabilityClient;
  timezone: string;
}) {
  const weekStart = getThisWeekStart();
  const bookingWindowEnd = addWeeks(weekStart, 8);
  const bookingWindowStartUtc = zonedDateTimeToUtc({
    date: weekStart.toISOString().slice(0, 10),
    time: "00:00",
    timezone,
  });
  const bookingWindowEndUtc = zonedDateTimeToUtc({
    date: bookingWindowEnd.toISOString().slice(0, 10),
    time: "00:00",
    timezone,
  });

  return supabase
    .from("availability_exceptions")
    .select("*")
    .eq("specialist_profile_id", specialistProfileId)
    .eq("is_active", true)
    .gte("ends_at", bookingWindowStartUtc.toISOString())
    .lt("starts_at", bookingWindowEndUtc.toISOString())
    .order("starts_at", { ascending: true });
}

export async function replaceWeekAvailabilityExceptions({
  schedule,
  specialistProfileId,
  supabase,
  timezone,
  weekStart,
}: {
  schedule: WeekAvailabilitySchedule;
  specialistProfileId: string;
  supabase: AvailabilityClient;
  timezone: string;
  weekStart: Date;
}) {
  const { weekEndUtc, weekStartUtc } = getWeekUtcRange(weekStart, timezone);

  // TODO: When bookings exist, changing availability must respect already booked sessions.
  const { error: deleteError } = await supabase
    .from("availability_exceptions")
    .delete()
    .eq("specialist_profile_id", specialistProfileId)
    .eq("exception_type", "available")
    .lt("starts_at", weekEndUtc.toISOString())
    .gt("ends_at", weekStartUtc.toISOString());

  if (deleteError) {
    return {
      data: null,
      error: deleteError,
    };
  }

  const payload = createAvailabilityExceptionPayload({
    schedule,
    specialistProfileId,
    timezone,
  });

  if (payload.length === 0) {
    return {
      data: [],
      error: null,
    };
  }

  const { data, error } = await supabase
    .from("availability_exceptions")
    .insert(payload)
    .select();

  return {
    data,
    error,
  };
}
