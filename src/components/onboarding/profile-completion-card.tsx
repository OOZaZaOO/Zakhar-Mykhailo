"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  getProfileCompletionFieldLabel,
  type ProfileCompletion,
} from "@/lib/profile/completion";

type ProfileCompletionCardProps = {
  completion: ProfileCompletion;
};

export function ProfileCompletionCard({
  completion,
}: ProfileCompletionCardProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (completion.isComplete || isDismissed) {
    return null;
  }

  return (
    <section className="mb-6 rounded-3xl border border-[#ded5c8] bg-[#fffaf2] p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Profile setup
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end">
            <p className="text-4xl font-semibold tracking-normal text-[#24312f]">
              {completion.percentage}% complete
            </p>
          </div>
          <p className="mt-3 text-sm font-medium text-[#66736f]">
            Complete these fields to unlock your workspace:
          </p>
          <ul className="mt-3 space-y-1 text-sm font-semibold text-[#5a6865]">
            {completion.missingFields.map((field) => (
              <li key={field}>• {getProfileCompletionFieldLabel(field)}</li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="rounded-full"
            onClick={() => setIsDismissed(true)}
            type="button"
            variant="outline"
          >
            Dismiss
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
          >
            <Link href="/dashboard/profile">Complete profile</Link>
          </Button>
        </div>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#eee5d9]">
        <div
          className="h-full rounded-full bg-[#1f5f55] transition-all"
          style={{ width: `${completion.percentage}%` }}
        />
      </div>
    </section>
  );
}
