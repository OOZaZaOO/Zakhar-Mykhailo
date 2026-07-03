import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Header } from "@/components/layout/header";
import { Sidebar } from "@/components/layout/sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#1e2725]">
      <Header />
      <div className="lg:grid lg:grid-cols-[16rem_1fr]">
        <Sidebar />
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
