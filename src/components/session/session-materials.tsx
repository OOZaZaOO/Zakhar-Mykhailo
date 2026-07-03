import { Badge } from "@/components/ui/badge";
import { materials } from "@/data/mock";

export function SessionMaterials() {
  return (
    <div className="rounded-3xl border border-[#ded5c8] bg-white p-5 shadow-sm">
      <h3 className="text-xl font-semibold">Materials and files</h3>
      <div className="mt-5 space-y-3">
        {materials.map((material) => (
          <div
            className="flex items-center justify-between gap-3 rounded-2xl border border-[#eee5d9] px-4 py-3"
            key={material}
          >
            <p className="text-sm font-semibold">{material}</p>
            <Badge
              variant="secondary"
              className="rounded-full bg-[#e5f0ee] px-3 py-1 text-xs font-bold text-[#1f5f55]"
            >
              Shared
            </Badge>
          </div>
        ))}
        <div className="rounded-2xl bg-[#1e2725] p-4 text-white">
          <p className="text-sm text-white/70">Archive status</p>
          <p className="mt-1 font-semibold">Preserved after completion</p>
        </div>
      </div>
    </div>
  );
}
