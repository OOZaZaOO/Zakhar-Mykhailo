"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { compareTimes, getQuarterHourTimeOptions } from "@/lib/availability/time-options";
import type { AvailabilityException } from "@/lib/availability/types";
import { getDateLabel, isDateInPast } from "@/lib/availability/week";
import { utcToZonedDateTime } from "@/lib/availability/timezone";
import type { SpecialistProfile } from "@/lib/profile/types";
import { formatServicePrice } from "@/lib/services/service";
import type { Service } from "@/lib/services/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type BookingWizardProps = {
  availabilityExceptions: AvailabilityException[];
  initialDate?: string;
  initialServiceId?: string;
  initialTime?: string;
  isAuthenticated: boolean;
  profile: SpecialistProfile;
  services: Service[];
};

const stepLabels = ["Service", "Date", "Time", "Summary"] as const;
const today = new Date();

function addMinutes(time: string, minutesToAdd: number) {
  const [hours, minutes] = time.split(":").map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const nextHours = Math.floor(totalMinutes / 60);
  const nextMinutes = totalMinutes % 60;

  if (nextHours >= 24) {
    return null;
  }

  return `${nextHours.toString().padStart(2, "0")}:${nextMinutes
    .toString()
    .padStart(2, "0")}`;
}

function rangesOverlap(
  firstStart: string,
  firstEnd: string,
  secondStart: string,
  secondEnd: string,
) {
  return compareTimes(firstStart, secondEnd) < 0 &&
    compareTimes(secondStart, firstEnd) < 0;
}

function getBookingRedirectPath(pathname: string, searchParams: URLSearchParams) {
  const queryString = searchParams.toString();
  return queryString ? `${pathname}?${queryString}` : pathname;
}

function parseLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function BookingWizard({
  availabilityExceptions,
  initialDate,
  initialServiceId,
  initialTime,
  isAuthenticated,
  profile,
  services,
}: BookingWizardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(
    initialServiceId && services.some((service) => service.id === initialServiceId)
      ? initialServiceId
      : null,
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialDate ?? null,
  );
  const [selectedTime, setSelectedTime] = useState<string | null>(
    initialTime ?? null,
  );
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [continueMessage, setContinueMessage] = useState<string | null>(null);

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? null,
    [selectedServiceId, services],
  );

  const normalizedAvailability = useMemo(
    () =>
      availabilityExceptions.map((exception) => {
        const startsAt = utcToZonedDateTime({
          isoString: exception.starts_at,
          timezone: profile.timezone,
        });
        const endsAt = utcToZonedDateTime({
          isoString: exception.ends_at,
          timezone: profile.timezone,
        });

        return {
          date: startsAt.date,
          endsAt: endsAt.time,
          exceptionType: exception.exception_type,
          id: exception.id,
          serviceId: exception.service_id,
          startsAt: startsAt.time,
        };
      }),
    [availabilityExceptions, profile.timezone],
  );

  const availableDates = useMemo(() => {
    if (!selectedService) {
      return [];
    }

    const dates = Array.from(
      new Set(
        normalizedAvailability
          .filter(
            (exception) =>
              exception.exceptionType === "available" &&
              !isDateInPast(exception.date) &&
              (exception.serviceId === null ||
                exception.serviceId === selectedService.id),
          )
          .map((exception) => exception.date),
      ),
    );

    return dates
      .filter((date) => {
        const availableSlotsForDate = getSlotsForDate(
          date,
          normalizedAvailability,
          selectedService,
        );
        return availableSlotsForDate.length > 0;
      })
      .sort((firstDate, secondDate) => firstDate.localeCompare(secondDate));
  }, [normalizedAvailability, selectedService]);

  const availableTimeSlots = useMemo(() => {
    if (!selectedDate || !selectedService) {
      return [];
    }

    return getSlotsForDate(selectedDate, normalizedAvailability, selectedService);
  }, [normalizedAvailability, selectedDate, selectedService]);

  const resolvedSelectedDate =
    selectedDate && availableDates.includes(selectedDate) ? selectedDate : null;
  const resolvedSelectedTime =
    selectedTime && availableTimeSlots.includes(selectedTime) ? selectedTime : null;
  const activeStep = resolvedSelectedTime
    ? 3
    : resolvedSelectedDate
      ? 2
      : selectedServiceId
        ? 1
        : 0;

  useEffect(() => {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (selectedServiceId) {
      nextSearchParams.set("service", selectedServiceId);
    } else {
      nextSearchParams.delete("service");
    }

    if (resolvedSelectedDate) {
      nextSearchParams.set("date", resolvedSelectedDate);
    } else {
      nextSearchParams.delete("date");
    }

    if (resolvedSelectedTime) {
      nextSearchParams.set("time", resolvedSelectedTime);
    } else {
      nextSearchParams.delete("time");
    }

    const nextUrl = getBookingRedirectPath(pathname, nextSearchParams);
    const currentUrl = getBookingRedirectPath(
      pathname,
      new URLSearchParams(searchParams.toString()),
    );

    if (nextUrl !== currentUrl) {
      router.replace(nextUrl, { scroll: false });
    }
  }, [
    pathname,
    resolvedSelectedDate,
    resolvedSelectedTime,
    router,
    searchParams,
    selectedServiceId,
  ]);

  const redirectPath = getBookingRedirectPath(
    pathname,
    new URLSearchParams(searchParams.toString()),
  );
  const signInHref = `/login?redirectedFrom=${encodeURIComponent(redirectPath)}`;
  const registerHref = `/register?redirectedFrom=${encodeURIComponent(
    redirectPath,
  )}`;

  function handleContinue() {
    setContinueMessage(null);

    if (!selectedService || !resolvedSelectedDate || !resolvedSelectedTime) {
      return;
    }

    if (!isAuthenticated) {
      setIsAuthDialogOpen(true);
      return;
    }

    setContinueMessage("Booking creation is not implemented yet.");
  }

  return (
    <>
      <Card className="rounded-3xl border-[#ded5c8] bg-white">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
              Booking wizard
            </Badge>
            <p className="text-sm leading-6 text-[#66736f]">
              Choose a service, pick a date and time, then review before
              continuing.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stepLabels.map((label, index) => {
              const isComplete = index < activeStep;
              const isCurrent = index === activeStep;

              return (
                <div
                  className={cn(
                    "rounded-2xl border px-4 py-3 text-left",
                    isCurrent
                      ? "border-[#1f5f55] bg-[#eef5f1]"
                      : isComplete
                        ? "border-[#b8d2cb] bg-[#f5fbf8]"
                        : "border-[#e6ddd1] bg-[#fbf8f2]",
                  )}
                  key={label}
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#7d8a86]">
                    Step {index + 1}
                  </p>
                  <p className="mt-2 font-semibold text-[#24312f]">{label}</p>
                </div>
              );
            })}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <section className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                Step 1
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Select service</h2>
            </div>
            <div className="grid gap-3">
              {services.map((service) => {
                const isSelected = selectedServiceId === service.id;

                return (
                  <button
                    className={cn(
                      "rounded-3xl border p-4 text-left transition",
                      isSelected
                        ? "border-[#1f5f55] bg-[#eef5f1] shadow-sm"
                        : "border-[#d9ceb9] bg-white hover:bg-[#f7f3ec]",
                    )}
                    key={service.id}
                    onClick={() => {
                      setSelectedServiceId(service.id);
                      setSelectedDate(null);
                      setSelectedTime(null);
                      setContinueMessage(null);
                    }}
                    type="button"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#24312f]">
                          {service.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-[#66736f]">
                          {service.description}
                        </p>
                        <p className="mt-2 text-sm font-medium text-[#5a6865]">
                          {service.duration_minutes} min · {service.format}
                        </p>
                      </div>
                      <p className="text-sm font-bold text-[#9a4c2f]">
                        {formatServicePrice(service.price_amount, service.currency)}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                Step 2
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Choose date</h2>
            </div>
            {!selectedService ? (
              <p className="rounded-2xl bg-[#f7f3ec] px-4 py-3 text-sm leading-6 text-[#5a6865]">
                Select a service to see available dates.
              </p>
            ) : availableDates.length === 0 ? (
              <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm leading-6 text-[#9a4c2f]">
                No bookable dates are currently available for this service.
              </p>
            ) : (
              <div className="space-y-3">
                <Calendar
                  disabled={(date) => {
                    const dateKey = date.toISOString().slice(0, 10);
                    return date < new Date(today.getFullYear(), today.getMonth(), today.getDate()) ||
                      !availableDates.includes(dateKey);
                  }}
                  month={resolvedSelectedDate ? parseLocalDate(resolvedSelectedDate) : undefined}
                  onSelect={(date) => {
                    if (!date) {
                      return;
                    }

                    const dateKey = date.toISOString().slice(0, 10);
                    setSelectedDate(dateKey);
                    setSelectedTime(null);
                    setContinueMessage(null);
                  }}
                  selected={
                    resolvedSelectedDate ? parseLocalDate(resolvedSelectedDate) : undefined
                  }
                />
                {resolvedSelectedDate ? (
                  <p className="text-sm leading-6 text-[#66736f]">
                    Selected date:{" "}
                    <span className="font-semibold text-[#24312f]">
                      {getDateLabel(resolvedSelectedDate)}
                    </span>
                  </p>
                ) : null}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                Step 3
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Choose time</h2>
            </div>
            {!selectedDate ? (
              <p className="rounded-2xl bg-[#f7f3ec] px-4 py-3 text-sm leading-6 text-[#5a6865]">
                Select a date to see valid time slots.
              </p>
            ) : availableTimeSlots.length === 0 ? (
              <p className="rounded-2xl bg-[#f6ddd4] px-4 py-3 text-sm leading-6 text-[#9a4c2f]">
                No valid time slots remain for this date.
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                {availableTimeSlots.map((time) => {
                  const isSelected = selectedTime === time;

                  return (
                    <button
                      className={cn(
                        "rounded-full border px-3 py-2 text-sm font-semibold transition",
                        isSelected
                          ? "border-[#1f5f55] bg-[#eef5f1] text-[#1f5f55]"
                          : "border-[#d9ceb9] bg-white text-[#24312f] hover:bg-[#f7f3ec]",
                      )}
                      key={time}
                      onClick={() => {
                        setSelectedTime(time);
                        setContinueMessage(null);
                      }}
                      type="button"
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          <section className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
                Step 4
              </p>
              <h2 className="mt-2 text-2xl font-semibold">Booking summary</h2>
            </div>
            <div className="rounded-3xl border border-[#e6ddd1] bg-[#fbf8f2] p-5">
              <dl className="grid gap-4 sm:grid-cols-2">
                <SummaryItem label="Specialist" value={profile.display_name} />
                <SummaryItem
                  label="Service"
                  value={selectedService?.title ?? "Select a service"}
                />
                <SummaryItem
                  label="Date"
                  value={
                    resolvedSelectedDate
                      ? getDateLabel(resolvedSelectedDate)
                      : "Choose a date"
                  }
                />
                <SummaryItem
                  label="Time"
                  value={resolvedSelectedTime ?? "Choose a time"}
                />
                <SummaryItem
                  label="Duration"
                  value={
                    selectedService
                      ? `${selectedService.duration_minutes} min`
                      : "Select a service"
                  }
                />
                <SummaryItem
                  label="Price"
                  value={
                    selectedService
                      ? formatServicePrice(
                        selectedService.price_amount,
                        selectedService.currency,
                      )
                      : "Select a service"
                  }
                />
                <SummaryItem label="Timezone" value={profile.timezone} />
              </dl>
            </div>
            {continueMessage ? (
              <p className="rounded-2xl bg-[#eef1da] px-4 py-3 text-sm font-medium leading-6 text-[#5d6b2f]">
                {continueMessage}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                className="rounded-full"
                onClick={() => {
                  if (resolvedSelectedTime) {
                    setSelectedTime(null);
                    return;
                  }

                  if (resolvedSelectedDate) {
                    setSelectedDate(null);
                    return;
                  }

                  setSelectedServiceId(null);
                }}
                type="button"
                variant="outline"
              >
                Back
              </Button>
              <Button
                className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
                disabled={
                  !selectedService || !resolvedSelectedDate || !resolvedSelectedTime
                }
                onClick={handleContinue}
                type="button"
              >
                Continue
              </Button>
            </div>
          </section>
        </CardContent>
      </Card>

      <AlertDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
        <AlertDialogContent className="rounded-3xl border-[#ded5c8] bg-white">
          <AlertDialogHeader className="place-items-start text-left">
            <AlertDialogTitle className="text-2xl font-semibold text-[#24312f]">
              Continue to booking
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-[#5a6865]">
              Create a free account or sign in to confirm your booking and
              access your session workspace.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-col">
            <Button
              asChild
              className="h-11 rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href={registerHref}>Create account</Link>
            </Button>
            <Button asChild className="h-11 rounded-full" variant="outline">
              <Link href={signInHref}>Sign in</Link>
            </Button>
            <AlertDialogCancel className="h-11 rounded-full border-[#d9ceb9]">
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <dt className="text-sm font-bold text-[#7d8a86]">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-[#24312f]">{value}</dd>
    </div>
  );
}

function getSlotsForDate(
  date: string,
  exceptions: Array<{
    date: string;
    endsAt: string;
    exceptionType: "available" | "unavailable";
    id: string;
    serviceId: string | null;
    startsAt: string;
  }>,
  service: Service,
) {
  const matchingAvailableRanges = exceptions.filter(
    (exception) =>
      exception.date === date &&
      exception.exceptionType === "available" &&
      (exception.serviceId === null || exception.serviceId === service.id),
  );
  const blockedRanges = exceptions.filter(
    (exception) =>
      exception.date === date &&
      exception.exceptionType === "unavailable" &&
      (exception.serviceId === null || exception.serviceId === service.id),
  );

  const validSlots = new Set<string>();

  matchingAvailableRanges.forEach((range) => {
    getQuarterHourTimeOptions().forEach((timeOption) => {
      if (
        compareTimes(timeOption, range.startsAt) < 0 ||
        compareTimes(timeOption, range.endsAt) >= 0
      ) {
        return;
      }

      const slotEnd = addMinutes(timeOption, service.duration_minutes);

      if (!slotEnd || compareTimes(slotEnd, range.endsAt) > 0) {
        return;
      }

      const overlapsBlockedRange = blockedRanges.some((blockedRange) =>
        rangesOverlap(
          timeOption,
          slotEnd,
          blockedRange.startsAt,
          blockedRange.endsAt,
        ),
      );

      if (!overlapsBlockedRange) {
        validSlots.add(timeOption);
      }
    });
  });

  return Array.from(validSlots).sort((firstTime, secondTime) =>
    compareTimes(firstTime, secondTime),
  );
}
