"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authProviders } from "@/data/mock";
import {
  type AccountType,
  getDashboardPathForAccountType,
} from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const accountTypes = {
  specialist: {
    label: "Specialist",
    description:
      "I provide services and want to manage bookings, sessions and clients.",
    eyebrow: "Create specialist workspace",
    title: "Build the workspace where your client sessions will live.",
    body: "Set up a specialist account to manage services, bookings, session workspaces, materials, and client communication.",
    button: "Create specialist account",
    emailPlaceholder: "john@example.com",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Smith",
  },
  client: {
    label: "Client",
    description:
      "I book sessions and want access to my session history and materials.",
    eyebrow: "Create client account",
    title: "Create a calm place for every session you book.",
    body: "Set up a client account to access your session history, archived sessions, materials, files, and workspace updates.",
    button: "Create client account",
    emailPlaceholder: "john@example.com",
    firstNamePlaceholder: "John",
    lastNamePlaceholder: "Smith",
  },
} as const satisfies Record<
  AccountType,
  {
    label: string;
    description: string;
    eyebrow: string;
    title: string;
    body: string;
    button: string;
    emailPlaceholder: string;
    firstNamePlaceholder: string;
    lastNamePlaceholder: string;
  }
>;

function getPasswordStrength(password: string) {
  if (!password) {
    return {
      color: "bg-[#eee5d9]",
      label: "Enter password",
      score: 0,
      textColor: "text-[#7d8a86]",
    };
  }

  let score = 0;

  if (password.length >= 8) {
    score += 1;
  }

  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  }

  if (/\d/.test(password)) {
    score += 1;
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1;
  }

  if (score <= 1) {
    return {
      color: "bg-[#d66b4d]",
      label: "Weak",
      score: 1,
      textColor: "text-[#9a4c2f]",
    };
  }

  if (score === 2) {
    return {
      color: "bg-[#d9a441]",
      label: "Fair",
      score: 2,
      textColor: "text-[#9a6a1f]",
    };
  }

  if (score === 3) {
    return {
      color: "bg-[#a9b66f]",
      label: "Good",
      score: 3,
      textColor: "text-[#5d6b2f]",
    };
  }

  return {
    color: "bg-[#1f5f55]",
    label: "Strong",
    score: 4,
    textColor: "text-[#1f5f55]",
  };
}

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>("specialist");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedAccountType = accountTypes[accountType];
  const passwordStrength = getPasswordStrength(password);

  function handleAccountTypeChange(nextAccountType: AccountType) {
    setAccountType(nextAccountType);
    setError(null);
    setSuccess(null);
  }

  async function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const fullName = `${trimmedFirstName} ${trimmedLastName}`.trim();

    if (!trimmedFirstName) {
      setError("First name is required.");
      return;
    }

    if (!trimmedLastName) {
      setError("Last name is required.");
      return;
    }

    if (!acceptedTerms) {
      setError("Please accept the prototype terms before creating an account.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          account_type: accountType,
          first_name: trimmedFirstName,
          full_name: fullName,
          last_name: trimmedLastName,
        },
        emailRedirectTo: redirectTo,
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setIsLoading(false);
      return;
    }

    setSuccess("Account created. Opening your workspace...");
    router.replace(getDashboardPathForAccountType(accountType));
    router.refresh();
  }

  return (
    <PublicLayout showBreadcrumbs={false}>
      <AuthShell
        eyebrow={selectedAccountType.eyebrow}
        title={selectedAccountType.title}
        description={`${selectedAccountType.body} Profile data remains mocked until profile setup is implemented.`}
        showBrandPanel={false}
      >
        <Card className="w-full max-w-xl rounded-[2rem] border-[#ded5c8] bg-white shadow-xl shadow-[#9c7d5520]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Create account</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              {selectedAccountType.body}
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleRegister}>
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
                      onClick={() =>
                        handleAccountTypeChange(key as AccountType)
                      }
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
                  type="button"
                  variant="outline"
                >
                  {provider}
                </Button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>First name</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder={selectedAccountType.firstNamePlaceholder}
                  value={firstName}
                />
              </div>
              <div>
                <Label>Last name</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder={selectedAccountType.lastNamePlaceholder}
                  value={lastName}
                />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                onChange={(event) => setEmail(event.target.value)}
                placeholder={selectedAccountType.emailPlaceholder}
                type="email"
                value={email}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Password</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Create a secure password"
                  type="password"
                  value={password}
                />
              </div>
              <div>
                <Label>Confirm password</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  type="password"
                  value={confirmPassword}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#24312f]">
                  Password strength
                </span>
                <span className={`font-semibold ${passwordStrength.textColor}`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="mt-2 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    className={`h-2 rounded-full ${
                      item <= passwordStrength.score
                        ? passwordStrength.color
                        : "bg-[#eee5d9]"
                    }`}
                    key={item}
                  />
                ))}
              </div>
              <p className="mt-2 text-xs leading-5 text-[#66736f]">
                Use at least 8 characters with uppercase, lowercase, a number,
                and a symbol.
              </p>
            </div>
            <label className="flex items-start gap-3 rounded-2xl bg-[#f7f3ec] p-4 text-sm leading-6 text-[#5a6865]">
              <input
                className="mt-1 size-4 rounded border-[#d9ceb9]"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                type="checkbox"
              />
              <span>
                I understand this creates an auth account only. Profile setup
                and account data storage will be implemented later.
              </span>
            </label>
            {error ? (
              <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm font-medium leading-6 text-[#9a4c2f]">
                {error}
              </p>
            ) : null}
            {success ? (
              <p className="rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
                {success}
              </p>
            ) : null}
            <Button
              className="h-12 w-full rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Creating account..." : selectedAccountType.button}
            </Button>
            <p className="text-center text-sm text-[#66736f]">
              Already have an account?{" "}
              <Link className="font-semibold text-[#1f5f55]" href="/login">
                Log in
              </Link>
            </p>
            </form>
          </CardContent>
        </Card>
      </AuthShell>
    </PublicLayout>
  );
}
