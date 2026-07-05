# BuyMyTime

BuyMyTime is a Next.js SaaS MVP for independent professionals who sell time-based services. The product is centered on a future Session Workspace: one organized place for each booked client session, including meeting links, messages, materials, files, notes, and archive history.

The current implementation is a hybrid MVP foundation: public marketing UI and several workspace pages still use mock data, while Supabase Auth, specialist profile management, avatar storage, profile completion gating, booking-status toggling, and services CRUD are connected to Supabase.

## Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui-style local components
- Supabase Auth, Postgres, RLS, and Storage
- pnpm
- Vercel target deployment

## Local Setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Use the Supabase Project URL and Supabase anon/publishable key. The same values must be configured in Vercel.

## Quality Checks

```bash
pnpm lint
pnpm build
```

## Folder Structure

```text
src/app                    Next.js App Router routes
src/components/auth        Auth shell and logout UI
src/components/calendar    Calendar-related UI and booking status toggle
src/components/landing     Landing page sections
src/components/layout      Public and dashboard layouts, header, sidebar, breadcrumbs
src/components/onboarding  Profile completion and gated empty states
src/components/profile     Specialist profile form and avatar upload
src/components/services    Services CRUD UI
src/components/session     Mock session workspace components
src/components/ui          Local shadcn/ui-style primitives
src/data                   Mock data still used by unfinished areas
src/hooks                  Client hooks
src/lib                    Core auth, navigation, profile, services, Supabase, timezone logic
supabase/migrations        SQL migrations
docs                       Project context for developers and AI agents
```

## Documentation

Start here:

- [docs/AI_ONBOARDING.md](./docs/AI_ONBOARDING.md)
- [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md)
- [docs/MASTER_CONTEXT.md](./docs/MASTER_CONTEXT.md)
- [docs/DATABASE.md](./docs/DATABASE.md)
- [docs/SUPABASE.md](./docs/SUPABASE.md)
- [docs/NEXT_STEPS.md](./docs/NEXT_STEPS.md)

## Current Status

Implemented:

- Multi-page App Router shell.
- Supabase email/password auth.
- Specialist/client account-type metadata.
- Protected dashboard routes.
- Specialist profile create/edit/load from Supabase.
- Public specialist profile loaded from Supabase.
- Persistent specialist avatar upload through Supabase Storage.
- Profile completion and feature gating.
- Services CRUD connected to Supabase.
- Booking status toggle persisted to `specialist_profiles.is_accepting_bookings`.

Not implemented yet:

- Client profile persistence.
- Real booking flow.
- Real availability CRUD.
- Real session workspace persistence.
- Chat, materials, files, archive persistence.
- Payments, notifications, email, analytics, integrations.
