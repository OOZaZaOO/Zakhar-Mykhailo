"use client";

import { useEffect, useMemo, useState } from "react";

import {
  isSpecialistProfileSlugTaken,
  normalizeProfileSlug,
  profileSlugPattern,
} from "@/lib/profile/service";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type SlugAvailabilityStatus =
  | "idle"
  | "invalid"
  | "checking"
  | "available"
  | "taken"
  | "error";

export function useProfileSlugAvailability({
  currentProfileId,
  slug,
}: {
  currentProfileId?: string;
  slug: string;
}) {
  const normalizedSlug = useMemo(() => normalizeProfileSlug(slug), [slug]);
  const [availability, setAvailability] = useState<{
    message: string;
    slug: string;
    status: Extract<SlugAvailabilityStatus, "available" | "taken" | "error">;
  } | null>(null);

  useEffect(() => {
    if (!normalizedSlug) {
      return;
    }

    if (!profileSlugPattern.test(normalizedSlug)) {
      return;
    }

    let isCurrentCheck = true;
    const timeoutId = window.setTimeout(async () => {
      const supabase = createSupabaseBrowserClient();
      const { error, isTaken } = await isSpecialistProfileSlugTaken(
        supabase,
        normalizedSlug,
        currentProfileId,
      );

      if (!isCurrentCheck) {
        return;
      }

      if (error) {
        setAvailability({
          message:
            "Could not check slug right now. It will be checked on save.",
          slug: normalizedSlug,
          status: "error",
        });
        return;
      }

      if (isTaken) {
        setAvailability({
          message: "This public slug is already taken. Choose another one.",
          slug: normalizedSlug,
          status: "taken",
        });
        return;
      }

      setAvailability({
        message: "This public slug is available.",
        slug: normalizedSlug,
        status: "available",
      });
    }, 350);

    return () => {
      isCurrentCheck = false;
      window.clearTimeout(timeoutId);
    };
  }, [currentProfileId, normalizedSlug]);

  if (!normalizedSlug) {
    return { message: "Slug is required.", status: "idle" as const };
  }

  if (!profileSlugPattern.test(normalizedSlug)) {
    return {
      message: "Use lowercase letters, numbers, and hyphens only.",
      status: "invalid" as const,
    };
  }

  if (availability?.slug !== normalizedSlug) {
    return {
      message: "Checking slug availability...",
      status: "checking" as const,
    };
  }

  return {
    message: availability.message,
    status: availability.status,
  };
}
