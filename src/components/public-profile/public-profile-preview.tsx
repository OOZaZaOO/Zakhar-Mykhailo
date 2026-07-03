import { BookingCard } from "@/components/public-profile/booking-card";
import { Badge } from "@/components/ui/badge";
import { specialist } from "@/data/mock";

export function PublicProfilePreview() {
  return (
    <section className="bg-[#fffaf2] px-5 py-12 sm:px-8" id="profile">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#ded5c8] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <div className="flex size-24 shrink-0 items-center justify-center rounded-3xl bg-[#1f5f55] text-3xl font-bold text-white">
              MS
            </div>
            <div>
              <p className="text-sm font-bold text-[#7f8d5a]">
                buymytime.app/{specialist.slug}
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                {specialist.name}
              </h2>
              <p className="mt-1 font-medium text-[#5a6865]">
                {specialist.title} · {specialist.timezone}
              </p>
              <p className="mt-4 max-w-2xl leading-7 text-[#4d5c59]">
                {specialist.bio}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {specialist.tags.map((tag) => (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-[#eef1da] px-3 py-1 text-sm font-bold text-[#59672c]"
                    key={tag}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>

        <BookingCard />
      </div>
    </section>
  );
}
