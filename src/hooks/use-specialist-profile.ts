"use client";

import { useState } from "react";

import {
  saveSpecialistProfile,
  validateSpecialistProfileForm,
} from "@/lib/profile/service";
import type {
  SpecialistProfile,
  SpecialistProfileFormValues,
} from "@/lib/profile/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getFriendlyProfileError(message: string) {
  if (message.includes("specialist_profiles_slug_key")) {
    return "This public slug is already taken. Choose another one.";
  }

  if (message.includes("specialist_profiles_user_id_key")) {
    return "A specialist profile already exists for this account. Refresh the page and try editing it.";
  }

  if (message.includes("violates row-level security policy")) {
    return "You do not have permission to save this profile.";
  }

  return message;
}

export function useSpecialistProfile({
  initialError,
  initialProfile,
}: {
  initialError: string | null;
  initialProfile: SpecialistProfile | null;
}) {
  const [profile, setProfile] = useState(initialProfile);
  const [error, setError] = useState<string | null>(initialError);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function saveProfile(values: SpecialistProfileFormValues) {
    if (isSaving) {
      return null;
    }

    setError(null);
    setSuccess(null);

    const validationError = validateSpecialistProfileForm(values);

    if (validationError) {
      setError(validationError);
      return null;
    }

    setIsSaving(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: saveError } = await saveSpecialistProfile(
      supabase,
      values,
      profile,
    );

    if (saveError) {
      setError(getFriendlyProfileError(saveError.message));
      setIsSaving(false);
      return null;
    }

    setProfile(data);
    setSuccess(profile ? "Specialist profile updated." : "Specialist profile created.");
    setIsSaving(false);

    return data;
  }

  return {
    error,
    isSaving,
    profile,
    saveProfile,
    success,
  };
}

