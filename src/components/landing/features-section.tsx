import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  audienceGroups,
  howItWorksSteps,
  landingFeatures,
} from "@/data/mock";

export function FeaturesSection() {
  return (
    <section
      className="border-y border-[#ded5c8] bg-[#1e2725] px-5 py-14 text-white sm:px-8 lg:py-20"
      id="features"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <Badge className="rounded-full bg-[#a9b66f] text-[#1e2725] hover:bg-[#a9b66f]">
              How it works
            </Badge>
            <h2 className="mt-5 text-4xl font-semibold tracking-normal">
              Everything stays organized automatically.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              From the first booking to the last session, everything is stored
              in one place. No spreadsheets, no endless chats, no searching for
              files.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {howItWorksSteps.map((step, index) => (
              <div
                className="rounded-3xl border border-white/10 bg-white/8 p-5"
                key={step.title}
              >
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#a9b66f] text-sm font-bold text-[#1e2725]">
                  {index + 1}
                </span>
                <h3 className="mt-5 font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/65">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14">
          <div className="max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a9b66f]">
              Features
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Built around the actual session workflow.
            </h2>
          </div>
          <div className="mt-7 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {landingFeatures.map((feature) => (
              <Card
                className="rounded-3xl border-white/10 bg-white/8 text-white shadow-none"
                key={feature.title}
              >
                <CardContent className="p-5">
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/65">
                    {feature.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mt-14 rounded-[2rem] border border-white/10 bg-white/8 p-5 sm:p-7">
          <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#a9b66f]">
                Who is it for
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-normal">
                Independent professionals with real client work.
              </h2>
              <p className="mt-4 text-base leading-7 text-white/70">
                The profession can change, but the pattern is the same:
                clients book time, the specialist prepares, the session
                happens, and history needs to stay organized.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {audienceGroups.map((group) => (
                <div
                  className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold"
                  key={group}
                >
                  {group}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
