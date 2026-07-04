import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  SpecialistProfile,
  SpecialistProfileFormValues,
} from "@/lib/profile/types";
import type { Database } from "@/lib/supabase/types";

type ProfileClient = SupabaseClient<Database>;

export const profileSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function normalizeProfileSlug(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateProfileSlug(value: string) {
  return normalizeProfileSlug(value);
}

export function validateSpecialistProfileForm(
  values: Pick<
    SpecialistProfileFormValues,
    "displayName" | "profession" | "slug"
  >,
) {
  const slug = normalizeProfileSlug(values.slug);

  if (!values.displayName.trim()) {
    return "Display name is required.";
  }

  if (!slug) {
    return "Slug is required.";
  }

  if (!profileSlugPattern.test(slug)) {
    return "Slug must be lowercase URL-safe text, for example john-smith.";
  }

  if (!values.profession.trim()) {
    return "Profession is required.";
  }

  return null;
}

export async function getOwnSpecialistProfile(
  supabase: ProfileClient,
  userId: string,
) {
  return supabase
    .from("specialist_profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
}

export async function getSpecialistProfileBySlug(
  supabase: ProfileClient,
  slug: string,
) {
  return supabase
    .from("specialist_profiles")
    .select("*")
    .eq("slug", normalizeProfileSlug(slug))
    .maybeSingle();
}

export async function getPublicSpecialistProfileBySlug(
  supabase: ProfileClient,
  slug: string,
) {
  return supabase
    .from("specialist_profiles")
    .select("*")
    .eq("slug", normalizeProfileSlug(slug))
    .eq("visibility", "public")
    .maybeSingle();
}

export async function isSpecialistProfileSlugTaken(
  supabase: ProfileClient,
  slug: string,
  currentProfileId?: string,
) {
  const { data, error } = await supabase
    .from("specialist_profiles")
    .select("id")
    .eq("slug", normalizeProfileSlug(slug))
    .maybeSingle();

  if (error) {
    return { error, isTaken: false };
  }

  return {
    error: null,
    isTaken: Boolean(data && data.id !== currentProfileId),
  };
}

export async function saveSpecialistProfile(
  supabase: ProfileClient,
  values: SpecialistProfileFormValues,
  existingProfile: SpecialistProfile | null,
) {
  const payload = {
    avatar_url: values.avatarUrl.trim() || null,
    bio: values.bio.trim(),
    contact_links: values.contactLinks,
    display_name: values.displayName.trim(),
    languages: values.languages,
    profession: values.profession.trim(),
    slug: normalizeProfileSlug(values.slug),
    timezone: values.timezone.trim() || "UTC",
    user_id: values.userId,
    working_rules: values.workingRules.trim(),
  };

  if (existingProfile) {
    return supabase
      .from("specialist_profiles")
      .update(payload)
      .eq("id", existingProfile.id)
      .select()
      .single();
  }

  return supabase
    .from("specialist_profiles")
    .insert({
      ...payload,
      visibility: "public",
    })
    .select()
    .single();
}

export async function updateSpecialistBookingStatus(
  supabase: ProfileClient,
  profileId: string,
  isAcceptingBookings: boolean,
) {
  return supabase
    .from("specialist_profiles")
    .update({
      is_accepting_bookings: isAcceptingBookings,
    })
    .eq("id", profileId)
    .select("id,is_accepting_bookings")
    .single();
}
