# AI Onboarding

## Purpose

This document gives a new AI coding agent enough context to continue development without asking basic discovery questions.

## Project Overview

The product is a SaaS workspace for independent professionals who provide appointment-based services. It is not a marketplace. Specialists bring their own clients and use the platform to organize the work around sessions.

The core idea is the Session Workspace: every booking should lead to one workspace containing session information, meeting link, messages, materials, files, notes, and archive history.

## Business Goals

- Validate that specialists want one place to manage the lifecycle of client sessions.
- Help specialists move from scattered tools to a structured workspace.
- Keep the MVP simple, calm, professional, and premium.
- Avoid marketplace, social network, and enterprise CRM complexity.

## Current Implementation Status

The project is a Next.js App Router app with a real Supabase foundation.

Real backend-connected features:

- Supabase Auth registration, login, logout.
- Specialist/client account type stored in auth user metadata.
- Dashboard route protection.
- Specialist profile CRUD.
- Public profile lookup by slug.
- Avatar upload/removal through Supabase Storage.
- Profile completion and gating.
- Services CRUD.
- Booking status toggle.
- Week-specific availability CRUD.

Mock or placeholder features:

- Landing content is static UI.
- Dashboard stats and today's sessions are mock.
- Booking flow is mock.
- Session workspace is mock.
- Archive and settings are mock.
- Client dashboard is a placeholder.

## Completed Features

- Multi-page App Router structure.
- Public and dashboard layouts.
- Shared header, sidebar, breadcrumbs.
- Role-based navigation config.
- Authenticated users redirect away from marketing pages.
- Specialist profile form with floating unsaved changes bar.
- Profile slug normalization and duplicate check.
- Country selector and country-aware timezone selection.
- Language selector with curated choices.
- Immediate avatar save to Supabase Storage.
- Profile completion helper.
- Gated empty state for incomplete profile.
- Services create, edit, delete, duplicate, active toggle, display ordering, one-time offers, packages, and monthly package offers.
- Week-specific availability create/update/clear through `availability_exceptions`.

## Incomplete Features

- `client_profiles` table and CRUD.
- Booking database flow and slot calculation.
- Session tables and access control.
- Session chat.
- Session materials and files.
- Archive behavior.
- Payments.
- Notifications and emails.
- Tests.

## Architecture

Use these boundaries:

- Routes live in `src/app`.
- UI components live in `src/components`.
- Data access and business helpers live in `src/lib`.
- Client hooks live in `src/hooks`.
- Mock data lives in `src/data/mock.ts`.
- SQL lives in `supabase/migrations`.

Important helpers:

- `src/lib/auth.ts`: account type and redirect helpers.
- `src/lib/navigation.ts`: specialist/client navigation.
- `src/lib/profile/service.ts`: specialist profile database helpers.
- `src/lib/profile/completion.ts`: profile completion source of truth.
- `src/lib/profile/avatar-storage.ts`: avatar Storage helpers.
- `src/lib/services/service.ts`: services CRUD helpers.
- `src/lib/timezones.ts`: country/timezone data and helpers.
- `src/lib/languages.ts`: curated language data.
- `src/lib/supabase/client.ts`: browser Supabase client.
- `src/lib/supabase/server.ts`: server Supabase client.

## Routing

Public:

- `/`
- `/login`
- `/register`
- `/profile/[slug]`
- `/profile/[slug]/book`
- `/session/[id]`

Protected:

- `/dashboard`
- `/dashboard/profile`
- `/dashboard/services`
- `/dashboard/calendar`
- `/dashboard/settings`
- `/dashboard/archive`
- `/dashboard/client`
- `/dashboard/dev/supabase`

## Authentication Overview

- Supabase email/password auth.
- Register stores `account_type`, `first_name`, `last_name`, `full_name`.
- Specialist registration redirects to `/dashboard/profile`.
- Client registration redirects to `/dashboard/client`.
- Specialist login redirects to `/dashboard`.
- Client login redirects to `/dashboard/client`.
- `middleware.ts` protects `/dashboard` and redirects authenticated users away from `/`, `/login`, and `/register`.

