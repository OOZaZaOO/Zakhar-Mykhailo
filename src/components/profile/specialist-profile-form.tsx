"use client";

import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { AvatarUpload } from "@/components/profile/avatar-upload";
import { UnsavedChangesBar } from "@/components/shared/unsaved-changes-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProfileSlugAvailability } from "@/hooks/use-profile-slug-availability";
import { useSpecialistProfile } from "@/hooks/use-specialist-profile";
import { setTemporaryAvatarPreview } from "@/lib/avatar-preview-store";
import { languageOptions, normalizeLanguageList } from "@/lib/languages";
import {
  generateProfileSlugFromIdentity,
  normalizeProfileSlug,
  profileSlugPattern,
} from "@/lib/profile/service";
import type { SpecialistProfile } from "@/lib/profile/types";
import type { Json } from "@/lib/supabase/types";
import {
  countryTimezones,
  getAllTimezones,
  getCountryByTimezone,
  getTimezonesByCountry,
  isValidIanaTimezone,
} from "@/lib/timezones";

const profileFormId = "specialist-profile-form";

type SpecialistProfileFormProps = {
  initialError: string | null;
  initialProfile: SpecialistProfile | null;
  userEmail: string | null;
  userFirstName: string;
  userFullName: string;
  userId: string;
  userLastName: string;
};

type ProfileFormSnapshot = {
  avatarUrl: string;
  bio: string;
  country: string;
  countrySearch: string;
  displayName: string;
  languages: string[];
  profession: string;
  slug: string;
  timezone: string;
  timezoneSearch: string;
  workingRules: string;
};

type ProfileFieldErrors = {
  displayName?: string;
  profession?: string;
  slug?: string;
  timezone?: string;
};

const baseInputClass = "mt-2 h-11 rounded-xl border-[#d9ceb9]";
const invalidInputClass =
  "border-[#9a4c2f] bg-[#fff7f4] ring-2 ring-[#f0b9a8]";
const fieldErrorClass = "mt-2 text-xs font-semibold text-[#9a4c2f]";

function getSnapshotFromProfile({
  fallbackDisplayName,
  fallbackSlug,
  profile,
}: {
  fallbackDisplayName: string;
  fallbackSlug: string;
  profile: SpecialistProfile | null;
}): ProfileFormSnapshot {
  const savedTimezone = profile?.timezone ?? "";
  const savedCountry = savedTimezone ? getCountryByTimezone(savedTimezone) : "";

  return {
    avatarUrl: profile?.avatar_url ?? "",
    bio: profile?.bio ?? "",
    country: savedCountry,
    countrySearch: savedCountry,
    displayName: profile?.display_name ?? fallbackDisplayName,
    languages: normalizeLanguageList(profile?.languages ?? []),
    profession: profile?.profession ?? "",
    slug: profile?.slug ?? fallbackSlug,
    timezone: savedTimezone,
    timezoneSearch: savedTimezone,
    workingRules: profile?.working_rules ?? "",
  };
}

function areSnapshotsEqual(
  currentSnapshot: ProfileFormSnapshot,
  savedSnapshot: ProfileFormSnapshot,
) {
  return JSON.stringify(currentSnapshot) === JSON.stringify(savedSnapshot);
}

