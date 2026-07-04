import type { Database, Json } from "@/lib/supabase/types";

export type SpecialistProfile =
  Database["public"]["Tables"]["specialist_profiles"]["Row"];

export type SpecialistProfileInsert =
  Database["public"]["Tables"]["specialist_profiles"]["Insert"];

export type SpecialistProfileUpdate =
  Database["public"]["Tables"]["specialist_profiles"]["Update"];

export type SpecialistProfileVisibility = SpecialistProfile["visibility"];

export type SpecialistProfileFormValues = {
  avatarUrl: string;
  bio: string;
  contactLinks: Json;
  displayName: string;
  languages: string[];
  profession: string;
  slug: string;
  timezone: string;
  userId: string;
  workingRules: string;
};
