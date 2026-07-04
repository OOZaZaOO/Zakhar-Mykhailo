"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { getDashboardPathForAccountType } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/profile/maya-sterling", label: "Demo" },
];

type HeaderUser = {
  accountType: unknown;
  name: string;
};

export function Header() {
  const pathname = usePathname();
  const [headerUser, setHeaderUser] = useState<HeaderUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setHeaderUser(
        user
          ? {
              accountType: user.user_metadata.account_type,
              name:
                user.user_metadata.full_name ||
                user.email ||
                "My profile",
            }
          : null,
      );
      setIsAuthLoading(false);
    }

    void loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;

      setHeaderUser(
        user
          ? {
              accountType: user.user_metadata.account_type,
              name:
                user.user_metadata.full_name ||
                user.email ||
                "My profile",
            }
          : null,
      );
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-[#ded5c8] bg-[#fffaf2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link className="text-xl font-semibold tracking-tight" href="/">
          BuyMyTime
        </Link>
        {!isAuthLoading && !headerUser ? (
          <nav className="hidden items-center gap-6 text-sm font-medium text-[#53615f] md:flex">
            {publicLinks.map((link) => (
              <Link
                className={cn(
                  "transition hover:text-[#1f5f55]",
                  !link.href.includes("#") &&
                    pathname === link.href &&
                    "text-[#1f5f55]",
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
        <div className="flex items-center gap-2">
          {headerUser ? (
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174a43]"
            >
              <Link href={getDashboardPathForAccountType(headerUser.accountType)}>
                <span className="hidden text-white/70 sm:inline">
                  Signed in
                </span>
                <span>{headerUser.name}</span>
              </Link>
            </Button>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                className={cn(
                  "rounded-full px-3 py-2 text-sm font-semibold text-[#33413f] sm:px-4",
                  pathname === "/login" && "bg-[#eef1da] text-[#1f5f55]",
                )}
                disabled={isAuthLoading}
              >
                <Link href="/login">Log in</Link>
              </Button>
              <Button
                asChild
                className="rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174a43]"
                disabled={isAuthLoading}
              >
                <Link href="/register">Start free</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
