"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authProviders } from "@/data/mock";
import { getLoginPathForAccountType } from "@/lib/auth";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { data, error: signInError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (signInError) {
      setError(signInError.message);
      setIsLoading(false);
      return;
    }

    const accountPath = getLoginPathForAccountType(
      data.user.user_metadata.account_type,
    );
    const redirectPath =
      redirectedFrom?.startsWith("/") && !redirectedFrom.startsWith("//")
        ? redirectedFrom
        : accountPath;

    setSuccess("Logged in. Opening your workspace...");
    router.replace(redirectPath);
    router.refresh();
  }

  return (
    <PublicLayout showBreadcrumbs={false}>
      <AuthShell
        eyebrow="Welcome back"
        title="Pick up every session exactly where you left it."
        description="Open your workspace to review bookings, prepare materials, and continue client communication in the right session context."
        showBrandPanel={false}
      >
        <Card className="w-full max-w-xl rounded-[2rem] border-[#ded5c8] bg-white shadow-xl shadow-[#9c7d5520]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Log in</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              Supabase Auth is connected. Workspace data remains mocked until
              profile persistence is implemented.
            </p>
            <p className="rounded-2xl bg-[#f7f3ec] px-4 py-3 text-sm leading-6 text-[#5a6865]">
              Your workspace opens based on your account type.
            </p>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleLogin}>
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

            <div className="relative text-center text-sm text-[#7b8884]">
              <span className="relative z-10 bg-white px-3">or use email</span>
              <div className="absolute left-0 top-1/2 h-px w-full bg-[#eee5d9]" />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
                type="email"
                value={email}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                type="password"
                value={password}
              />
            </div>
            <div className="flex flex-col gap-3 text-sm text-[#66736f] sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 font-medium">
                <input
                  className="size-4 rounded border-[#d9ceb9]"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  type="checkbox"
                />
                Remember me
              </label>
              <Link className="font-semibold text-[#1f5f55]" href="/login">
                Forgot password
              </Link>
            </div>
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
              {isLoading ? "Logging in..." : "Log in"}
            </Button>
            <p className="text-center text-sm text-[#66736f]">
              New here?{" "}
              <Link
                className="font-semibold text-[#1f5f55]"
                href={
                  redirectedFrom
                    ? `/register?redirectedFrom=${encodeURIComponent(redirectedFrom)}`
                    : "/register"
                }
              >
                Create account
              </Link>
            </p>
            </form>
          </CardContent>
        </Card>
      </AuthShell>
    </PublicLayout>
  );
}
