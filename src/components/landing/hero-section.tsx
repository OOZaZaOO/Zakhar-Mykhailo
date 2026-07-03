import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardStats, recentBookings, sessions } from "@/data/mock";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-5 py-14 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <Badge
            variant="outline"
            className="border-[#d2c6b6] bg-white/80 px-3 py-1 text-sm font-semibold text-[#9a4c2f]"
          >
            For independent professionals
          </Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.02] tracking-normal text-[#18211f] sm:text-6xl lg:text-7xl">
            One workspace for every client. Every session.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#53615f]">
            Manage bookings, payments, session notes, materials, meeting links
            and client communication from one simple workspace.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full bg-[#1f5f55] px-6 text-sm font-bold text-white shadow-sm hover:bg-[#174a43]"
            >
              <Link href="/register">Start free</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 rounded-full border-[#cfc3b1] bg-white px-6 text-sm font-bold text-[#24312f] hover:border-[#a9b66f]"
            >
              <a href="#workspace">See demo</a>
            </Button>
          </div>
          <div className="mt-8 grid max-w-xl grid-cols-3 gap-3 text-sm">
            {dashboardStats.map((stat) => (
              <div
                className="rounded-2xl border border-[#ded5c8] bg-white/80 p-4"
                key={stat}
              >
                <p className="font-bold text-[#24312f]">{stat}</p>
              </div>
            ))}
          </div>
        </div>

        <Card className="rounded-[2rem] border-[#ddd2c1] bg-[#fffaf2] p-2 shadow-xl shadow-[#9c7d5520]">
          <div className="overflow-hidden rounded-[1.5rem] border border-[#e7ddcf] bg-white">
            <div className="border-b border-[#eee5d9] bg-[#1e2725] p-5 text-white">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/65">Workspace dashboard</p>
                  <h2 className="mt-1 text-2xl font-semibold">
                    Today&apos;s client work
                  </h2>
                </div>
                <Badge className="rounded-full bg-[#a9b66f] text-[#1e2725] hover:bg-[#a9b66f]">
                  Live mock
                </Badge>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["3 sessions", "5 files", "2 notes"].map((item) => (
                  <div className="rounded-2xl bg-white/10 p-3" key={item}>
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#7f8d5a]">
                      Next session
                    </p>
                    <p className="mt-1 text-xl font-semibold">
                      {sessions[0].time}
                    </p>
                  </div>
                  <Button
                    asChild
                    className="rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-bold text-white hover:bg-[#174a43]"
                  >
                    <Link href={`/session/${sessions[0].id}`}>Open</Link>
                  </Button>
                </div>
                <div className="mt-5 space-y-3">
                  {sessions.slice(0, 3).map((session) => (
                    <div
                      className="rounded-2xl border border-[#eadfce] p-4"
                      key={session.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold">{session.client}</p>
                          <p className="mt-1 text-sm text-[#60706c]">
                            {session.service}
                          </p>
                        </div>
                        <Badge
                          className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]"
                          variant="secondary"
                        >
                          {session.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#eee5d9] bg-[#f7f3ec] p-5 lg:border-l lg:border-t-0">
                <CardHeader className="px-0 pt-0">
                  <CardTitle className="text-lg">Activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-0 pb-0">
                  {recentBookings.map((item) => (
                    <div
                      className="rounded-2xl bg-white p-4 text-sm leading-6 text-[#4f5f5b]"
                      key={item}
                    >
                      {item}
                    </div>
                  ))}
                </CardContent>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
