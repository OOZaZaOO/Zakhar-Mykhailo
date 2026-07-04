import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default function SupabaseDevPage() {
  let status = "Supabase connected ✅";
  let error: string | null = null;

  try {
    createSupabaseServerClient();
  } catch (caughtError) {
    status = "Supabase initialization failed";
    error =
      caughtError instanceof Error
        ? caughtError.message
        : "Unknown Supabase initialization error";
  }

  return (
    <DashboardLayout>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
          Developer check
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          Supabase foundation
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
          This page only verifies that the Supabase client can initialize with
          the configured environment variables. It does not create tables,
          authenticate users, or read application data.
        </p>
      </div>

      <Card className="mt-8 rounded-3xl border-[#ded5c8] bg-white">
        <CardHeader>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle>Connection status</CardTitle>
            <Badge
              className={
                error
                  ? "w-fit rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]"
                  : "w-fit rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]"
              }
            >
              {error ? "Error" : "Ready"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold">{status}</p>
          {error ? (
            <pre className="mt-4 overflow-x-auto rounded-2xl bg-[#f7f3ec] p-4 text-sm text-[#9a4c2f]">
              {error}
            </pre>
          ) : (
            <p className="mt-3 text-sm leading-6 text-[#5a6865]">
              Environment variables were found and a Supabase server client was
              created successfully.
            </p>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
