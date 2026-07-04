import Link from "next/link";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessions } from "@/data/mock";

export default function ClientDashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Client dashboard
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Your session history
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            This temporary authenticated screen gives client accounts a clear
            landing place until the real client cabinet is implemented.
          </p>
        </div>
        <Badge className="w-fit rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
          Client account
        </Badge>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {["Upcoming session", "Shared materials", "Archived sessions"].map(
          (item) => (
            <Card className="rounded-2xl border-[#ded5c8] bg-white" key={item}>
              <CardContent className="p-5">
                <p className="text-sm font-bold text-[#24312f]">{item}</p>
              </CardContent>
            </Card>
          ),
        )}
      </div>

      <Card className="mt-6 rounded-3xl border-[#ded5c8] bg-white">
        <CardHeader>
          <CardTitle>Mock session workspaces</CardTitle>
          <p className="text-sm text-[#66736f]">
            Real client session access will use `client_profiles.user_id` after
            profile persistence is added.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {sessions.slice(0, 2).map((session) => (
            <article
              className="grid gap-3 rounded-2xl border border-[#eee5d9] p-4 sm:grid-cols-[1fr_auto]"
              key={session.id}
            >
              <div>
                <p className="font-semibold">{session.service}</p>
                <p className="mt-1 text-sm text-[#66736f]">{session.time}</p>
                <p className="mt-2 text-sm leading-6 text-[#5a6865]">
                  {session.note}
                </p>
              </div>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/session/${session.id}`}>Open workspace</Link>
              </Button>
            </article>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
