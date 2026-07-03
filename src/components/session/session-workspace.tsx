import { SessionChat } from "@/components/session/session-chat";
import { SessionFiles } from "@/components/session/session-files";
import { SessionMaterials } from "@/components/session/session-materials";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { materials, meetLink, sessions } from "@/data/mock";

export function SessionWorkspace() {
  const session = sessions[0];

  return (
    <section
      className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:py-20"
      id="workspace"
    >
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
        <div>
          <Badge
            variant="outline"
            className="border-[#d2c6b6] bg-white/80 px-3 py-1 text-sm font-semibold text-[#9a4c2f]"
          >
            Session Workspace
          </Badge>
          <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[#18211f]">
            One room for the work before, during, and after a session.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#5a6865]">
            Every booking becomes a focused workspace with the meeting link,
            session context, chat, materials, files, and archive state.
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Session summary", "Meeting link", "Materials", "Archive"].map(
              (item) => (
                <div
                  className="rounded-2xl border border-[#ded5c8] bg-white p-4 text-sm font-semibold text-[#24312f]"
                  key={item}
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <Card className="rounded-[2rem] border-[#ddd2c1] bg-[#fffaf2] p-2 shadow-xl shadow-[#9c7d5520]">
          <div className="overflow-hidden rounded-[1.5rem] border border-[#e7ddcf] bg-white">
            <div className="border-b border-[#eee5d9] p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-bold text-[#7f8d5a]">
                    {session.time}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">
                    {session.service}
                  </h3>
                  <p className="mt-2 text-sm text-[#66736f]">
                    {session.client} · {session.payment}
                  </p>
                </div>
                <Badge className="w-fit rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
                  {session.status}
                </Badge>
              </div>
              <div className="mt-5 rounded-2xl bg-[#f7f3ec] p-4">
                <p className="text-sm font-bold text-[#7f8d5a]">Meeting link</p>
                <p className="mt-2 break-words text-sm font-semibold">
                  {meetLink}
                </p>
                <Button className="mt-4 rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
                  Join meeting
                </Button>
              </div>
            </div>
            <div className="grid gap-4 p-5 lg:grid-cols-2">
              <SessionChat />
              <div className="space-y-4">
                <SessionMaterials />
                <div className="rounded-3xl bg-[#1e2725] p-5 text-white">
                  <p className="text-sm text-white/70">Materials ready</p>
                  <p className="mt-2 text-2xl font-semibold">
                    {materials.length} shared
                  </p>
                </div>
              </div>
              <SessionFiles />
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
