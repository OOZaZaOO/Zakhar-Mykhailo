import type { Database } from "@/lib/supabase/types";

export type Service = Database["public"]["Tables"]["services"]["Row"];

export type ServiceInsert = Database["public"]["Tables"]["services"]["Insert"];

export type ServiceUpdate = Database["public"]["Tables"]["services"]["Update"];

export type ServiceFormat = Service["format"];

export type ServiceFormValues = {
  currency: string;
  description: string;
  durationMinutes: number | "";
  format: ServiceFormat;
  isActive: boolean;
  priceAmount: number | "";
  sortOrder: number | "";
  title: string;
};
