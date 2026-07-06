import type { SupabaseClient } from "@supabase/supabase-js";

import {
  allDayNumbers,
  getComparableSchedule,
} from "@/lib/availability/schedule";
import type { WeeklyAvailabilitySchedule } from "@/lib/availability/types";
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
