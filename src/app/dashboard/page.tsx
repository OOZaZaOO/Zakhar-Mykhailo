import Link from "next/link";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { ProfileCompletionCard } from "@/components/onboarding/profile-completion-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, sessions } from "@/data/mock";
import { getProfileCompletion } from "@/lib/profile/completion";
import { getOwnSpecialistProfile } from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await getOwnSpecialistProfile(supabase, user.id)
    : { data: null };
  const completion = getProfileCompletion(profile);
  const publicProfileHref = profile?.slug
    ? `/profile/${profile.slug}`
    : "/dashboard/profile";

  return (
    <DashboardLayout>
      <ProfileCompletionCard completion={completion} />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Specialist dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Today&apos;s client work
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            Review sessions, prepare materials, and open the workspace for the
            next client interaction.
          </p>
        </div>
        {completion.isComplete ? (
          <Button
            asChild
            className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
          >
            <Link href={publicProfileHref}>View public profile</Link>
          </Button>
        ) : (
          <Button
            className="rounded-full"
            disabled
            title="Complete your profile first."
          >
            View public profile
          </Button>
        )}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {dashboardStats.map((stat) => (
          <Card className="rounded-2xl border-[#ded5c8] bg-white" key={stat}>
            <CardContent className="p-5">
              <p className="text-sm font-bold text-[#24312f]">{stat}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Today&apos;s sessions</CardTitle>
            <p className="text-sm text-[#66736f]">
              Mock sessions with direct workspace links.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {sessions.map((session) => (
              <article
                className="grid gap-3 rounded-2xl border border-[#eee5d9] p-4 sm:grid-cols-[1fr_auto]"
                key={session.id}
              >
                <div>
                  <p className="font-semibold">{session.client}</p>
                  <p className="mt-1 text-sm text-[#66736f]">
                    {session.service} · {session.time}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[#5a6865]">
                    {session.note}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Badge className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
                    {session.status}
                  </Badge>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link href={`/session/${session.id}`}>Open</Link>
                  </Button>
                </div>
              </article>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