function getProfileFieldErrors({
  displayName,
  profession,
  slug,
  timezone,
}: {
  displayName: string;
  profession: string;
  slug: string;
  timezone: string;
}) {
  const nextErrors: ProfileFieldErrors = {};
  const normalizedSlug = normalizeProfileSlug(slug);

  if (!displayName.trim()) {
    nextErrors.displayName = "Visible name is required.";
  }

  if (!normalizedSlug) {
    nextErrors.slug = "Public slug is required.";
  } else if (!profileSlugPattern.test(normalizedSlug)) {
    nextErrors.slug = "Use lowercase letters, numbers, and hyphens only.";
  }

  if (!profession.trim()) {
    nextErrors.profession = "Profession is required.";
  }

  if (!timezone.trim()) {
    nextErrors.timezone = "Select a timezone.";
  } else if (!isValidIanaTimezone(timezone)) {
    nextErrors.timezone = "Select a valid timezone from the list.";
  }

  return nextErrors;
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
  const router = useRouter();
  const fallbackSlug = generateProfileSlugFromIdentity({
    email: userEmail,
    firstName: userFirstName,
    lastName: userLastName,
  });
  const initialSavedSnapshot = getSnapshotFromProfile({
    fallbackDisplayName: userFirstName,
    fallbackSlug,
    profile: initialProfile,
  });
  const {
    error,
    isAvatarSaving,
    isSaving,
    profile,
    saveAvatar,
    saveProfile,
    success,
  } = useSpecialistProfile({
    initialError,
    initialProfile,
  });
  const [savedSnapshot, setSavedSnapshot] = useState(initialSavedSnapshot);
  const [avatarRenderKey, setAvatarRenderKey] = useState(0);
  const [temporaryAvatar, setTemporaryAvatar] = useState<{
    file: File | null;
    previewUrl: string | null;
    shouldRemove: boolean;
  }>({
    file: null,
    previewUrl: null,
    shouldRemove: false,
  });
  const [displayName, setDisplayName] = useState(
    initialSavedSnapshot.displayName,
  );
  const [slug, setSlug] = useState(initialSavedSnapshot.slug);
  const [hasUserEditedSlug, setHasUserEditedSlug] = useState(false);
  const [profession, setProfession] = useState(initialSavedSnapshot.profession);
  const [bio, setBio] = useState(initialSavedSnapshot.bio);
  const [country, setCountry] = useState(initialSavedSnapshot.country);
  const [countrySearch, setCountrySearch] = useState(
    initialSavedSnapshot.countrySearch,
  );
  const [isCountrySearchOpen, setIsCountrySearchOpen] = useState(false);
  const [timezone, setTimezone] = useState(initialSavedSnapshot.timezone);
  const [timezoneSearch, setTimezoneSearch] = useState(
    initialSavedSnapshot.timezoneSearch,
  );
  const [isTimezoneDialogOpen, setIsTimezoneDialogOpen] = useState(false);
  const [advancedTimezoneSearch, setAdvancedTimezoneSearch] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ProfileFieldErrors>({});
  const [selectedLanguages, setSelectedLanguages] = useState(
    initialSavedSnapshot.languages,
  );
  const [languageSearch, setLanguageSearch] = useState("");
  const [workingRules, setWorkingRules] = useState(
    initialSavedSnapshot.workingRules,
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
  const isSlugAvailabilityBlocking =
    hasUserEditedSlug &&
    (slugAvailabilityStatus === "taken" ||
      slugAvailabilityStatus === "checking");
  const countryTimezonesForSelection = getTimezonesByCountry(country);
  const timezoneSelectOptions =
    timezone && !countryTimezonesForSelection.includes(timezone)
      ? [timezone, ...countryTimezonesForSelection]
      : countryTimezonesForSelection;
  const isTimezoneSelectDisabled =
    !country ||
    (countryTimezonesForSelection.length === 1 &&
      countryTimezonesForSelection.includes(timezone));
  const allTimezones = useMemo(() => getAllTimezones(), []);
  const countrySuggestions = countryTimezones
    .filter((item) => {
      const normalizedCountry = item.country.toLowerCase();
      const normalizedSearch = countrySearch.trim().toLowerCase();

      return (
        isCountrySearchOpen &&
        normalizedSearch &&
        normalizedCountry !== normalizedSearch &&
        normalizedCountry.includes(normalizedSearch)
      );
    })
    .slice(0, 6);
  const advancedTimezoneSuggestions = allTimezones
    .filter((item) => {
      const normalizedTimezone = item.toLowerCase();
      const normalizedSearch = advancedTimezoneSearch.trim().toLowerCase();

      return !normalizedSearch || normalizedTimezone.includes(normalizedSearch);
    })
    .slice(0, 40);
  const languageSuggestions = languageOptions
    .filter((language) => {
      const normalizedLanguage = language.toLowerCase();
      const normalizedSearch = languageSearch.trim().toLowerCase();

      return (
        normalizedSearch &&
        normalizedLanguage.includes(normalizedSearch) &&
        !selectedLanguages.includes(language)
      );
    })
    .slice(0, 6);
  const currentSnapshot = useMemo(
    () => ({
      avatarUrl: savedSnapshot.avatarUrl,
      bio,
      country,
      countrySearch,
      displayName,
      languages: selectedLanguages,
      profession,
      slug,
      timezone,
      timezoneSearch,
      workingRules,
    }),
    [
      bio,
      country,
      countrySearch,
      displayName,
      profession,
      savedSnapshot.avatarUrl,
      selectedLanguages,
      slug,
      timezone,
      timezoneSearch,
      workingRules,
    ],
  );
  const hasUnsavedChanges = !areSnapshotsEqual(currentSnapshot, savedSnapshot);

  function handleSlugChange(value: string) {
    setHasUserEditedSlug(true);
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      slug: undefined,
    }));
    setSlug(normalizeProfileSlug(value));
  }

  function selectCountry(value: string) {
    const nextTimezones = getTimezonesByCountry(value);

    setCountry(value);
    setCountrySearch(value);
    setIsCountrySearchOpen(false);
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      timezone: undefined,
    }));
    setTimezone(nextTimezones.length === 1 ? nextTimezones[0] : "");
    setTimezoneSearch(nextTimezones.length === 1 ? nextTimezones[0] : "");
    setAdvancedTimezoneSearch("");
  }

  function selectTimezone(value: string) {
    setTimezone(value);
    setTimezoneSearch(value);
    setFieldErrors((currentErrors) => ({
      ...currentErrors,
      timezone: undefined,
    }));
  }

  function selectAdvancedTimezone(value: string) {
    selectTimezone(value);
    setAdvancedTimezoneSearch("");
    setIsTimezoneDialogOpen(false);
  }

  function addLanguage(language: string) {
    if (selectedLanguages.length >= 10 || selectedLanguages.includes(language)) {
      return;
    }

    setSelectedLanguages((currentLanguages) => [
      ...currentLanguages,
      language,
    ]);
    setLanguageSearch("");
  }

  function removeLanguage(language: string) {
    setSelectedLanguages((currentLanguages) =>
      currentLanguages.filter((item) => item !== language),
    );
  }

  function restoreFromSnapshot(snapshot: ProfileFormSnapshot) {
    setBio(snapshot.bio);
    setCountry(snapshot.country);
    setCountrySearch(snapshot.countrySearch);
    setDisplayName(snapshot.displayName);
    setProfession(snapshot.profession);
    setSelectedLanguages(snapshot.languages);
    setSlug(snapshot.slug);
    setTimezone(snapshot.timezone);
    setTimezoneSearch(snapshot.timezoneSearch);
    setWorkingRules(snapshot.workingRules);
    setLanguageSearch("");
    setIsCountrySearchOpen(false);
    setIsTimezoneDialogOpen(false);
    setAdvancedTimezoneSearch("");
    setFieldErrors({});
    setHasUserEditedSlug(false);
    setTemporaryAvatar({
      file: null,
      previewUrl: null,
      shouldRemove: false,
    });
    setTemporaryAvatarPreview({
      file: null,
      hasOverride: true,
      previewUrl: snapshot.avatarUrl || null,
    });
    setAvatarRenderKey((currentKey) => currentKey + 1);
  }

  function handleCancelChanges() {
    restoreFromSnapshot(savedSnapshot);
  }

  async function handleAvatarChange(value: {
    file: File | null;
    previewUrl: string | null;
    shouldRemove: boolean;
  }) {
    setTemporaryAvatar(value);
    setTemporaryAvatarPreview({
      file: value.file,
      hasOverride: true,
      previewUrl: value.previewUrl,
    });

    const savedProfile = await saveAvatar({
      avatarFile: value.file,
      avatarShouldRemove: value.shouldRemove,
      currentAvatarUrl: profile?.avatar_url ?? savedSnapshot.avatarUrl,
      userId,
    });

    if (!savedProfile) {
      setTemporaryAvatar({
        file: null,
        previewUrl: null,
        shouldRemove: false,
      });
      setTemporaryAvatarPreview({
        file: null,
        hasOverride: true,
        previewUrl: savedSnapshot.avatarUrl || null,
      });
      setAvatarRenderKey((currentKey) => currentKey + 1);
      return;
    }

    const nextSavedSnapshot = getSnapshotFromProfile({
      fallbackDisplayName: userFirstName,
      fallbackSlug,
      profile: savedProfile,
    });

    setTemporaryAvatar({
      file: null,
      previewUrl: null,
      shouldRemove: false,
    });
    setTemporaryAvatarPreview({
      file: null,
      hasOverride: true,
      previewUrl: nextSavedSnapshot.avatarUrl || null,
    });
    setSavedSnapshot((currentSavedSnapshot) => ({
      ...currentSavedSnapshot,
      avatarUrl: nextSavedSnapshot.avatarUrl,
    }));
    setAvatarRenderKey((currentKey) => currentKey + 1);
    router.refresh();
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    const nextFieldErrors = getProfileFieldErrors({
      displayName,
      profession,
      slug,
      timezone,
    });

    setFieldErrors(nextFieldErrors);

    if (Object.keys(nextFieldErrors).length > 0) {
      return;
    }

    const savedProfile = await saveProfile({
      avatarUrl: profile?.avatar_url ?? initialProfile?.avatar_url ?? "",
      bio,
      contactLinks: (initialProfile?.contact_links ?? {}) as Json,
      displayName,
      languages: selectedLanguages,
      profession,
      slug,
      timezone,
      userId,
      workingRules,
    });

    if (savedProfile) {
      const nextSavedSnapshot = getSnapshotFromProfile({
        fallbackDisplayName: userFirstName,
        fallbackSlug,
        profile: savedProfile,
      });

      setTemporaryAvatar({
        file: null,
        previewUrl: null,
        shouldRemove: false,
      });
      setTemporaryAvatarPreview({
        file: null,
        hasOverride: true,
        previewUrl: nextSavedSnapshot.avatarUrl || null,
      });
      setSlug(savedProfile.slug);
      setSavedSnapshot(nextSavedSnapshot);
      setHasUserEditedSlug(false);
      setAvatarRenderKey((currentKey) => currentKey + 1);
      router.refresh();
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

      <form
        className="mt-8 space-y-6 pb-24"
        id={profileFormId}
        onSubmit={handleSave}
      >
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
              <AvatarUpload
                displayName={displayName || userFirstName || "Profile"}
                initialPreviewUrl={
                  profile?.avatar_url ?? initialProfile?.avatar_url
                }
                isSaving={isAvatarSaving}
                key={avatarRenderKey}
                onChange={(value) => {
                  void handleAvatarChange(value);
                }}
              />
              {isAvatarSaving ? (
                <p className="mt-2 text-xs font-semibold text-[#1f5f55]">
                  Saving profile photo...
                </p>
              ) : null}
              {temporaryAvatar.file && !isAvatarSaving ? (
                <p className="mt-2 text-xs font-medium text-[#66736f]">
                  Selected: {temporaryAvatar.file.name}. The photo is saved
                  automatically.
                </p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="display_name">Visible name</Label>
              <Input
                aria-invalid={Boolean(fieldErrors.displayName)}
                className={`${baseInputClass} ${
                  fieldErrors.displayName ? invalidInputClass : ""
                }`}
                id="display_name"
                onChange={(event) => {
                  setDisplayName(event.target.value);
                  setFieldErrors((currentErrors) => ({
                    ...currentErrors,
                    displayName: undefined,
                  }));
                }}
                placeholder="Anna, Dr. Anna, Psychologist Anna"
                value={displayName}
              />
              {fieldErrors.displayName ? (
                <p className={fieldErrorClass}>{fieldErrors.displayName}</p>
              ) : null}
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Visible name is public. Legal account name:{" "}
                {userFullName || "Not available"}
              </p>
            </div>
            <div>
              <Label htmlFor="slug">Public slug</Label>
              <Input
                aria-invalid={Boolean(fieldErrors.slug)}
                className={`${baseInputClass} ${
                  fieldErrors.slug ? invalidInputClass : ""
                }`}
                id="slug"
                onChange={(event) => handleSlugChange(event.target.value)}
                placeholder="john-smith"
                value={slug}
              />
              {fieldErrors.slug ? (
                <p className={fieldErrorClass}>{fieldErrors.slug}</p>
              ) : null}
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
                aria-invalid={Boolean(fieldErrors.profession)}
                className={`${baseInputClass} ${
                  fieldErrors.profession ? invalidInputClass : ""
                }`}
                id="profession"
                onChange={(event) => {
                  setProfession(event.target.value);
                  setFieldErrors((currentErrors) => ({
                    ...currentErrors,
                    profession: undefined,
                  }));
                }}
                placeholder="Psychologist"
                value={profession}
              />
              {fieldErrors.profession ? (
                <p className={fieldErrorClass}>{fieldErrors.profession}</p>
              ) : null}
            </div>
            <div>
              <Label htmlFor="country">Country</Label>
              <div className="relative mt-2">
                <Input
                  className="h-11 rounded-xl border-[#d9ceb9]"
                  id="country"
                  onBlur={() => {
                    window.setTimeout(() => setIsCountrySearchOpen(false), 120);
                  }}
                  onChange={(event) => {
                    setCountrySearch(event.target.value);
                    setIsCountrySearchOpen(true);
                    setCountry("");
                    setTimezone("");
                    setTimezoneSearch("");
                    setAdvancedTimezoneSearch("");
                    setIsTimezoneDialogOpen(false);
                  }}
                  onFocus={() => setIsCountrySearchOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && countrySuggestions[0]) {
                      event.preventDefault();
                      selectCountry(countrySuggestions[0].country);
                    }
                  }}
                  placeholder="Search country..."
                  value={countrySearch}
                />
                {countrySuggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-2xl border border-[#ded5c8] bg-white shadow-lg">
                    {countrySuggestions.map((item) => (
                      <button
                        className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#24312f] transition hover:bg-[#f7f3ec]"
                        key={item.country}
                        onClick={() => selectCountry(item.country)}
                        type="button"
                      >
                        {item.country}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <div className="mt-2 space-y-3">
                <select
                  aria-invalid={Boolean(fieldErrors.timezone)}
                  className={`h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm font-semibold text-[#24312f] outline-none transition disabled:cursor-not-allowed disabled:bg-[#f7f3ec] disabled:text-[#66736f] ${
                    fieldErrors.timezone ? invalidInputClass : ""
                  }`}
                  disabled={isTimezoneSelectDisabled}
                  id="timezone"
                  onChange={(event) => {
                    selectTimezone(event.target.value);
                  }}
                  value={timezoneSearch}
                >
                  {!country ? (
                    <option value="">Select country first</option>
                  ) : null}
                  {country && !timezone ? (
                    <option value="">Select timezone</option>
                  ) : null}
                  {timezoneSelectOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
                <Button
                  className="h-auto rounded-full px-0 text-sm font-bold text-[#1f5f55] hover:text-[#153f39]"
                  onClick={() => setIsTimezoneDialogOpen(true)}
                  type="button"
                  variant="link"
                >
                  Choose another timezone
                </Button>
              </div>
              {fieldErrors.timezone ? (
                <p className={fieldErrorClass}>{fieldErrors.timezone}</p>
              ) : null}
            </div>
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
              <div className="relative mt-2">
                <Input
                  className="h-11 rounded-xl border-[#d9ceb9]"
                  disabled={selectedLanguages.length >= 10}
                  id="languages"
                  onChange={(event) => setLanguageSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && languageSuggestions[0]) {
                      event.preventDefault();
                      addLanguage(languageSuggestions[0]);
                    }
                  }}
                  placeholder={
                    selectedLanguages.length >= 10
                      ? "Maximum 10 languages selected"
                      : "Search language..."
                  }
                  value={languageSearch}
                />
                {languageSuggestions.length > 0 ? (
                  <div className="absolute left-0 right-0 top-12 z-20 overflow-hidden rounded-2xl border border-[#ded5c8] bg-white shadow-lg">
                    {languageSuggestions.map((language) => (
                      <button
                        className="block w-full px-4 py-3 text-left text-sm font-semibold text-[#24312f] transition hover:bg-[#f7f3ec]"
                        key={language}
                        onClick={() => addLanguage(language)}
                        type="button"
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
              {selectedLanguages.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedLanguages.map((language) => (
                    <span
                      className="inline-flex items-center gap-2 rounded-full bg-[#eef1da] px-3 py-2 text-sm font-bold text-[#5d6b2f]"
                      key={language}
                    >
                      {language}
                      <button
                        aria-label={`Remove ${language}`}
                        className="rounded-full text-[#5d6b2f] transition hover:text-[#9a4c2f]"
                        onClick={() => removeLanguage(language)}
                        type="button"
                      >
                        <X className="size-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              ) : null}
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Choose up to 10 languages from the list.
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

        {error ? (
          <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
            {error}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
            {success}
          </p>
        ) : null}

        <p className="text-sm leading-6 text-[#66736f]">
          Services and payments are intentionally outside this stage.
        </p>
      </form>
      {isTimezoneDialogOpen ? (
        <div className="fixed inset-0 z-50 flex items-end bg-[#17211f]/35 px-4 py-4 backdrop-blur-sm sm:items-center sm:justify-center">
          <div className="w-full overflow-hidden rounded-3xl border border-[#ded5c8] bg-white shadow-2xl sm:max-w-xl">
            <div className="flex items-start justify-between gap-4 border-b border-[#eadfce] px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#24312f]">
                  Choose another timezone
                </h2>
                <p className="mt-1 text-sm leading-6 text-[#66736f]">
                  Advanced selection. Your selected country will stay the same.
                </p>
              </div>
              <button
                aria-label="Close timezone picker"
                className="rounded-full p-2 text-[#66736f] transition hover:bg-[#f7f3ec] hover:text-[#24312f]"
                onClick={() => {
                  setIsTimezoneDialogOpen(false);
                  setAdvancedTimezoneSearch("");
                }}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5">
              <Input
                autoFocus
                className="h-11 rounded-xl border-[#d9ceb9]"
                onChange={(event) =>
                  setAdvancedTimezoneSearch(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    advancedTimezoneSuggestions[0]
                  ) {
                    event.preventDefault();
                    selectAdvancedTimezone(advancedTimezoneSuggestions[0]);
                  }

                  if (event.key === "Escape") {
                    setIsTimezoneDialogOpen(false);
                    setAdvancedTimezoneSearch("");
                  }
                }}
                placeholder="Search timezone..."
                value={advancedTimezoneSearch}
              />
              <div className="mt-4 max-h-[360px] overflow-y-auto rounded-2xl border border-[#ded5c8]">
                {advancedTimezoneSuggestions.map((item) => (
                  <button
                    className={`block w-full px-4 py-3 text-left text-sm font-semibold transition hover:bg-[#f7f3ec] ${
                      item === timezone
                        ? "bg-[#eef1da] text-[#5d6b2f]"
                        : "text-[#24312f]"
                    }`}
                    key={item}
                    onClick={() => selectAdvancedTimezone(item)}
                    type="button"
                  >
                    {item}
                  </button>
                ))}
                {advancedTimezoneSuggestions.length === 0 ? (
                  <p className="px-4 py-5 text-sm font-medium text-[#66736f]">
                    No timezone found.
                  </p>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {hasUnsavedChanges ? (
        <UnsavedChangesBar
          formId={profileFormId}
          isSaving={isSaving}
          onCancel={handleCancelChanges}
          saveDisabled={isSlugAvailabilityBlocking}
        />
      ) : null}
    </div>
  );
}
