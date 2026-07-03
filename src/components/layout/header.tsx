"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const publicLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#faq", label: "FAQ" },
  { href: "/profile/maya-sterling", label: "Demo" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-[#ded5c8] bg-[#fffaf2]/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
        <Link className="text-xl font-semibold tracking-tight" href="/">
          BuyMyTime
        </Link>
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
        <div className="flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className={cn(
              "hidden rounded-full px-4 py-2 text-sm font-semibold text-[#33413f] sm:inline-flex",
              pathname === "/login" && "bg-[#eef1da] text-[#1f5f55]",
            )}
          >
            <Link href="/login">Log in</Link>
          </Button>
          <Button
            asChild
            className="rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#174a43]"
          >
            <Link href="/register">Start free</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
