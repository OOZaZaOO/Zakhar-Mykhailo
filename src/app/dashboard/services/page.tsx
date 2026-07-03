import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { services } from "@/data/mock";

export default function ServicesPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
            Services
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-normal">
            Bookable offers
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-[#5a6865]">
            Define what clients can book, how long it takes, and how it appears
            on the public profile.
          </p>
        </div>
        <Button className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]">
          Create service
        </Button>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {services.map((service) => (
          <Card className="rounded-3xl border-[#ded5c8] bg-white" key={service.id}>
            <CardHeader>
              <div className="flex items-start justify-between gap-3">
                <CardTitle>{service.name}</CardTitle>
                <Badge
                  className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]"
                  variant="secondary"
                >
                  {service.status}
                </Badge>
              </div>
              <p className="text-sm text-[#66736f]">{service.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="rounded-2xl bg-[#f7f3ec] p-3">
                  <p className="text-[#7b8884]">Duration</p>
                  <p className="mt-1 font-bold">{service.duration}</p>
                </div>
                <div className="rounded-2xl bg-[#f7f3ec] p-3">
                  <p className="text-[#7b8884]">Price</p>
                  <p className="mt-1 font-bold">{service.price}</p>
                </div>
                <div className="rounded-2xl bg-[#f7f3ec] p-3">
                  <p className="text-[#7b8884]">Format</p>
                  <p className="mt-1 font-bold">{service.format}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="rounded-full">
                  Edit
                </Button>
                <Button variant="outline" className="rounded-full">
                  Duplicate
                </Button>
                <Button variant="ghost" className="rounded-full text-[#9a4c2f]">
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
