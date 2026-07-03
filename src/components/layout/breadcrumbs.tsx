"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  calendar: "Calendar",
  services: "Services",
  settings: "Settings",
  archive: "Archive",
  profile: "Profile",
  book: "Book",
  session: "Session",
  login: "Login",
  register: "Register",
};

function formatSegment(segment: string) {
  return labelMap[segment] ?? segment.replaceAll("-", " ");
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  return (
    <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#66736f]">
      <Link className="font-medium hover:text-[#1f5f55]" href="/">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join("/")}`;
        const isLast = index === segments.length - 1;

        return (
          <span className="flex items-center gap-2" key={href}>
            <span>/</span>
            {isLast ? (
              <span className="capitalize text-[#1e2725]">
                {formatSegment(segment)}
              </span>
            ) : (
              <Link
                className="capitalize font-medium hover:text-[#1f5f55]"
                href={href}
              >
                {formatSegment(segment)}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
