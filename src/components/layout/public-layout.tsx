import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PublicHeader } from "@/components/layout/public-header";

export function PublicLayout({
  children,
  showBreadcrumbs = false,
}: {
  children: React.ReactNode;
  showBreadcrumbs?: boolean;
}) {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#1e2725]">
      <PublicHeader />
      {showBreadcrumbs ? (
        <div className="mx-auto max-w-7xl px-5 pt-6 sm:px-8">
          <Breadcrumbs />
        </div>
      ) : null}
      {children}
    </main>
  );
}