## Roles

Specialist:

- Real profile management.
- Real services management.
- Calendar booking-status toggle and week-specific availability management.
- Mock dashboard/session/archive/settings areas.

Client:

- Account type exists.
- Client dashboard placeholder exists.
- No client profile table or persisted client data yet.

## Onboarding Flow

Specialist profile completion is computed from four fields:

- Visible name (`display_name`)
- Public slug (`slug`)
- Country inferred from `timezone`
- Timezone (`timezone`)

Completion source of truth:

- `src/lib/profile/completion.ts`

If incomplete:

- Dashboard shows profile setup card.
- Services, Calendar, Public Profile, and booking configuration are gated.
- Sidebar shows disabled items.

No completion status is stored in the database.

## Database Overview

Current tables:

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

The `services` table supports one-time services, one-off packages, and monthly package offers. Monthly package offers are not the platform SaaS subscription and do not implement recurring billing or client package tracking yet.

Current bucket used by code:

- `avatars`

Future MVP tables:

- `client_profiles`
- `bookings`
- `sessions`
- `messages`
- `materials`
- `files`

## Storage Overview

Avatar upload:

- UI validates jpg, jpeg, png, webp up to 5 MB.
- File uploads to Supabase Storage bucket `avatars`.
- Object path starts with the authenticated user's `auth.uid()`.
- Public URL is stored in `specialist_profiles.avatar_url`.
- Header and profile read the saved URL.

Manual Supabase setup is required for the `avatars` bucket and policies.

## Important Design Decisions

- Not a marketplace.
- No built-in video calls.
- Session chat only, no global chat.
- Materials separate from chat.
- Supabase RLS must be respected.
- No service-role key in app code.
- Keep MVP as a monolith.
- Keep dependencies minimal.

## Coding Conventions

- Use TypeScript.
- Use existing local UI primitives in `src/components/ui`.
- Prefer reusable helpers in `src/lib`.
- Do not put complex Supabase query logic in large page components.
- Keep mock data in `src/data/mock.ts`.
- Use `pnpm lint` and `pnpm build` before commit.
- Do not modify migrations unless explicitly requested.

## Current Blockers

- Client profiles are documented as required for MVP but not created.
- Booking/session tables do not exist.
- Storage has historical migration mismatch: current code uses `avatars`, while an older migration references `specialist-avatars`.
- Types are manually maintained instead of generated from Supabase.
- No automated tests.

## Recommended Development Order

1. Add `client_profiles` migration and profile creation.
2. Implement booking tables and booking flow.
3. Implement sessions created from bookings.
4. Implement session access control.
5. Implement chat, materials, files.
6. Implement archive.
7. Add notifications/email.
8. Add payments after provider decision.

## Common Mistakes To Avoid

- Do not treat mock booking/session UI as real persistence.
- Do not use `specialist-avatars` in new code unless intentionally migrating back.
- Do not store profile completion in the database.
- Do not require optional profile fields for gating.
- Do not expose raw `contact_links` JSON in UI.
- Do not add client booking as guest-first; current decision is authenticated client profiles.
- Do not bypass RLS with a service-role key.
- Do not add global chat.
- Do not add marketplace discovery.

## Files That Should Almost Never Be Edited

- Existing migrations, unless the task is explicitly migration-focused.
- `src/lib/supabase/types.ts`, unless schema changes require type updates.
- `components.json`, unless shadcn/ui configuration changes are requested.
- `package.json`, unless dependency/script changes are requested.

## Core Business Logic Files

- `src/lib/auth.ts`
- `src/lib/navigation.ts`
- `src/lib/profile/completion.ts`
- `src/lib/profile/service.ts`
- `src/lib/profile/avatar-storage.ts`
- `src/lib/services/service.ts`
- `src/hooks/use-specialist-profile.ts`
- `src/hooks/use-profile-slug-availability.ts`
