import Link from "next/link";

import { Button } from "@/components/ui/button";

type ProfileGatedEmptyStateProps = {
  title?: string;
};

export function ProfileGatedEmptyState({
  title = "Complete your profile to unlock this feature.",
}: ProfileGatedEmptyStateProps) {
  return (
    <div className="rounded-3xl border border-[#ded5c8] bg-white p-8 text-center shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
        Locked for now
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-normal text-[#24312f]">
        {title}
      </h1>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#66736f]">
        Finish the required profile setup fields to continue.
      </p>
      <Button
        asChild
        className="mt-6 rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
      >
        <Link href="/dashboard/profile">Go to Profile</Link>
      </Button>
    </div>
  );
}
