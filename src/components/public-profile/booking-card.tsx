import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { bookingTimes } from "@/data/mock";

export function BookingCard() {
  return (
    <div
      className="rounded-3xl border border-[#ded5c8] bg-white p-6 shadow-sm"
      id="booking"
    >
      <h3 className="text-xl font-semibold">Booking flow preview</h3>
      <div className="mt-5 space-y-4">
        <div>
          <Label className="text-sm font-bold text-[#5a6865]">Service</Label>
          <Input
            className="mt-2 h-12 rounded-2xl border-[#d9ceb9] font-semibold"
            readOnly
            value="Roadmap Reset · 60 min · $180"
          />
        </div>
        <div>
          <Label className="text-sm font-bold text-[#5a6865]">
            Available times
          </Label>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {bookingTimes.map((time) => (
              <Button
                variant="outline"
                className="h-12 rounded-xl border-[#d9ceb9] text-sm font-bold hover:border-[#1f5f55]"
                key={time}
              >
                {time}
              </Button>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-sm font-bold text-[#5a6865]">
            Session goal
          </Label>
          <Textarea
            className="mt-2 rounded-2xl border-[#d9ceb9]"
            readOnly
            value="Mock intake field for the client's booking context."
          />
        </div>
        <div className="rounded-2xl bg-[#f7f3ec] p-4 text-sm leading-6 text-[#5a6865]">
          Client details, review, confirmation, and workspace creation stay
          mocked until the backend phase.
        </div>
      </div>
    </div>
  );
}
