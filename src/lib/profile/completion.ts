import { getCountryByTimezone } from "@/lib/timezones";
import type { SpecialistProfile } from "@/lib/profile/types";

export type ProfileCompletionField =
  | "displayName"
  | "slug"
  | "country"
  | "timezone";

export type ProfileGatedFeature =
  | "bookingConfiguration"
  | "calendar"
  | "publicProfile"
  | "services";

export type ProfileCompletion = {
  completedFields: ProfileCompletionField[];
  isComplete: boolean;
  missingFields: ProfileCompletionField[];
  percentage: number;
  totalFields: number;
};

const requiredProfileFields: Array<{
  field: ProfileCompletionField;
  label: string;
  isComplete: (profile: SpecialistProfile | null) => boolean;
}> = [
  {
    field: "displayName",
    label: "Visible name",
    isComplete: (profile) => Boolean(profile?.display_name.trim()),
  },
  {
    field: "slug",
    label: "Public slug",
    isComplete: (profile) => Boolean(profile?.slug.trim()),
  },
  {
    field: "country",
    label: "Country",
    isComplete: (profile) =>
      Boolean(profile?.timezone && getCountryByTimezone(profile.timezone)),
  },
  {
    field: "timezone",
    label: "Timezone",
    isComplete: (profile) => Boolean(profile?.timezone.trim()),
  },
];

export function getProfileCompletion(profile: SpecialistProfile | null) {
  const completedFields = requiredProfileFields
    .filter((item) => item.isComplete(profile))
    .map((item) => item.field);
  const missingFields = requiredProfileFields
    .filter((item) => !item.isComplete(profile))
    .map((item) => item.field);
  const totalFields = requiredProfileFields.length;
  const percentage = Math.round((completedFields.length / totalFields) * 100);

  return {
    completedFields,
    isComplete: missingFields.length === 0,
    missingFields,
    percentage,
    totalFields,
  } satisfies ProfileCompletion;
}

export function getProfileCompletionFieldLabel(field: ProfileCompletionField) {
  return (
    requiredProfileFields.find((item) => item.field === field)?.label ?? field
  );
}

export function canAccessProfileFeature(
  completion: ProfileCompletion,
  feature: ProfileGatedFeature,
) {
  void feature;

  return completion.isComplete;
}
