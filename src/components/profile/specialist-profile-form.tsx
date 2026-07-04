"use client";

import { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import type { Database, Json } from "@/lib/supabase/types";

type SpecialistProfile =
  Database["public"]["Tables"]["specialist_profiles"]["Row"];

type Visibility = SpecialistProfile["visibility"];

type SpecialistProfileFormProps = {
  initialError: string | null;
  initialProfile: SpecialistProfile | null;
  userId: string;
};

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function stringifyContactLinks(value: Json) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return JSON.stringify(value, null, 2);
  }

  return "{}";
}

function parseLanguages(value: string) {
  return value
    .split(",")
    .map((language) => language.trim())
    .filter(Boolean);
}

function normalizeSlug(value: string) {
  return value.trim().toLowerCase();
}

export function SpecialistProfileForm({
  initialError,
  initialProfile,
  userId,
}: SpecialistProfileFormProps) {
  const [profile, setProfile] = useState(initialProfile);
  const [displayName, setDisplayName] = useState(
    initialProfile?.display_name ?? "",
  );
  const [slug, setSlug] = useState(initialProfile?.slug ?? "");
  const [profession, setProfession] = useState(
    initialProfile?.profession ?? "",
  );
  const [bio, setBio] = useState(initialProfile?.bio ?? "");
  const [timezone, setTimezone] = useState(
    initialProfile?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
  );
  const [languages, setLanguages] = useState(
    initialProfile?.languages.join(", ") ?? "",
  );
  const [workingRules, setWorkingRules] = useState(
    initialProfile?.working_rules ?? "",
  );
  const [visibility, setVisibility] = useState<Visibility>(
    initialProfile?.visibility ?? "private",
  );
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(
    initialProfile?.is_accepting_bookings ?? true,
  );
  const [contactLinks, setContactLinks] = useState(
    stringifyContactLinks(initialProfile?.contact_links ?? {}),
  );
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mode = profile ? "edit" : "create";
  const previewUrl = useMemo(
    () => (slug ? `/profile/${normalizeSlug(slug)}` : "/profile/your-slug"),
    [slug],
  );

  function validateForm() {
    const nextSlug = normalizeSlug(slug);

    if (!displayName.trim()) {
      return "Display name is required.";
    }

    if (!profession.trim()) {
      return "Profession is required.";
    }

    if (!timezone.trim()) {
      return "Timezone is required.";
    }

    if (!slugPattern.test(nextSlug)) {
      return "Slug must be lowercase URL-safe text, for example maya-sterling.";
    }

    try {
      const parsedContactLinks = JSON.parse(contactLinks);

      if (
        parsedContactLinks === null ||
        typeof parsedContactLinks !== "object" ||
        Array.isArray(parsedContactLinks)
      ) {
        return "Contact links must be a JSON object.";
      }
    } catch {
      return "Contact links must be valid JSON.";
    }

    return null;
  }

  async function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSaving(true);

    const nextSlug = normalizeSlug(slug);
    const parsedContactLinks = JSON.parse(contactLinks) as Json;
    const supabase = createSupabaseBrowserClient();
    const payload = {
      bio: bio.trim(),
      contact_links: parsedContactLinks,
      display_name: displayName.trim(),
      is_accepting_bookings: isAcceptingBookings,
      languages: parseLanguages(languages),
      profession: profession.trim(),
      slug: nextSlug,
      timezone: timezone.trim(),
      user_id: userId,
      visibility,
      working_rules: workingRules.trim(),
    };

    const request = profile
      ? supabase
          .from("specialist_profiles")
          .update(payload)
          .eq("id", profile.id)
          .select()
          .single()
      : supabase.from("specialist_profiles").insert(payload).select().single();

    const { data, error: saveError } = await request;

    if (saveError) {
      setError(saveError.message);
      setIsSaving(false);
      return;
    }

    setProfile(data);
    setSlug(data.slug);
    setContactLinks(stringifyContactLinks(data.contact_links));
    setSuccess(
      profile
        ? "Specialist profile updated."
        : "Specialist profile created.",
    );
    setIsSaving(false);
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
                value={displayName}
              />
            </div>
            <div>
              <Label htmlFor="slug">Public slug</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="slug"
                onChange={(event) => setSlug(normalizeSlug(event.target.value))}
                value={slug}
              />
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Preview: {previewUrl}
              </p>
            </div>
            <div>
              <Label htmlFor="profession">Profession</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="profession"
                onChange={(event) => setProfession(event.target.value)}
                value={profession}
              />
            </div>
            <div>
              <Label htmlFor="timezone">Timezone</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                id="timezone"
                onChange={(event) => setTimezone(event.target.value)}
                value={timezone}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                className="mt-2 min-h-28 rounded-xl border-[#d9ceb9]"
                id="bio"
                onChange={(event) => setBio(event.target.value)}
                value={bio}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Booking and visibility</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <select
                className="mt-2 h-11 w-full rounded-xl border border-[#d9ceb9] bg-white px-3 text-sm text-[#24312f]"
                id="visibility"
                onChange={(event) =>
                  setVisibility(event.target.value as Visibility)
                }
                value={visibility}
              >
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="hidden">Hidden</option>
              </select>
            </div>
            <label className="flex items-center gap-3 rounded-2xl bg-[#f7f3ec] p-4 text-sm font-semibold text-[#4f5f5b]">
              <input
                checked={isAcceptingBookings}
                className="size-4 rounded border-[#d9ceb9]"
                onChange={(event) =>
                  setIsAcceptingBookings(event.target.checked)
                }
                type="checkbox"
              />
              Accept bookings
            </label>
            <div className="sm:col-span-2">
              <Label htmlFor="working_rules">Working rules</Label>
              <Textarea
                className="mt-2 min-h-28 rounded-xl border-[#d9ceb9]"
                id="working_rules"
                onChange={(event) => setWorkingRules(event.target.value)}
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
                placeholder="English, Ukrainian"
                value={languages}
              />
              <p className="mt-2 text-xs font-medium text-[#66736f]">
                Separate languages with commas.
              </p>
            </div>
            <div>
              <Label htmlFor="contact_links">Contact links JSON</Label>
              <Textarea
                className="mt-2 min-h-32 rounded-xl border-[#d9ceb9] font-mono text-xs"
                id="contact_links"
                onChange={(event) => setContactLinks(event.target.value)}
                value={contactLinks}
              />
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

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-6 text-[#66736f]">
            Avatar upload, services, booking, and payments are intentionally
            outside this stage.
          </p>
          <Button
            className="h-12 rounded-full bg-[#1f5f55] px-6 hover:bg-[#174a43]"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? "Saving..." : "Save profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
