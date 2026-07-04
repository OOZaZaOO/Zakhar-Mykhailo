import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { specialist } from "@/data/mock";

export default function DashboardProfilePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Specialist profile
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Profile setup
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            This temporary authenticated screen confirms that specialist
            accounts land in the right workspace. Profile editing will be added
            after profile CRUD is implemented.
          </p>
        </div>
        <Badge className="w-fit rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
          Auth ready
        </Badge>
      </div>

      <Card className="mt-8 rounded-3xl border-[#ded5c8] bg-white">
        <CardHeader>
          <CardTitle>Mock specialist profile</CardTitle>
          <p className="text-sm text-[#66736f]">
            These fields are still mocked. No profile table is written from this
            screen yet.
          </p>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Name</Label>
            <Input
              className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
              readOnly
              value={specialist.name}
            />
          </div>
          <div>
            <Label>Profession</Label>
            <Input
              className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
              readOnly
              value={specialist.title}
            />
          </div>
          <div>
            <Label>Public slug</Label>
            <Input
              className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
              readOnly
              value={specialist.slug}
            />
          </div>
          <div>
            <Label>Timezone</Label>
            <Input
              className="mt-2 h-11 rounded-xl border-[#d9ceb9]"
              readOnly
              value={specialist.timezone}
            />
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
