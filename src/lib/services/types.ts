import type { Database } from "@/lib/supabase/types";

export type Service = Database["public"]["Tables"]["services"]["Row"];

export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];

export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type ServiceFormat = Service["format"];

export type ServiceType = Service["service_type"];

export type ServiceFormValues = {
  allowReschedule: boolean;
  cancellationPolicy: string;
  currency: string;
  description: string;
  durationMinutes: number | "";
  format: ServiceFormat;
  isMonthlySubscription: boolean;
  isActive: boolean;
  packageNotes: string;
  packageValidityWeeks: number | "";
  priceAmount: string;
  serviceType: ServiceType;
  sessionsCount: number | "";
  sessionsPerWeek: number | "";
  sortOrder: number | "";
  title: string;
};
