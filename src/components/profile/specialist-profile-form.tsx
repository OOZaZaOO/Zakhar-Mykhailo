"use client";

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
  generateProfileSlugFromEmail,
  normalizeProfileSlug,
} from "@/lib/profile/service";
import type { SpecialistProfile } from "@/lib/profile/types";
import type { Json } from "@/lib/supabase/types";

type SpecialistProfileFormProps = {
  initialError: string | null;
  initialProfile: SpecialistProfile | null;
  userEmail: string | null;
  userId: string;
};

function stringifyContactLinks(value: Json) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }

  return "";
}

function parseLanguages(value: string) {
  return value
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean);
}

export function SpecialistProfileForm({
  initialError,
  initialProfile,
  userEmail,
  userId,
}: SpecialistProfileFormProps) {
  const { error, isSaving, profile, saveProfile, success } =
    useSpecialistProfile({
      initialError,
      initialProfile,
    });
  const [avatarUrl, setAvatarUrl] = useState(initialProfile?.avatar_url ?? "");
  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name ?? "",
  );
  const [slug, setSlug] = useState(
    initialProfile?.slug ?? generateProfileSlugFromEmail(userEmail),
  );
  const [hasUserEditedSlug, setHasUserEditedSlug] = useState(false);
  const [profession, setProfession] = useState(
    initialProfile?.profession ?? "",
  );
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [timezone, setTimezone] = useState(initialProfile?.timezone ?? "");
  const [languages, setLanguages] = useState(
    initialProfile?.languages.join(", ") ?? "",
  );
  const [workingRules, setWorkingRules] = useState(
    initialProfile?.working_rules ?? "",
  );
  const [contactLinks, setContactLinks] = useState(
    stringifyContactLinks(initialProfile?.contact_links ?? {}),
  );
  const [contactLinksError, setContactLinksError] = useState<string | null>(
    null,
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

  function handleSlugChange(value: string) {
    setHasUserEditedSlug(true);
    setSlug(normalizeProfileSlug(value));
  }

  function parseContactLinks() {
    try {
      const parsedContactLinks = contactLinks.trim()
        ? JSON.parse(contactLinks)
        : {};

      if (
        parsedContactLinks === null ||
        typeof parsedContactLinks !== "object" ||
        Array.isArray(parsedContactLinks)
      ) {
        return {
          error: "Contact links must be a JSON object.",
          value: null,
        };
      }

      return {
        error: null,
        value: parsedContactLinks as Json,
      };
    } catch {
      return {
        error: "Contact links must be valid JSON.",
        value: null,
      };
    }
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSaving) {
      return;
    }

    setContactLinksError(null);

    const parsedContactLinks = parseContactLinks();

    if (parsedContactLinks.error) {
      setContactLinksError(parsedContactLinks.error);
      return;
    }

    const savedProfile = await saveProfile({
      avatarUrl,
      bio,
      contactLinks: parsedContactLinks.value ?? {},
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
      setSlug(savedProfile.slug);
      setHasUserEditedSlug(false);
      setContactLinks(stringifyContactLinks(savedProfile.contact_links));
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
            <div>
              <Label htmlFor="display_name">Display name</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="display_name"
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="John Smith"
                value={displayName}
              />
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
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="timezone"
                onChange={(event) => setTimezone(event.target.value)}
                placeholder="Europe/Bratislava"
                value={timezone}
              />
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
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Working rules</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              Explain cancellation rules, preparation notes, and how clients
              should use the session workspace.
            </p>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="working_rules">Working rules</Label>
              <Textarea
                className="mt-2 min-h-28 rounded-xl border-[#d9ceb9]"
                id="working_rules"
                onChange={(event) => setWorkingRules(event.target.value)}
                placeholder="Tell clients how you work, cancellation rules, and what to prepare..."
                value={workingRules}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
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
            <div>
              <Label htmlFor="avatar_url">Avatar URL</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="avatar_url"
                onChange={(event) => setAvatarUrl(event.target.value)}
                placeholder="https://example.com/avatar.jpg"
                type="url"
                value={avatarUrl}
              />
            </div>
            <div>
              <Label htmlFor="contact_links">Contact links JSON</Label>
              <Textarea
                className="mt-2 min-h-32 rounded-xl border-[#d9ceb9] font-mono text-xs"
                id="contact_links"
                onChange={(event) => {
                  setContactLinks(event.target.value);
                  setContactLinksError(null);
                }}
                placeholder={`{"website":"https://example.com","linkedin":"https://linkedin.com/in/john-smith"}`}
                value={contactLinks}
              />
            </div>
          </CardContent>
        </Card>

        {error || contactLinksError ? (
          <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
            {error ?? contactLinksError}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
            {success}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#66736f]">
            Avatar upload, services, and payments are intentionally outside
            this stage.
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
