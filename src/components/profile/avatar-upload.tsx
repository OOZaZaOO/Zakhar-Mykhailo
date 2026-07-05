"use client";

import { ImagePlus, Upload, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type AvatarUploadValue = {
  file: File | null;
  previewUrl: string | null;
};

type AvatarUploadProps = {
  displayName: string;
  initialPreviewUrl?: string | null;
  onChange?: (value: AvatarUploadValue) => void;
};

const allowedAvatarTypes = ["image/jpeg", "image/png", "image/webp"];
const maxAvatarSize = 5 * 1024 * 1024;

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function isAllowedAvatarFile(file: File) {
  return allowedAvatarTypes.includes(file.type);
}

export function AvatarUpload({
  displayName,
  initialPreviewUrl,
  onChange,
}: AvatarUploadProps) {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(initialPreviewUrl ?? null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    };
  }, []);

  function resetFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function updateAvatar(file: File) {
    if (!isAllowedAvatarFile(file)) {
      setError("Use a JPG, PNG, or WebP image.");
      resetFileInput();
      return;
    }

    if (file.size > maxAvatarSize) {
      setError("Choose an image smaller than 5 MB.");
      resetFileInput();
      return;
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }

    const nextPreviewUrl = URL.createObjectURL(file);
    objectUrlRef.current = nextPreviewUrl;
    setError(null);
    setPreviewUrl(nextPreviewUrl);
    onChange?.({ file, previewUrl: nextPreviewUrl });

    // TODO: Replace this temporary preview with Supabase Storage upload later.
  }

  function removeAvatar() {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setError(null);
    setPreviewUrl(null);
    resetFileInput();
    onChange?.({ file: null, previewUrl: null });
  }

  return (
    <div
      className={cn(
        "mt-2 flex flex-col gap-4 rounded-2xl border border-transparent bg-[#f7f3ec] p-4 transition sm:flex-row sm:items-center",
        isDragging && "border-[#1f5f55] bg-[#eef1da]",
      )}
      onDragLeave={() => setIsDragging(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);

        const file = event.dataTransfer.files[0];

        if (file) {
          updateAvatar(file);
        }
      }}
    >
      <button
        aria-label="Choose avatar photo"
        className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1f5f55] text-2xl font-bold text-white ring-4 ring-white transition hover:bg-[#174a43]"
        onClick={() => fileInputRef.current?.click()}
        type="button"
      >
        {previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            alt=""
            className="size-full object-cover"
            src={previewUrl}
          />
        ) : displayName.trim() ? (
          getInitials(displayName)
        ) : (
          <ImagePlus className="size-8" />
        )}
      </button>

      <div className="min-w-0 flex-1 space-y-3">
        <div>
          <p className="text-sm font-semibold text-[#24312f]">
            Profile photo
          </p>
          <p className="mt-1 text-sm leading-6 text-[#5a6865]">
            Choose a clear JPG, PNG, or WebP image. This preview is temporary
            and will stay only while the app is open.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            onClick={() => fileInputRef.current?.click()}
            type="button"
          >
            <Upload className="mr-2 size-4" />
            {previewUrl ? "Change photo" : "Upload photo"}
          </Button>

          {previewUrl ? (
            <Button
              className="rounded-full"
              onClick={removeAvatar}
              type="button"
              variant="outline"
            >
              <X className="mr-2 size-4" />
              Remove photo
            </Button>
          ) : null}
        </div>

        <input
          accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
          className="sr-only"
          onChange={(event) => {
            const file = event.target.files?.[0];

            if (file) {
              updateAvatar(file);
            }
          }}
          ref={fileInputRef}
          type="file"
        />

        {error ? (
          <p className="text-sm font-semibold text-[#9a4c2f]">{error}</p>
        ) : (
          <p className="text-xs font-medium text-[#66736f]">
            You can also drag and drop an image here.
          </p>
        )}
      </div>
    </div>
  );
}
