import Link from "next/link";

import { PublicLayout } from "@/components/layout/public-layout";
import { SessionChat } from "@/components/session/session-chat";
import { SessionMaterials } from "@/components/session/session-materials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { meetLink, sessions } from "@/data/mock";

export default function SessionPage() {
  const session = sessions[0];

  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
              Session workspace
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-normal">
              {session.service}
            </h1>
            <p className="mt-3 text-base leading-7 text-[#5a6865]">
              A shared workspace for one booked client session.
            </p>
          </div>

          <Card className="rounded-3xl border-[#ded5c8] bg-white">
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{session.client}</CardTitle>
                <Badge className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
                  {session.status}
                </Badge>
              </div>
              <p className="text-sm text-[#66736f]">
                {session.time} · {session.payment}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="rounded-2xl bg-[#f7f3ec] p-4 text-sm leading-6 text-[#5a6865]">
                {session.note}
              </p>
              <div className="rounded-2xl border border-[#ded5c8] bg-white p-4">
                <p className="text-sm font-bold text-[#7f8d5a]">Meeting link</p>
                <p className="mt-2 break-words font-semibold">{meetLink}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
                  Join meeting
                </Button>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/dashboard/archive">Archive session</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <SessionChat />
          <SessionMaterials />
        </div>
      </section>
    </PublicLayout>
  );
}
