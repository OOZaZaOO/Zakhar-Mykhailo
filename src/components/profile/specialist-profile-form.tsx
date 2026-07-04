"use client";

import { Upload, X } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileSlugAvailability } from "@/hooks/use-profile-slug-availability";
import { useSpecialistProfile } from "@/hooks/use-specialist-profile";
import {
  generateProfileSlugFromIdentity,
  normalizeProfileSlug,
} from "@/lib/profile/service";
import type { SpecialistProfile } from "@/lib/profile/types";
import type { Json } from "@/lib/supabase/types";
import {
  countryTimezones,
  getCountryByTimezone,
  getTimezonesByCountry,
  isValidIanaTimezone,
} from "@/lib/timezones";

type SpecialistProfileFormProps = {
  initialError: string | null;
  initialProfile: SpecialistProfile | null;
  userEmail: string | null;
  userFirstName: string;
  userFullName: string;
  userId: string;
  userLastName: string;
};

function parseLanguages(value: string) {
  return value
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean);
}

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function SpecialistProfileForm({
  initialError,
  initialProfile,
  userEmail,
  userFirstName,
  userFullName,
  userId,
  userLastName,
}: SpecialistProfileFormProps) {
  const { error, isSaving, profile, saveProfile, success } =
    useSpecialistProfile({
      initialError,
      initialProfile,
    });
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name ?? userFirstName,
  );
  const [slug, setSlug] = useState(
    initialProfile?.slug ??
      generateProfileSlugFromIdentity({
        email: userEmail,
        firstName: userFirstName,
        lastName: userLastName,
      }),
  );
  const [hasUserEditedSlug, setHasUserEditedSlug] = useState(false);
  const [profession, setProfession] = useState(
    initialProfile?.profession ?? "",
  );
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [country, setCountry] = useState(
    initialProfile?.timezone
      ? getCountryByTimezone(initialProfile.timezone)
      : "",
  );
  const [timezone, setTimezone] = useState(initialProfile?.timezone ?? "");
  const [timezoneError, setTimezoneError] = useState<string | null>(null);
  const [languages, setLanguages] = useState(
    initialProfile?.languages.join(", ") ?? "",
  );
  const [workingRules, setWorkingRules] = useState(
    initialProfile?.working_rules ?? "",
  );
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState(
    initialProfile?.avatar_url ?? "",
  );

  const mode = profile ? "edit" : "create";
  const publicUrlBase = (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ""
  ).replace(/\/+$/, "");
  const previewUrl = useMemo(
    () => `${publicUrlBase}/profile/${slug || "your-slug"}`,
    [publicUrlBase, slug],
  );
  const { message: slugAvailabilityMessage, status: slugAvailabilityStatus } =
    useProfileSlugAvailability({
      currentProfileId: profile?.id,
      enabled: hasUserEditedSlug,
      slug,
    });
  const isSlugUnavailable =
    !slug ||
    (hasUserEditedSlug &&
      (slugAvailabilityStatus === "taken" ||
        slugAvailabilityStatus === "invalid" ||
        slugAvailabilityStatus === "checking"));
  const countryTimezonesForSelection = getTimezonesByCountry(country);
  const shouldShowTimezoneSelector = countryTimezonesForSelection.length > 1;

  function handleSlugChange(value: string) {
    setHasUserEditedSlug(true);
    setSlug(normalizeProfileSlug(value));
  }

  function handleCountryChange(value: string) {
    const nextTimezones = getTimezonesByCountry(value);

    setCountry(value);
    setTimezoneError(null);
    setTimezone(nextTimezones.length === 1 ? nextTimezones[0] : "");
  }

  function handleTimezoneChange(value: string) {
    setTimezone(value);
    setTimezoneError(null);
  }

  function handleAvatarPreviewChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreviewUrl(previewUrl);
    setAvatarUrl("");
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setTimezoneError(null);

    if (!timezone) {
      setTimezoneError("Select a timezone before saving your profile.");
      return;
    }

    if (!isValidIanaTimezone(timezone)) {
      setTimezoneError("Select a valid IANA timezone before saving.");
      return;
    }

    const savedProfile = await saveProfile({
      avatarUrl,
      bio,
      contactLinks: (initialProfile?.contact_links ?? {}) as Json,
      displayName,
      languages: parseLanguages(languages),
      profession,
      slug,
      timezone,
      userId,
      workingRules,
    });

    if (savedProfile) {
      setAvatarUrl(savedProfile.avatar_url ?? "");
      setAvatarPreviewUrl(savedProfile.avatar_url ?? "");
      setSlug(savedProfile.slug);
      setHasUserEditedSlug(false);
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Specialist profile
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            {mode === "create" ? "Create your profile" : "Edit your profile"}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            {mode === "create"
              ? "Set up the public profile clients will use before booking sessions."
              : "Keep your public profile, booking status, and client-facing rules up to date."}
          </p>
        </div>
        <Badge className="w-fit rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
          {mode === "create" ? "Onboarding" : "Loaded from Supabase"}
        </Badge>
      </div>

      <form className="mt-8 space-y-6" onSubmit={handleSave}>
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Profile basics</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              These fields are stored in `specialist_profiles` and protected by
              Supabase RLS.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label>Avatar</Label>
              <div className="mt-2 flex flex-col gap-4 rounded-2xl bg-[#f7f3ec] p-4 sm:flex-row sm:items-center">
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1f5f55] text-2xl font-bold text-white">
                  {avatarPreviewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      alt=""
                      className="size-full object-cover"
                      src={avatarPreviewUrl}
                    />
                  ) : (
                    getInitials(displayName || userFirstName || "Profile")
                  )}
                </div>
                <div className="space-y-3">
                  <p className="text-sm leading-6 text-[#5a6865]">
                    Add a clear profile photo. Real upload will be connected
                    later; for now this preview is local only.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      asChild
                      className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
                      type="button"
                    >
                      <label>
                        <Upload className="mr-2 size-4" />
                        {avatarPreviewUrl ? "Change photo" : "Upload photo"}
                        <input
                          accept="image/*"
                          className="sr-only"
                          onChange={handleAvatarPreviewChange}
                          type="file"
                        />
                      </label>
                    </Button>
                    {avatarPreviewUrl ? (
                      <Button
                        className="rounded-full"
                        onClick={() => {
                          setAvatarPreviewUrl("");
                          setAvatarUrl("");
                        }}
                        type="button"
                        variant="outline"
                      >
                        <X className="mr-2 size-4" />
                        Remove
                      </Button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="display_name">Visible name</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="display_name"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Anna, Dr. Anna, Psychologist Anna"
                value={displayName}
              />
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Visible name is public. Legal account name:{" "}
                {userFullName || "Not available"}
              </p>
            </div>
            <div>
              <Label htmlFor="slug">Public slug</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="slug"
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="john-smith"
                value={slug}
              />
              <p className="mt-2 break-all text-xs font-medium text-[#66736f]">
                Public URL: {previewUrl}
              </p>
              <p
                className={`mt-2 text-xs font-semibold ${
                  slugAvailabilityStatus === "available"
                    ? "text-[#1f5f55]"
                    : slugAvailabilityStatus === "taken" ||
                        slugAvailabilityStatus === "invalid"
                      ? "text-[#9a4c2f]"
                      : "text-[#66736f]"
                }`}
              >
                {slugAvailabilityMessage}
              </p>
            </div>
            <div>
              <Label htmlFor="profession">Profession</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="profession"
                onChange={(event) => setProfession(event.target.value)}
                placeholder="Psychologist"
                value={profession}
              />
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm text-[#24312f]"
                id="country"
                onChange={(event) => handleCountryChange(event.target.value)}
                value={country}
              >
                <option value="">Select country...</option>
                {countryTimezones.map((item) => (
                  <option key={item.country} value={item.country}>
                    {item.country}
                  </option>
                ))}
              </select>
            </div>
            {shouldShowTimezoneSelector ? (
              <div>
                <Label htmlFor="timezone">Timezone</Label>
                <select
                  className="mt-2 h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm text-[#24312f]"
                  id="timezone"
                  onChange={(event) =>
                    handleTimezoneChange(event.target.value)
                  }
                  value={timezone}
                >
                  <option value="">Select timezone...</option>
                  {countryTimezonesForSelection.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <div className="rounded-2xl bg-[#f7f3ec] p-4 text-sm leading-6 text-[#5a6865]">
                <p className="font-semibold text-[#24312f]">
                  Stored timezone: {timezone || "Select country first"}
                </p>
                <p className="mt-2">
                  Your availability will be created in this timezone. Clients
                  will later see available times converted to their own
                  timezone.
                </p>
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="languages">Languages</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="languages"
                onChange={(event) => setLanguages(event.target.value)}
                placeholder="English, Slovak"
                value={languages}
              />
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Separate languages with commas.
              </p>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                className="mt-2 min-h-28 rounded-xl border-[#d9ceb9]"
                id="bio"
                onChange={(event) => setBio(event.target.value)}
                placeholder="Tell clients about yourself..."
                value={bio}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="working_rules">Working rules</Label>
              <Textarea
                className="mt-2 min-h-28 rounded-xl border-[#d9ceb9]"
                id="working_rules"
                onChange={(event) => setWorkingRules(event.target.value)}
                placeholder="Tell clients how you work, cancellation rules, and what to prepare..."
                value={workingRules}
              />
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Explain cancellation rules, preparation notes, and how clients
                should use the session workspace.
              </p>
            </div>
          </CardContent>
        </Card>

        {error || timezoneError ? (
          <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
            {error ?? timezoneError}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
            {success}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#66736f]">
            Real avatar upload, services, and payments are intentionally
            outside this stage.
          </p>
          <Button
            className="h-12 rounded-full bg-[#1f5f55] px-6 hover:bg-[#174a43]"
            disabled={isSaving || isSlugUnavailable}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
