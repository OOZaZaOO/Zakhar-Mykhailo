import Link from "next/link";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-12 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Start free
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal text-[#18211f]">
            Create a workspace around your client sessions.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#5a6865]">
            Set up a profile, define services, and preview how clients will
            book and access their session workspace.
          </p>
        </div>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Create account</CardTitle>
            <p className="text-sm text-[#66736f]">
              Mock form only. Account creation is not connected yet.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Name</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                readOnly
                value="Maya Sterling"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                readOnly
                value="maya@example.com"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Password</Label>
                <Input
                  className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                  readOnly
                  type="password"
                  value="workspace"
                />
              </div>
              <div>
                <Label>Confirm password</Label>
                <Input
                  className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                  readOnly
                  type="password"
                  value="workspace"
                />
              </div>
            </div>
            <p className="rounded-2xl bg-[#f7f3ec] p-4 text-sm text-[#5a6865]">
              By continuing, the specialist agrees to use this as a UI-only
              prototype until authentication is added.
            </p>
            <Button
              asChild
              className="w-full rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
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
      </section>
    </PublicLayout>
  );
}
