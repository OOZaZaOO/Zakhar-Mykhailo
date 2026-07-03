import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { faqs, pricingPlans } from "@/data/mock";

export function PricingSection() {
  return (
    <section className="bg-[#fffaf2] px-5 py-14 sm:px-8 lg:py-20" id="pricing">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <Badge
              variant="outline"
              className="border-[#d2c6b6] bg-white/80 px-3 py-1 text-sm font-semibold text-[#9a4c2f]"
            >
              Pricing preview
            </Badge>
            <h2 className="mt-5 text-4xl font-semibold tracking-normal text-[#18211f]">
              Start simple. Grow when the workflow is proven.
            </h2>
            <p className="mt-4 text-base leading-7 text-[#5a6865]">
              Pricing is mocked for Stage 1. The product remains focused on
              validating whether professionals want one workspace for client
              sessions.
            </p>
          </div>
          <div className="rounded-3xl border border-[#ded5c8] bg-white p-5">
            <h3 className="text-2xl font-semibold">More than booking.</h3>
            <p className="mt-3 text-sm leading-6 text-[#5a6865]">
              Booking tools stop after the appointment. This product helps
              professionals manage what comes after it: communication,
              materials, files, notes, and session history.
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {pricingPlans.map((plan, index) => (
            <Card
              className="rounded-3xl border-[#ded5c8] bg-white"
              key={plan.name}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>{plan.name}</CardTitle>
                    <p className="mt-2 text-sm leading-6 text-[#66736f]">
                      {plan.description}
                    </p>
                  </div>
                  {index === 1 ? (
                    <Badge className="rounded-full bg-[#eef1da] text-[#5d6b2f] hover:bg-[#eef1da]">
                      Popular
                    </Badge>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-semibold text-[#18211f]">
                  {plan.price}
                  <span className="text-base font-medium text-[#66736f]">
                    /mo
                  </span>
                </p>
                <div className="mt-5 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      className="rounded-2xl bg-[#f7f3ec] px-4 py-3 text-sm font-semibold text-[#4f5f5b]"
                      key={feature}
                    >
                      {feature}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]" id="faq">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#9a4c2f]">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-normal">
              Clear boundaries for the MVP.
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {faqs.map((faq) => (
              <div
                className="rounded-3xl border border-[#ded5c8] bg-white p-5"
                key={faq.question}
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-3 text-sm leading-6 text-[#5a6865]">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <footer className="mt-14 rounded-[2rem] bg-[#1e2725] p-6 text-white sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold">
                Ready to simplify your workflow?
              </h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/70">
                Spend less time organizing your work and more time helping your
                clients.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="rounded-full bg-[#a9b66f] px-6 text-sm font-bold text-[#1e2725] hover:bg-[#b8c47d]"
              >
                <Link href="/register">Start free</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-white/20 bg-transparent px-6 text-sm font-bold text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/profile/maya-sterling">See demo</Link>
              </Button>
            </div>
          </div>
          <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-5 text-sm text-white/60 sm:flex-row sm:items-center sm:justify-between">
            <p>BuyMyTime · UI-only MVP prototype</p>
            <div className="flex gap-4">
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
              <Link href="/dashboard">Dashboard</Link>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}
