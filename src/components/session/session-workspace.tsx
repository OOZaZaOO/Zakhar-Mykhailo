import { SessionChat } from "@/components/session/session-chat";
import { SessionFiles } from "@/components/session/session-files";
import { SessionMaterials } from "@/components/session/session-materials";
import { meetLink } from "@/data/mock";

export function SessionWorkspace() {
  return (
    <section
      className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]"
      id="workspace"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
          Session workspace
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal">
          Chat, files, materials, Meet link, and archive in one room.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#5a6865]">
          The MVP workspace is designed as the shared source of truth before,
          during, and after a paid session.
        </p>
        <div className="mt-6 rounded-2xl border border-[#ded5c8] bg-white p-5">
          <p className="text-sm font-bold text-[#7f8d5a]">Meet link</p>
          <p className="mt-2 break-words font-semibold">{meetLink}</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <SessionChat />
        <SessionMaterials />
        <SessionFiles />
      </div>
    </section>
  );
}
