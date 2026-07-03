import { MiniCalendar } from "@/components/dashboard/mini-calendar";
import { RecentMessages } from "@/components/dashboard/recent-messages";
import { TodaySessions } from "@/components/dashboard/today-sessions";
import { Card } from "@/components/ui/card";
import { dashboardStats } from "@/data/mock";

export function SpecialistDashboard() {
  return (
    <section
      className="mx-auto grid max-w-7xl gap-6 px-5 py-12 sm:px-8 lg:grid-cols-[0.95fr_1.05fr]"
      id="dashboard"
    >
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
          Specialist dashboard
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal">
          The day starts with bookings, profile health, and session prep.
        </h2>
        <p className="mt-4 text-base leading-7 text-[#5a6865]">
          This mock dashboard keeps setup status, upcoming sessions, services,
          availability, and materials in one work-focused surface.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {dashboardStats.map((item) => (
            <Card
              className="gap-0 rounded-2xl border-[#ded5c8] bg-white p-4 shadow-none"
              key={item}
            >
              <p className="text-sm font-bold text-[#24312f]">{item}</p>
            </Card>
          ))}
        </div>
        <MiniCalendar />
        <RecentMessages />
      </div>

      <TodaySessions />
    </section>
  );
}
