import type { Database } from "@/lib/supabase/types";

export type AvailabilityBlock =
  Database["public"]["Tables"]["availability_blocks"]["Row"];
export type AvailabilityException =
  Database["public"]["Tables"]["availability_exceptions"]["Row"];

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export type AvailabilityRange = {
  endTime: string;
  id: string;
  serviceId: string | null;
  startTime: string;
};

export type DayAvailability = {
  dayOfWeek: DayOfWeek;
  enabled: boolean;
  ranges: AvailabilityRange[];
};

export type WeeklyAvailabilitySchedule = Record<DayOfWeek, DayAvailability>;

export type AvailabilityValidationErrors = Partial<Record<DayOfWeek, string[]>>;

export type AvailabilityDayDefinition = {
  dayOfWeek: DayOfWeek;
  label: string;
};

export type DateAvailability = {
  date: string;
  enabled: boolean;
  ranges: AvailabilityRange[];
};

export type WeekAvailabilitySchedule = Record<string, DateAvailability>;

export type DateAvailabilityValidationErrors = Partial<Record<string, string[]>>;
