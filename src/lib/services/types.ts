import type { Database } from "@/lib/supabase/types";

export type Service = Database["public"]["Tables"]["services"]["Row"];

export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];

export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type ServiceFormat = Service["format"];

export type ServiceType = Service["service_type"];

export type ServiceFormValues = {
  allowReschedule: boolean;
  allowClientCancellation: boolean;
  allowClientRescheduling: boolean;
  cancellationPolicy: string;
  latestCancellationMinutes: string;
  latestRescheduleMinutes: string;
  currency: string;
  description: string;
  durationMinutes: number | "";
  format: ServiceFormat;
  isMonthlySubscription: boolean;
  isActive: boolean;
  limitActiveBookingsPerClient: boolean;
  limitOneBookingPerClient: boolean;
  maxActiveBookingsPerClient: number | "";
  maxSessionsPerWeek: number | "";
  minimumNoticeMinutes: string;
  packageNotes: string;
  priceAmount: string;
  releaseSlotOnCancellation: boolean;
  requireSpecialistApproval: boolean;
  requireSpecialistApprovalForReschedule: boolean;
  serviceType: ServiceType;
  sessionsCount: number | "";
  sortOrder: number | "";
  title: string;
};

export type ServiceFormFieldName =
  | "currency"
  | "durationMinutes"
  | "maxSessionsPerWeek"
  | "priceAmount"
  | "sessionsCount"
  | "title";

export type ServiceFormErrors = Partial<Record<ServiceFormFieldName, string>>;
