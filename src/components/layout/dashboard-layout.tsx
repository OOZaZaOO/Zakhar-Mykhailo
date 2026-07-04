import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";
import { getNavigationRole, roleNavigation } from "@/lib/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const navigationRole = getNavigationRole(user?.user_metadata.account_type);
  const navigationItems = roleNavigation[navigationRole];

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#1e2725]">
      <Header />
      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        <Sidebar items={navigationItems} />
        <section className="px-5 py-8 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <Breadcrumbs />
            {children}
          </div>
        </section>
      </div>
    </main>
  );
}
