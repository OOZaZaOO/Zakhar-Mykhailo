export const accountTypes = ["specialist", "client"] as const;

export type AccountType = (typeof accountTypes)[number];

export function isAccountType(value: unknown): value is AccountType {
  return value === "specialist" || value === "client";
}

export function getDashboardPathForAccountType(value: unknown) {
  return value === "client" ? "/dashboard/client" : "/dashboard/profile";
}
