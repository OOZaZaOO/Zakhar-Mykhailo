import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { settingsSections } from "@/data/mock";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div>
        <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
          Settings
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-normal">
          Workspace preferences
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
          Manage account basics, notification preferences, and future billing
          areas in one place.
        </p>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.35fr_1fr]">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {settingsSections.map((section) => (
              <div
                className="rounded-xl bg-[#f7f3ec] px-3 py-2 text-sm font-semibold text-[#53615f]"
                key={section}
              >
                {section}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <CardTitle>Profile basics</CardTitle>
            <p className="text-sm text-[#66736f]">
              Mock settings form. Saving is not connected.
            </p>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label>Name</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                placeholder="John Smith"
              />
            </div>
            <div>
              <Label>Title</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                placeholder="Psychologist"
              />
            </div>
            <div>
              <Label>Timezone</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                placeholder="Europe/Bratislava"
              />
            </div>
            <div>
              <Label>Public slug</Label>
              <Input
                className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
                placeholder="john-smith"
              />
            </div>
            <div className="sm:col-span-2">
              <Button className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
                Save changes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
