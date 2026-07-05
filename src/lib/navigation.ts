import { isAccountType, type AccountType } from "@/lib/auth";
import {
  canAccessProfileFeature,
  type ProfileCompletion,
  type ProfileGatedFeature,
} from "@/lib/profile/completion";

export type NavigationRole = AccountType;

export type NavigationItem =
  | {
      href: string;
      disabled?: boolean;
      disabledReason?: string;
      feature?: ProfileGatedFeature;
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
    {
      feature: "calendar",
      href: "/dashboard/calendar",
      label: "Calendar",
      type: "link",
    },
    {
      feature: "services",
      href: "/dashboard/services",
      label: "Services",
      type: "link",
    },
    { href: "/dashboard/profile", label: "Profile", type: "link" },
    { href: "/dashboard/settings", label: "Settings", type: "link" },
    { href: "/dashboard/archive", label: "Archive", type: "link" },
    {
      feature: "publicProfile",
      href: "/profile/maya-sterling",
      label: "Public Profile",
      type: "link",
    },
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

export function getNavigationItems({
  completion,
  profileSlug,
  role,
}: {
  completion?: ProfileCompletion;
  profileSlug?: string | null;
  role: NavigationRole;
}) {
  return roleNavigation[role].map((item) => {
    if (item.type !== "link") {
      return item;
    }

    const href =
      item.feature === "publicProfile" && profileSlug
        ? `/profile/${profileSlug}`
        : item.href;
    const isDisabled =
      role === "specialist" &&
      completion &&
      item.feature &&
      !canAccessProfileFeature(completion, item.feature);

    return {
      ...item,
      disabled: Boolean(isDisabled),
      disabledReason: isDisabled
        ? "Complete your profile to unlock this feature."
        : undefined,
      href,
    };
  });
}
