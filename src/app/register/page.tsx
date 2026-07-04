"use client";

import Link from "next/link";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authProviders } from "@/data/mock";

const accountTypes = {
  specialist: {
    label: "Specialist",
    description:
      "I provide services and want to manage bookings, sessions and clients.",
    eyebrow: "Create specialist workspace",
    title: "Build the workspace where your client sessions will live.",
    body: "Set up a specialist account to manage services, bookings, session workspaces, materials, and client communication.",
    name: "Maya Sterling",
    email: "maya@example.com",
    button: "Create specialist account",
  },
  client: {
    label: "Client",
    description:
      "I book sessions and want access to my session history and materials.",
    eyebrow: "Create client account",
    title: "Create a calm place for every session you book.",
    body: "Set up a client account to access your session history, archived sessions, materials, files, and workspace updates.",
    name: "Nina Park",
    email: "nina@example.com",
    button: "Create client account",
  },
} as const;

type AccountType = keyof typeof accountTypes;

export default function RegisterPage() {
  const [accountType, setAccountType] = useState<AccountType>("specialist");
  const selectedAccountType = accountTypes[accountType];

  return (
    <PublicLayout showBreadcrumbs={false}>
      <AuthShell
        eyebrow={selectedAccountType.eyebrow}
        title={selectedAccountType.title}
        description={`${selectedAccountType.body} The current screen is a polished UI mock without real account creation.`}
      >
        <Card className="w-full max-w-xl rounded-[2rem] border-[#ded5c8] bg-white shadow-xl shadow-[#9c7d5520]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Create account</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              {selectedAccountType.body}
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3">
              <Label>Account type</Label>
              <div className="grid gap-3">
                {Object.entries(accountTypes).map(([key, option]) => {
                  const isSelected = accountType === key;

                  return (
                    <button
                      className={`rounded-3xl border p-4 text-left transition ${
                        isSelected
                          ? "border-[#1f5f55] bg-[#eef5f1] shadow-sm"
                          : "border-[#d9ceb9] bg-white hover:bg-[#f7f3ec]"
                      }`}
                      key={key}
                      onClick={() => setAccountType(key as AccountType)}
                      type="button"
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex size-4 items-center justify-center rounded-full border ${
                            isSelected
                              ? "border-[#1f5f55]"
                              : "border-[#b8aa96]"
                          }`}
                        >
                          {isSelected ? (
                            <span className="size-2 rounded-full bg-[#1f5f55]" />
                          ) : null}
                        </span>
                        <span className="font-semibold text-[#24312f]">
                          {option.label}
                        </span>
                      </span>
                      <span className="mt-2 block pl-7 text-sm leading-6 text-[#66736f]">
                        {option.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {authProviders.map((provider) => (
                <Button
                  className="rounded-full border-[#d9ceb9]"
                  key={provider}
                  variant="outline"
                >
                  {provider}
                </Button>
              ))}
            </div>

            <div>
              <Label>Name</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                readOnly
                value={selectedAccountType.name}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                readOnly
                value={selectedAccountType.email}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Password</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  readOnly
                  type="password"
                  value="workspace"
                />
              </div>
              <div>
                <Label>Confirm password</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  readOnly
                  type="password"
                  value="workspace"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#24312f]">
                  Password strength
                </span>
                <span className="font-semibold text-[#5d6b2f]">Strong</span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    className="h-2 rounded-full bg-[#a9b66f]"
                    key={item}
                  />
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-2xl bg-[#f7f3ec] p-4 text-sm leading-6 text-[#5a6865]">
              <input
                className="mt-1 size-4 rounded border-[#d9ceb9]"
                type="checkbox"
              />
              <span>
                I agree to use this as a UI-only prototype until authentication
                and account storage are implemented.
              </span>
            </label>
            <Button
              asChild
              className="h-12 w-full rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/dashboard">{selectedAccountType.button}</Link>
            </Button>
            <p className="text-center text-sm text-[#66736f]">
              Already have an account?{" "}
              <Link className="font-semibold text-[#1f5f55]" href="/login">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </AuthShell>
    </PublicLayout>
  );
}
