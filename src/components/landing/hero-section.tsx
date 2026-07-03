import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { services, specialist } from "@/data/mock";

export function HeroSection() {
  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:py-14">
      <div className="flex flex-col justify-center">
        <Badge
          variant="outline"
          className="mb-4 border-[#d2c6b6] bg-white/70 px-3 py-1 text-sm font-semibold text-[#9a4c2f]"
        >
          For independent professionals
        </Badge>
        <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-normal text-[#18211f] sm:text-6xl">
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
            <a href="#booking">Start free</a>
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
      </div>

      <div className="rounded-[2rem] border border-[#ddd2c1] bg-[#fffaf2] p-4 shadow-xl shadow-[#9c7d5520]">
        <div className="overflow-hidden rounded-[1.5rem] border border-[#e7ddcf] bg-white">
          <div className="grid gap-0 md:grid-cols-[0.8fr_1.2fr]">
            <div className="bg-[#c9663d] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex size-16 items-center justify-center rounded-2xl bg-white/20 text-2xl font-bold">
                  MS
                </div>
                <div>
                  <p className="text-sm text-white/75">Public profile</p>
                  <h2 className="text-2xl font-semibold">{specialist.name}</h2>
                </div>
              </div>
              <p className="mt-8 text-3xl font-semibold leading-tight">
                {specialist.title}
              </p>
              <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-white/70">Rating</p>
                  <p className="mt-1 text-xl font-semibold">
                    {specialist.rating}
                  </p>
                </div>
                <div className="rounded-2xl bg-white/15 p-4">
                  <p className="text-white/70">Sessions</p>
                  <p className="mt-1 text-xl font-semibold">
                    {specialist.sessions}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 border-b border-[#eee5d9] pb-5">
                <div>
                  <p className="text-sm font-semibold text-[#7f8d5a]">
                    Next available
                  </p>
                  <p className="mt-1 text-2xl font-semibold">Today 16:00</p>
                </div>
                <Button
                  asChild
                  className="rounded-full bg-[#1f5f55] px-4 py-2 text-sm font-bold text-white hover:bg-[#174a43]"
                >
                  <a href="#booking">Book</a>
                </Button>
              </div>
              <div className="mt-5 space-y-3">
                {services.map((service) => (
                  <Card
                    className="gap-0 rounded-2xl border-[#eadfce] p-0 shadow-none"
                    key={service.name}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{service.name}</h3>
                          <p className="mt-1 text-sm leading-6 text-[#60706c]">
                            {service.description}
                          </p>
                        </div>
                        <p className="whitespace-nowrap text-sm font-bold text-[#9a4c2f]">
                          {service.price}
                        </p>
                      </div>
                      <p className="mt-3 text-sm font-medium text-[#7d8a86]">
                        {service.duration}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
