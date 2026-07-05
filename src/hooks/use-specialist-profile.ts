"use client";

import { useState } from "react";

import {
  removeSpecialistAvatar,
  uploadSpecialistAvatar,
} from "@/lib/profile/avatar-storage";
import {
  isSpecialistProfileSlugTaken,
  saveSpecialistProfile,
  validateSpecialistProfileForm,
} from "@/lib/profile/service";
import type {
  SpecialistProfile,
  SpecialistProfileFormValues,
} from "@/lib/profile/types";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

function getFriendlyProfileError(message: string) {
  if (message.includes("Bucket not found")) {
    return "Avatar storage is not configured yet. Apply the Supabase storage migration and try again.";
  }

  if (message.includes("new row violates row-level security policy")) {
    return "Avatar storage permissions are not configured yet. Apply the Supabase storage migration and try again.";
  }

  if (message.includes("The resource already exists")) {
    return "This avatar file already exists. Choose the image again and try saving once more.";
  }

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
    const { error: slugCheckError, isTaken } =
      await isSpecialistProfileSlugTaken(supabase, values.slug, profile?.id);

    if (slugCheckError) {
      setError(getFriendlyProfileError(slugCheckError.message));
      setIsSaving(false);
      return null;
    }

    if (isTaken) {
      setError("This public slug is already taken. Choose another one.");
      setIsSaving(false);
      return null;
    }

    let nextAvatarUrl = values.avatarUrl;
    let previousAvatarUrlToRemove = "";

    if (values.avatarShouldRemove && values.avatarUrl) {
      previousAvatarUrlToRemove = values.avatarUrl;
      nextAvatarUrl = "";
    }

    if (values.avatarFile) {
      previousAvatarUrlToRemove = nextAvatarUrl;
      const { error: uploadAvatarError, publicUrl } =
        await uploadSpecialistAvatar({
          file: values.avatarFile,
          supabase,
          userId: values.userId,
        });

      if (uploadAvatarError || !publicUrl) {
        setError(
          getFriendlyProfileError(
            uploadAvatarError?.message ?? "Avatar upload failed.",
          ),
        );
        setIsSaving(false);
        return null;
      }

      nextAvatarUrl = publicUrl;
    }

    const { data, error: saveError } = await saveSpecialistProfile(
      supabase,
      {
        ...values,
        avatarUrl: nextAvatarUrl,
      },
      profile,
    );

    if (saveError) {
      setError(getFriendlyProfileError(saveError.message));
      setIsSaving(false);
      return null;
    }

    if (values.avatarFile && !data.avatar_url) {
      setError("Avatar uploaded, but the profile did not save its URL. Try saving again.");
      setIsSaving(false);
      return null;
    }

    if (previousAvatarUrlToRemove) {
      await removeSpecialistAvatar({
        avatarUrl: previousAvatarUrlToRemove,
        supabase,
      });
    }

    setProfile(data);
    setSuccess(
      profile ? "Specialist profile updated." : "Specialist profile created.",
    );
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
