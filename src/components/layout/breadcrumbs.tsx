"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export type BreadcrumbItem = {
  href?: string;
  label: string;
};

const labelMap: Record<string, string> = {
  dashboard: "Dashboard",
  calendar: "Calendar",
  services: "Services",
  settings: "Settings",
  archive: "Archive",
  profile: "Profile",
  "public-profile": "Public Profile",
  book: "Book",
  session: "Session",
  login: "Login",
  register: "Register",
};

function formatSegment(segment: string) {
  return labelMap[segment] ?? segment.replaceAll("-", " ");
}

export function Breadcrumbs({
  items,
}: {
  items?: BreadcrumbItem[];
}) {
  const pathname = usePathname();

  if (items && items.length > 0) {
    return (
      <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-[#66736f]">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <span className="flex items-center gap-2" key={`${item.label}-${index}`}>
              {index > 0 ? <span>/</span> : null}
              {isLast || !item.href ? (
                <span className="capitalize text-[#1e2725]">{item.label}</span>
              ) : (
                <Link className="font-medium hover:text-[#1f5f55]" href={item.href}>
                  {item.label}
                </Link>
              )}
            </span>
          );
        })}
      </nav>
    );
  }

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
