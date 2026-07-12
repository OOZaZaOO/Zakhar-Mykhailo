import {
  Breadcrumbs,
  type BreadcrumbItem,
} from "@/components/layout/breadcrumbs";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getNavigationItems, getNavigationRole } from "@/lib/navigation";
import { getProfileCompletion } from "@/lib/profile/completion";
import { getOwnSpecialistProfile } from "@/lib/profile/service";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DashboardLayout({
  children,
  breadcrumbs,
}: {
  breadcrumbs?: BreadcrumbItem[];
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const navigationRole = getNavigationRole(user?.user_metadata.account_type);
  const { data: profile } =
    user && navigationRole === "specialist"
      ? await getOwnSpecialistProfile(supabase, user.id)
      : { data: null };
  const completion =
    navigationRole === "specialist"
      ? getProfileCompletion(profile)
      : undefined;
  const navigationItems = getNavigationItems({
    completion,
    profileSlug: profile?.slug,
    role: navigationRole,
  });

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#1e2725]">
      <Header />
      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        <Sidebar items={navigationItems} />
        <section className="px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs items={breadcrumbs} />
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
