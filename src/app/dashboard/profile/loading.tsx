import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardProfileLoading() {
  return (
    <DashboardLayout>
      <Card className="rounded-3xl border-[#ded5c8] bg-white">
        <CardHeader>
          <CardTitle>Loading specialist profile</CardTitle>
          <p className="text-sm leading-6 text-[#66736f]">
            Checking your authenticated profile record in Supabase.
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-11 rounded-xl bg-[#f7f3ec]" />
          <div className="h-11 rounded-xl bg-[#f7f3ec]" />
          <div className="h-28 rounded-xl bg-[#f7f3ec]" />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
