import Link from "next/link";

import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services, specialist } from "@/data/mock";

export default function PublicProfilePage() {
  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardContent className="p-6">
            <div className="flex size-24 items-center justify-center rounded-3xl bg-[#1f5f55] text-3xl font-bold text-white">
              MS
            </div>
            <p className="mt-6 text-sm font-bold text-[#7f8d5a]">
              buymytime.app/{specialist.slug}
            </p>
            <h1 className="mt-2 text-4xl font-semibold">{specialist.name}</h1>
            <p className="mt-2 font-medium text-[#5a6865]">
              {specialist.title} · {specialist.timezone}
            </p>
            <p className="mt-5 leading-7 text-[#4d5c59]">{specialist.bio}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {specialist.tags.map((tag) => (
                <Badge
                  className="rounded-full bg-[#eef1da] px-3 py-1 text-sm font-bold text-[#59672c]"
                  key={tag}
                  variant="secondary"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-semibold">
                Choose a session type
              </h2>
            </div>
            <Button asChild className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
              <Link href={`/profile/${specialist.slug}/book`}>Book session</Link>
            </Button>
          </div>
          {services.map((service) => (
            <Card className="rounded-3xl border-[#ded5c8] bg-white" key={service.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{service.name}</CardTitle>
                    <p className="mt-2 text-sm leading-6 text-[#60706c]">
                      {service.description}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold text-[#9a4c2f]">
                    {service.price}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#7d8a86]">
                  {service.duration} · {service.format}
                </p>
                <Button asChild variant="outline" className="rounded-full">
                  <Link href={`/profile/${specialist.slug}/book`}>
                    Select service
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
