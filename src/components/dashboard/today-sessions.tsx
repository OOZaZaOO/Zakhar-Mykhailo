import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sessions } from "@/data/mock";

export function TodaySessions() {
  return (
    <Card className="gap-0 rounded-3xl border-[#ded5c8] bg-white p-0">
      <CardHeader className="flex flex-row items-center justify-between gap-4 px-5 pt-5">
        <div>
          <CardTitle className="text-xl">Upcoming sessions</CardTitle>
          <p className="mt-1 text-sm text-[#66736f]">
            Mock data for specialist view
          </p>
        </div>
        <Button variant="outline" className="rounded-full">
          Copy link
        </Button>
      </CardHeader>
      <CardContent className="px-5 pb-5">
        <div className="mt-5 space-y-3">
          {sessions.map((session) => (
            <article
              className="grid gap-3 rounded-2xl border border-[#eee5d9] p-4 sm:grid-cols-[1fr_auto]"
              key={`${session.client}-${session.time}`}
            >
              <div>
                <p className="font-semibold">{session.client}</p>
                <p className="mt-1 text-sm text-[#66736f]">
                  {session.service} · {session.time}
                </p>
              </div>
              <Badge className="h-fit rounded-full bg-[#eef1da] px-3 py-1 text-sm font-bold text-[#5d6b2f] hover:bg-[#eef1da]">
                {session.status}
              </Badge>
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
