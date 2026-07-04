import Link from "next/link";
import { redirect } from "next/navigation";

import { SpecialistProfileForm } from "@/components/profile/specialist-profile-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getOwnSpecialistProfile,
  getProfileIdentityFromMetadata,
} from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DashboardProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const accountType = user.user_metadata.account_type;
  const isSpecialistAccount = accountType !== "client";

  const { data: profile, error } = isSpecialistAccount
    ? await getOwnSpecialistProfile(supabase, user.id)
    : { data: null, error: null };
  const identity = getProfileIdentityFromMetadata(user.user_metadata);

  return (
    <DashboardLayout>
      {isSpecialistAccount ? (
        <SpecialistProfileForm
          initialError={error?.message ?? null}
          initialProfile={profile}
          userFirstName={identity.firstName}
          userFullName={identity.fullName}
          userLastName={identity.lastName}
          userEmail={user.email ?? null}
          userId={user.id}
        />
      ) : (
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Specialist profile unavailable</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              This area is for specialist accounts. Client accounts use the
              client cabinet to view session history, materials, and archived
              workspaces.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/dashboard/client">Open client cabinet</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
