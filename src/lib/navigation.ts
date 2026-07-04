import { isAccountType, type AccountType } from "@/lib/auth";

export type NavigationRole = AccountType;

export type NavigationItem =
  | {
      href: string;
      label: string;
      type: "link";
    }
  | {
      label: string;
      type: "logout";
    };

export const roleNavigation: Record<NavigationRole, NavigationItem[]> = {
  specialist: [
    { href: "/dashboard", label: "Dashboard", type: "link" },
    { href: "/dashboard/calendar", label: "Calendar", type: "link" },
    { href: "/dashboard/services", label: "Services", type: "link" },
    { href: "/dashboard/profile", label: "Profile", type: "link" },
    { href: "/dashboard/settings", label: "Settings", type: "link" },
    { href: "/dashboard/archive", label: "Archive", type: "link" },
    { href: "/profile/maya-sterling", label: "Public Profile", type: "link" },
    { label: "Log out", type: "logout" },
  ],
  client: [
    { href: "/dashboard/client", label: "Dashboard", type: "link" },
    { href: "/dashboard/client/sessions", label: "My Sessions", type: "link" },
    { href: "/dashboard/client/materials", label: "Materials", type: "link" },
    { href: "/dashboard/client/settings", label: "Settings", type: "link" },
    { label: "Log out", type: "logout" },
  ],
};

export function getNavigationRole(value: unknown): NavigationRole {
  return isAccountType(value) ? value : "specialist";
}

