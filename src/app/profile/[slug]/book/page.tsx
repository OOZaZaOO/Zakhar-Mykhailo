import Link from "next/link";

import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingTimes, services, specialist } from "@/data/mock";

export default function BookingPage() {
  const selectedService = services[0];

  return (
    <PublicLayout>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 pb-12 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Booking
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Book {selectedService.name}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#5a6865]">
            Select a service, choose a time, leave context for the specialist,
            and preview the session workspace created after confirmation.
          </p>
          <Card className="mt-6 rounded-3xl border-[#ded5c8] bg-white">
            <CardContent className="p-5">
              <p className="text-sm font-bold text-[#7f8d5a]">Specialist</p>
              <p className="mt-1 text-xl font-semibold">{specialist.name}</p>
              <p className="mt-1 text-sm text-[#66736f]">{specialist.title}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Booking details</CardTitle>
            <p className="text-sm text-[#66736f]">
              Mock flow only. No booking is saved yet.
            </p>
          </CardHeader>
          <CardContent className="space-y-5">
            <div>
              <Label>Service</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9] font-semibold"
                readOnly
                value={`${selectedService.name} · ${selectedService.duration} · ${selectedService.price}`}
              />
            </div>
            <div>
              <Label>Date</Label>
              <Input
                className="mt-2 h-12 rounded-2xl border-[#d9ceb9] font-semibold"
                readOnly
                value="July 10, 2026"
              />
            </div>
            <div>
              <Label>Available times</Label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {bookingTimes.map((time) => (
                  <Button
                    className="h-12 rounded-xl border-[#d9ceb9] text-sm font-bold hover:border-[#1f5f55]"
                    key={time}
                    variant="outline"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Name</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  readOnly
                  value="Nina Park"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  className="mt-2 h-12 rounded-2xl border-[#d9ceb9]"
                  readOnly
                  value="nina@example.com"
                />
              </div>
            </div>
            <div>
              <Label>Comment</Label>
              <Textarea
                className="mt-2 rounded-2xl border-[#d9ceb9]"
                readOnly
                value="I want to clarify roadmap priorities before our next launch cycle."
              />
            </div>
            <Button
              asChild
              className="w-full rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/session/sess-1001">Confirm booking</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}
