import Link from "next/link";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Welcome back
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-[#18211f]">
            Open your client workspace.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#5a6865]">
            Sign in to review bookings, prepare sessions, share materials, and
            keep client work organized in one place.
          </p>
        </div>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Sign in</CardTitle>
            <p className="text-sm text-[#66736f]">
              Mock form only. Authentication is not implemented yet.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                readOnly
                value="maya@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                readOnly
                type="password"
                value="workspace"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-[#66736f]">
              <span>Remember me</span>
              <Link className="font-semibold text-[#1f5f55]" href="/register">
                Forgot password
              </Link>
            </div>
            <Button className="w-full rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
              Sign in
            </Button>
            <p className="text-center text-sm text-[#66736f]">
              New here?{" "}
              <Link className="font-semibold text-[#1f5f55]" href="/register">
                Create account
              </Link>
            </p>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
