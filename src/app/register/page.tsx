import Link from "next/link";

import { AuthShell } from "@/components/auth/auth-shell";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authProviders } from "@/data/mock";

export default function RegisterPage() {
  return (
    <PublicLayout showBreadcrumbs={false}>
      <AuthShell
        eyebrow="Create workspace"
        title="Set up the place where your client sessions will live."
        description="Start with a profile, services, and a clean workspace model. The current screen is a polished UI mock without real account creation."
      >
        <Card className="w-full max-w-xl rounded-[2rem] border-[#ded5c8] bg-white shadow-xl shadow-[#9c7d5520]">
          <CardHeader className="space-y-2">
            <CardTitle className="text-3xl">Create account</CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              Build the first specialist workspace preview in a few fields.
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

            <div>
              <Label>Name</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                readOnly
                value="Maya Sterling"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                readOnly
                value="maya@example.com"
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
              <Link href="/dashboard">Create account</Link>
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
