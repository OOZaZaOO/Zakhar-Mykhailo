import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authProviders } from "@/data/mock";

export default function LoginPage() {
  return (
    <PublicLayout showBreadcrumbs={false}>
      <AuthShell
        eyebrow="Welcome back"
        title="Pick up every session exactly where you left it."
        description="Open your workspace to review bookings, prepare materials, and continue client communication in the right session context."
      >
        <Card className="w-full max-w-xl rounded-[2rem] border-[#ded5c8] bg-white shadow-xl shadow-[#9c7d5520]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Sign in</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              UI-only authentication preview. No credentials are submitted.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
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

            <div className="relative text-center text-sm text-[#7b8884]">
              <span className="relative z-10 bg-white px-3">or use email</span>
              <div className="absolute left-0 top-1/2 h-px w-full bg-[#eee5d9]" />
            </div>

            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                readOnly
                value="maya@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                readOnly
                type="password"
                value="workspace"
              />
            </div>
            <div className="flex flex-col gap-3 text-sm text-[#66736f] sm:flex-row sm:items-center sm:justify-between">
              <label className="flex items-center gap-2 font-medium">
                <input
                  className="size-4 rounded border-[#d9ceb9]"
                  type="checkbox"
                />
                Remember me
              </label>
              <Link className="font-semibold text-[#1f5f55]" href="/login">
                Forgot password
              </Link>
            </div>
            <Button
              asChild
              className="h-12 w-full rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/dashboard">Sign in</Link>
            </Button>
            <p className="text-center text-sm text-[#66736f]">
              New here?{" "}
              <Link className="font-semibold text-[#1f5f55]" href="/register">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </AuthShell>
    </PublicLayout>
  );
}
