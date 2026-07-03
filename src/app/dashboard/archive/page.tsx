import Link from "next/link";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { archiveSessions } from "@/data/mock";

export default function ArchivePage() {
  return (
    <DashboardLayout>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
          Archive
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          Completed sessions
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
          Review past session history, preserved materials, and completed
          client work.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {archiveSessions.map((session) => (
          <Card className="rounded-3xl border-[#ded5c8] bg-white" key={session.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{session.client}</CardTitle>
                <Badge
                  className="rounded-full bg-[#e5f0ee] text-[#1f5f55] hover:bg-[#e5f0ee]"
                  variant="secondary"
                >
                  {session.status}
                </Badge>
              </div>
              <p className="text-sm text-[#66736f]">
                {session.service} · {session.date}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="rounded-2xl bg-[#f7f3ec] p-4 text-sm text-[#5a6865]">
                {session.materials} materials preserved with session history.
              </p>
              <Button asChild variant="outline" className="rounded-full">
                <Link href={`/session/${session.id}`}>Open archive</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
