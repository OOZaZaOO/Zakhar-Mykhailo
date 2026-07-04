"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { updateSpecialistBookingStatus } from "@/lib/profile/service";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type BookingStatusToggleProps = {
  initialIsAcceptingBookings: boolean;
  profileId: string | null;
};

export function BookingStatusToggle({
  initialIsAcceptingBookings,
  profileId,
}: BookingStatusToggleProps) {
  const [isAcceptingBookings, setIsAcceptingBookings] = useState(
    initialIsAcceptingBookings,
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const isDisabled = isSaving || !profileId;

  async function handleToggle() {
    if (!profileId || isSaving) {
      return;
    }

    const nextValue = !isAcceptingBookings;
    setError(null);
    setSuccess(null);
    setIsSaving(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: updateError } = await updateSpecialistBookingStatus(
      supabase,
      profileId,
      nextValue,
    );

    if (updateError) {
      setError(updateError.message);
      setIsSaving(false);
      return;
    }

    setIsAcceptingBookings(data.is_accepting_bookings);
    setSuccess(
      data.is_accepting_bookings
        ? "New bookings are enabled."
        : "New bookings are paused.",
    );
    setIsSaving(false);
  }

  return (
    <div className="rounded-3xl border border-[#ded5c8] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Booking status
          </p>
          <p className="mt-2 text-lg font-semibold text-[#24312f]">
            {isAcceptingBookings
              ? "Accepting new bookings"
              : "New bookings paused"}
          </p>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#66736f]">
            When disabled, your public profile remains accessible and existing
            bookings stay unchanged. New clients cannot book available slots.
          </p>
        </div>
        <Button
          aria-pressed={isAcceptingBookings}
          className={cn(
            "h-12 min-w-36 rounded-full px-5 font-bold",
            isAcceptingBookings
              ? "bg-[#1f5f55] text-white hover:bg-[#174a43]"
              : "bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#efcbbd]",
          )}
          disabled={isDisabled}
          onClick={handleToggle}
          type="button"
        >
          {isSaving ? "Saving..." : isAcceptingBookings ? "ON" : "OFF"}
        </Button>
      </div>
      {!profileId ? (
        <p className="mt-4 rounded-2xl bg-[#f7f3ec] px-4 py-3 text-sm font-medium leading-6 text-[#66736f]">
          Create your specialist profile before managing booking availability.
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
          {error}
        </p>
      ) : null}
      {success ? (
        <p className="mt-4 rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
          {success}
        </p>
      ) : null}
    </div>
  );
}

