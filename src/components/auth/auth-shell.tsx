import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { sessions } from "@/data/mock";

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  showBrandPanel = true,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  showBrandPanel?: boolean;
}) {
  if (!showBrandPanel) {
    return (
      <section className="mx-auto flex min-h-[calc(100vh-73px)] max-w-3xl items-center justify-center px-5 py-8 sm:px-8 lg:py-12">
        {children}
      </section>
    );
  }

  return (
    <section className="mx-auto grid min-h-[calc(100vh-73px)] max-w-7xl gap-8 px-5 py-8 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-12">
      <div className="relative overflow-hidden rounded-[2rem] bg-[#1e2725] p-6 text-white shadow-xl shadow-[#9c7d5520] sm:p-8">
        <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between">
          <div>
            <Link className="text-xl font-semibold tracking-tight" href="/">
              BuyMyTime
            </Link>
            <Badge className="mt-8 rounded-full bg-[#a9b66f] text-[#1e2725] hover:bg-[#a9b66f]">
              {eyebrow}
            </Badge>
            <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight tracking-normal sm:text-5xl">
              {title}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/70">
              {description}
            </p>
          </div>

          <Card className="mt-10 rounded-3xl border-white/10 bg-white/10 text-white shadow-none">
            <CardContent className="p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-white/60">Next workspace</p>
                  <p className="mt-1 text-xl font-semibold">
                    {sessions[0].service}
                  </p>
                </div>
                <Badge className="rounded-full bg-white text-[#1e2725] hover:bg-white">
                  {sessions[0].status}
                </Badge>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {["Meet link", "Materials", "Archive"].map((item) => (
                  <div className="rounded-2xl bg-white/10 p-3" key={item}>
                    <p className="text-sm font-semibold">{item}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex items-center justify-center">{children}</div>
    </section>
  );
}
