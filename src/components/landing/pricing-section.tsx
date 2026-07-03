import { Button } from "@/components/ui/button";

export function PricingSection() {
  return (
    <section className="bg-[#fffaf2] px-5 py-12 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-[#ded5c8] bg-white p-6 shadow-sm">
          <h2 className="mt-3 text-3xl font-semibold tracking-normal">
            More than booking.
          </h2>
          <div className="mt-4 space-y-3 text-base leading-7 text-[#5a6865]">
            <p>Booking tools stop after the appointment.</p>
            <p>
              This product helps professionals manage everything that comes
              after it: communication, materials, files, notes and session
              history.
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-[#ded5c8] bg-[#1e2725] p-6 text-white shadow-sm">
          <h2 className="text-3xl font-semibold tracking-normal">
            Ready to simplify your workflow?
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            Spend less time organizing your work and more time helping your
            clients.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-[#a9b66f] px-6 text-sm font-bold text-[#1e2725] hover:bg-[#b8c47d]"
          >
            <a href="#booking">Start free</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
