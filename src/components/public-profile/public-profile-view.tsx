import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatServicePrice } from "@/lib/services/service";
import type { Service } from "@/lib/services/types";
import type { SpecialistProfile } from "@/lib/profile/types";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getServiceBadge(service: Service) {
  if (service.is_monthly_subscription) {
    return "Monthly";
  }

  return service.service_type === "package" ? "Package" : "One-time";
}

function getPublicServiceSummary(service: Service) {
  const price = formatServicePrice(service.price_amount, service.currency);
  const serviceType = service.service_type ?? "one_time";

  if (serviceType === "one_time") {
    return {
      detail: `${service.duration_minutes} min · ${service.format}`,
      priceLabel: `${price} per session`,
    };
  }

  const sessionsCount = service.sessions_count ?? 0;
  const sessionsPerWeek = service.sessions_per_week ?? 0;
  const validityWeeks = service.is_monthly_subscription
    ? 4
    : service.package_validity_weeks ?? 0;

  return {
    detail: service.is_monthly_subscription
      ? `${sessionsCount} sessions/month · ${sessionsPerWeek}/week · 4-week schedule`
      : `${sessionsCount} sessions · ${sessionsPerWeek}/week · valid for ${validityWeeks} weeks`,
    priceLabel: service.is_monthly_subscription ? `${price}/month` : `${price} total`,
  };
}

export function PublicProfileView({
  profile,
  services,
}: {
  profile: SpecialistProfile;
  services: Service[];
}) {
  const canBook = profile.is_accepting_bookings;
  const hasServices = services.length > 0;
  const canStartBooking = canBook && hasServices;

  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
      <Card className="rounded-3xl border-[#ded5c8] bg-white">
        <CardContent className="p-6">
          <div className="flex size-24 items-center justify-center rounded-3xl bg-[#1f5f55] text-3xl font-bold text-white">
            {getInitials(profile.display_name)}
          </div>
          <p className="mt-6 text-sm font-bold text-[#7f8d5a]">
            buymytime.app/{profile.slug}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
              {profile.visibility}
            </Badge>
            <Badge
              className={
                canBook
                  ? "rounded-full bg-[#e5f3ef] text-[#1f5f55] hover:bg-[#e5f3ef]"
                  : "rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]"
              }
            >
              {canBook ? "Accepting bookings" : "Bookings paused"}
            </Badge>
          </div>
          <h1 className="mt-3 text-4xl font-semibold">
            {profile.display_name}
          </h1>
          <p className="mt-2 font-medium text-[#5a6865]">
            {profile.profession} · {profile.timezone}
          </p>
          {profile.bio ? (
            <p className="mt-5 leading-7 text-[#4d5c59]">{profile.bio}</p>
          ) : null}
          {profile.languages.length > 0 ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {profile.languages.map((language) => (
                <Badge
                  className="rounded-full bg-[#eef1da] px-3 py-1 text-sm font-bold text-[#59672c]"
                  key={language}
                  variant="secondary"
                >
                  {language}
                </Badge>
              ))}
            </div>
          ) : null}
          {profile.working_rules ? (
            <div className="mt-6 rounded-2xl bg-[#f7f3ec] p-4">
              <p className="text-sm font-bold text-[#24312f]">
                Working rules
              </p>
              <p className="mt-2 text-sm leading-6 text-[#5a6865]">
                {profile.working_rules}
              </p>
            </div>
          ) : null}
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
          {canStartBooking ? (
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href={`/profile/${profile.slug}/book`}>Book session</Link>
            </Button>
          ) : !hasServices ? (
            <Button className="rounded-full" disabled>
              No services yet
            </Button>
          ) : (
            <Button className="rounded-full" disabled>
              Booking paused
            </Button>
          )}
        </div>
        {!canBook ? (
          <div className="rounded-2xl bg-[#f6ddd4] p-4 text-sm font-medium leading-6 text-[#9a4c2f]">
            This specialist is not accepting new bookings right now. You can
            still view their public profile and services.
          </div>
        ) : null}
        {!hasServices ? (
          <Card className="rounded-3xl border-[#ded5c8] bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                No services yet
              </p>
              <h3 className="mt-3 text-2xl font-semibold text-[#24312f]">
                This profile has no active services.
              </h3>
              <p className="mt-2 text-sm leading-6 text-[#66736f]">
                Services will appear here when the specialist publishes them.
              </p>
            </CardContent>
          </Card>
        ) : null}
        {services.map((service) => {
          const summary = getPublicServiceSummary(service);

          return (
            <Card
              className="rounded-3xl border-[#ded5c8] bg-white"
              key={service.id}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge className="mb-3 rounded-full bg-[#eef1da] text-[#59672c] hover:bg-[#eef1da]">
                      {getServiceBadge(service)}
                    </Badge>
                    <CardTitle>{service.title}</CardTitle>
                    <p className="mt-2 text-sm leading-6 text-[#60706c]">
                      {service.description}
                    </p>
                  </div>
                  <p className="whitespace-nowrap text-sm font-bold text-[#9a4c2f]">
                    {summary.priceLabel}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-medium text-[#7d8a86]">
                  {summary.detail}
                </p>
                {canStartBooking ? (
                  <Button asChild className="rounded-full" variant="outline">
                    <Link href={`/profile/${profile.slug}/book?service=${service.id}`}>
                      Book session
                    </Link>
                  </Button>
                ) : (
                  <Button className="rounded-full" disabled variant="outline">
                    Unavailable
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
