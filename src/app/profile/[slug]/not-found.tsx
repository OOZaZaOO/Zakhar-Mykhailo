import Link from "next/link";

import { PublicLayout } from "@/components/layout/public-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PublicProfileNotFound() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-3xl px-5 pb-12 sm:px-8">
        <Card className="rounded-3xl border-[#ded5c8] bg-white">
          <CardHeader>
            <Badge className="w-fit rounded-full bg-[#f6ddd4] text-[#9a4c2f] hover:bg-[#f6ddd4]">
              Not found
            </Badge>
            <CardTitle className="pt-3 text-3xl">
              We could not find this specialist profile.
            </CardTitle>
            <p className="text-sm leading-6 text-[#66736f]">
              The link may be incorrect, or the specialist profile may not be
              published yet.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              asChild
              className="rounded-full bg-[#1f5f55] hover:bg-[#174a43]"
            >
              <Link href="/">Back to homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </PublicLayout>
  );
}

