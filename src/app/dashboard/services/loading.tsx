import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";

export default function ServicesLoading() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="h-4 w-24 rounded-full bg-[#eadfce]" />
          <div className="mt-4 h-10 w-64 rounded-2xl bg-[#eadfce]" />
          <div className="mt-4 h-5 w-full max-w-xl rounded-full bg-[#eadfce]" />
        </div>
        <div className="h-10 w-32 rounded-full bg-[#eadfce]" />
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <Card className="rounded-3xl border-[#ded5c8] bg-white" key={item}>
            <CardContent className="space-y-4 p-6">
              <div className="h-6 w-3/4 rounded-full bg-[#eadfce]" />
              <div className="h-16 rounded-2xl bg-[#f1e8da]" />
              <div className="grid grid-cols-3 gap-2">
                <div className="h-16 rounded-2xl bg-[#f1e8da]" />
                <div className="h-16 rounded-2xl bg-[#f1e8da]" />
                <div className="h-16 rounded-2xl bg-[#f1e8da]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
