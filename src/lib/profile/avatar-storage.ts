import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

type ProfileClient = SupabaseClient<Database>;

export const specialistAvatarBucket = "avatars";

const avatarExtensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function getAvatarExtension(file: File) {
  return avatarExtensionByMimeType[file.type] ?? "jpg";
}

export function getSpecialistAvatarPath(userId: string, file: File) {
  const uploadId =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${userId}/avatars/${uploadId}.${getAvatarExtension(file)}`;
}

export function getSpecialistAvatarPathFromUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    const bucketMarker = `/storage/v1/object/public/${specialistAvatarBucket}/`;
    const markerIndex = parsedUrl.pathname.indexOf(bucketMarker);

    if (markerIndex === -1) {
      return null;
    }

    return decodeURIComponent(
      parsedUrl.pathname.slice(markerIndex + bucketMarker.length),
    );
  } catch {
    return null;
  }
}

export async function uploadSpecialistAvatar({
  file,
  supabase,
  userId,
}: {
  file: File;
  supabase: ProfileClient;
  userId: string;
}) {
  const path = getSpecialistAvatarPath(userId, file);

  const { error } = await supabase.storage
    .from(specialistAvatarBucket)
    .upload(path, file, {
      cacheControl: "31536000",
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    return {
      error,
      publicUrl: null,
    };
  }

  const { data } = supabase.storage
    .from(specialistAvatarBucket)
    .getPublicUrl(path);

  return {
    error: null,
    publicUrl: data.publicUrl,
  };
}

export async function removeSpecialistAvatar({
  avatarUrl,
  supabase,
}: {
  avatarUrl: string;
  supabase: ProfileClient;
}) {
  const path = getSpecialistAvatarPathFromUrl(avatarUrl);

  if (!path) {
    return { error: null };
  }

  const { error } = await supabase.storage
    .from(specialistAvatarBucket)
    .remove([path]);

  return { error };
}
