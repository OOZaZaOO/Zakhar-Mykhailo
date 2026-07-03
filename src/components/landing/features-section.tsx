import { featureCards } from "@/data/mock";

export function FeaturesSection() {
  return (
    <section className="border-y border-[#ded5c8] bg-[#1e2725] px-5 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-normal">
            Everything stays organized automatically.
          </h2>
          <p className="mt-4 text-base leading-7 text-white/70">
            From the first booking to the last session, everything is stored in
            one place. No spreadsheets, no endless chats, no searching for
            files.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          {featureCards.map((feature, index) => (
            <div
              className="rounded-2xl bg-white/8 px-4 py-4"
              key={feature.title}
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#a9b66f] text-sm font-bold text-[#1e2725]">
                {index + 1}
              </span>
              <h3 className="mt-4 text-sm font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
