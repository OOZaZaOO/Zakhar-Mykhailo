"use client";

import { Bell, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { recentBookings } from "@/data/mock";
import {
  getTemporaryAvatarPreview,
  subscribeToTemporaryAvatarPreview,
} from "@/lib/avatar-preview-store";
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
  avatarUrl: string | null;
  name: string;
};

function getInitials(value: string) {
  return value
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Header() {
  const pathname = usePathname();
  const [headerUser, setHeaderUser] = useState<HeaderUser | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [temporaryAvatarUrl, setTemporaryAvatarUrl] = useState(
    () => getTemporaryAvatarPreview().previewUrl,
  );

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: profile } = user
        ? await supabase
            .from("specialist_profiles")
            .select("avatar_url,display_name")
            .eq("user_id", user.id)
            .maybeSingle()
        : { data: null };

      setHeaderUser(
        user
          ? {
              accountType: user.user_metadata.account_type,
              avatarUrl: profile?.avatar_url ?? null,
              name:
                profile?.display_name ||
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

      if (!user) {
        setHeaderUser(null);
        setIsAuthLoading(false);
        return;
      }

      setHeaderUser({
        accountType: user.user_metadata.account_type,
        avatarUrl: null,
        name: user.user_metadata.full_name || user.email || "My profile",
      });
      setIsAuthLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    return subscribeToTemporaryAvatarPreview((preview) => {
      setTemporaryAvatarUrl(preview.previewUrl);
    });
  }, []);

  const avatarUrl = temporaryAvatarUrl || headerUser?.avatarUrl || null;

  return (
    <header className="sticky top-0 z-30 border-b border-[#ded5c8] bg-[#fffaf2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
        <Link
          className="shrink-0 text-xl font-semibold tracking-tight"
          href={
            headerUser
              ? getDashboardPathForAccountType(headerUser.accountType)
              : "/"
          }
        >
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
        <div className="flex min-w-0 items-center gap-2">
          {headerUser ? (
            <>
              <div className="relative">
                <Button
                  aria-expanded={isNotificationsOpen}
                  aria-label="Notifications"
                  className="relative size-10 rounded-full border border-[#ded5c8] bg-white p-0 text-[#33413f] shadow-sm hover:bg-[#f7f3ec]"
                  onClick={() =>
                    setIsNotificationsOpen((currentValue) => !currentValue)
                  }
                  type="button"
                  variant="ghost"
                >
                  <Bell className="size-4" />
                  <span className="absolute right-2 top-2 size-2 rounded-full bg-[#9a4c2f]" />
                </Button>

                {isNotificationsOpen ? (
                  <div className="absolute right-0 top-12 w-[calc(100vw-2.5rem)] max-w-sm rounded-2xl border border-[#ded5c8] bg-white p-3 text-left shadow-xl sm:w-80">
                    <div className="flex items-center justify-between gap-3 px-1 pb-2">
                      <div>
                        <p className="text-sm font-semibold text-[#24312f]">
                          Notifications
                        </p>
                        <p className="text-xs text-[#66736f]">
                          Latest workspace updates
                        </p>
                      </div>
                      <Button
                        aria-label="Close notifications"
                        className="size-8 rounded-full p-0"
                        onClick={() => setIsNotificationsOpen(false)}
                        type="button"
                        variant="ghost"
                      >
                        <X className="size-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {recentBookings.map((item) => (
                        <div
                          className="rounded-xl bg-[#f7f3ec] p-3 text-sm font-medium leading-5 text-[#4f5f5b]"
                          key={item}
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              <Button
                asChild
                className="min-w-0 rounded-full bg-[#1f5f55] px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174a43] sm:px-4"
              >
                <Link
                  className="min-w-0"
                  href={getDashboardPathForAccountType(
                    headerUser.accountType,
                  )}
                >
                  <span className="hidden text-white/70 sm:inline">
                    Signed in
                  </span>
                  <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/20 text-xs font-bold text-white">
                    {avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        alt=""
                        className="size-full object-cover"
                        src={avatarUrl}
                      />
                    ) : (
                      getInitials(headerUser.name)
                    )}
                  </span>
                  <span className="block max-w-28 truncate sm:max-w-44">
                    {headerUser.name}
                  </span>
                </Link>
              </Button>
            </>
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
