import { getCountryByTimezone } from "@/lib/timezones";
import type { SpecialistProfile } from "@/lib/profile/types";

export type ProfileCompletionStatus = "complete" | "incomplete";

export type ProfileCompletionField =
  | "firstName"
  | "lastName"
  | "displayName"
  | "profession"
  | "slug"
  | "country"
  | "timezone"
  | "bio"
  | "avatar"
  | "languages";

export type ProfileGatedFeature =
  | "bookingConfiguration"
  | "calendar"
  | "publicProfile"
  | "services";

export type ProfileCompletion = {
  completedFields: ProfileCompletionField[];
  missingFields: ProfileCompletionField[];
  percentage: number;
  status: ProfileCompletionStatus;
  totalFields: number;
};

type ProfileCompletionInput = {
  profile: SpecialistProfile | null;
  userMetadata?: {
    first_name?: unknown;
    last_name?: unknown;
  } | null;
};

const requiredProfileFields: Array<{
  field: ProfileCompletionField;
  isComplete: (input: ProfileCompletionInput) => boolean;
}> = [
  {
    field: "firstName",
    isComplete: ({ userMetadata }) =>
      typeof userMetadata?.first_name === "string" &&
      userMetadata.first_name.trim().length > 0,
  },
  {
    field: "lastName",
    isComplete: ({ userMetadata }) =>
      typeof userMetadata?.last_name === "string" &&
      userMetadata.last_name.trim().length > 0,
  },
  {
    field: "displayName",
    isComplete: ({ profile }) => Boolean(profile?.display_name.trim()),
  },
  {
    field: "profession",
    isComplete: ({ profile }) => Boolean(profile?.profession.trim()),
  },
  {
    field: "slug",
    isComplete: ({ profile }) => Boolean(profile?.slug.trim()),
  },
  {
    field: "country",
    isComplete: ({ profile }) =>
      Boolean(profile?.timezone && getCountryByTimezone(profile.timezone)),
  },
  {
    field: "timezone",
    isComplete: ({ profile }) => Boolean(profile?.timezone.trim()),
  },
  {
    field: "bio",
    isComplete: ({ profile }) => Boolean(profile?.bio.trim()),
  },
  {
    field: "avatar",
    isComplete: ({ profile }) => Boolean(profile?.avatar_url),
  },
  {
    field: "languages",
    isComplete: ({ profile }) => Boolean(profile?.languages.length),
  },
];

export function getProfileCompletion(input: ProfileCompletionInput) {
  const completedFields = requiredProfileFields
    .filter((item) => item.isComplete(input))
    .map((item) => item.field);
  const missingFields = requiredProfileFields
    .filter((item) => !item.isComplete(input))
    .map((item) => item.field);
  const totalFields = requiredProfileFields.length;
  const percentage = Math.round((completedFields.length / totalFields) * 100);

  return {
    completedFields,
    missingFields,
    percentage,
    status: missingFields.length === 0 ? "complete" : "incomplete",
    totalFields,
  } satisfies ProfileCompletion;
}

export function canAccessProfileFeature(
  completion: ProfileCompletion,
  feature: ProfileGatedFeature,
) {
  void feature;

  return completion.status === "complete";
}
