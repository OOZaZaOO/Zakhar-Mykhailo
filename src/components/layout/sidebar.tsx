"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/auth/logout-button";
import type { NavigationItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

type SidebarProps = {
  items: NavigationItem[];
};

export function Sidebar({ items }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="border-b border-[#ded5c8] bg-[#fffaf2] lg:min-h-[calc(100vh-65px)] lg:border-b-0 lg:border-r">
      <nav className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-5 py-3 sm:px-8 lg:sticky lg:top-[65px] lg:block lg:w-64 lg:space-y-2 lg:px-4 lg:py-6">
        {items.map((item) => {
          if (item.type === "logout") {
            return (
              <div className="lg:pt-4" key={item.label}>
                <LogoutButton />
              </div>
            );
          }

          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              className={cn(
                "whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-[#53615f] transition hover:bg-white hover:text-[#1f5f55] lg:flex",
                isActive && "bg-white text-[#1f5f55] shadow-sm",
              )}
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
