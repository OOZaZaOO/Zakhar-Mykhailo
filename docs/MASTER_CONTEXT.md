# Master Context

This is the first project-context file every developer or AI assistant should read.

## Product Overview

The platform is a SaaS workspace for independent professionals who work with clients by appointment. It helps specialists organize profile presentation, services, availability, bookings, client communication, materials, files, meeting links, and session history.

The product is not a marketplace, social network, general messenger, video-call platform, or full CRM.

## Target Audience

Primary users are independent professionals such as psychologists, tutors, consultants, lawyers, accountants, coaches, dietitians, trainers, therapists, mentors, and similar specialists.

Clients are also part of the MVP model because they need future access to their client cabinet, session history, archived sessions, materials, files, and session workspaces.

## Core Idea

The core product object is the Session Workspace.

The intended lifecycle is:

```text
Profile -> Service -> Availability -> Booking -> Session Workspace -> Archive
```

Booking should create or lead to a dedicated workspace for one session. Messages, materials, files, meeting links, notes, and archive state belong to that session, not to a global chat.

## Current Implementation Status

The project is no longer UI-only. It has a real Supabase foundation plus some still-mocked product areas.

Implemented:

- Public landing, login, register, dashboard, profile, services, calendar, archive, public profile, booking mock, and session mock routes.
- Supabase email/password registration, login, logout, auth callback, and dashboard route protection.
- Specialist/client account type stored in Supabase user metadata.
- Specialist profile create/edit/load from `specialist_profiles`.
- Public specialist profile reads from Supabase by slug.
- Persistent avatar upload/removal through Supabase Storage bucket `avatars`.
- Profile completion helper and feature gating.
- Services CRUD connected to Supabase `services`.
- Booking availability toggle persisted to `specialist_profiles.is_accepting_bookings`.
- Week-specific availability management connected to Supabase `availability_exceptions`.

Still mocked or incomplete:

- Client profile CRUD and real client workspace.
- Booking creation and slot calculation.
- Session persistence, chat, materials, files, notes, archive.
- Payments, notifications, email, analytics, integrations.

## Current Tech Stack

- Next.js App Router
- React
- TypeScript
- Tailwind CSS
- Local shadcn/ui-style components
- Supabase Auth, Postgres, RLS, and Storage
- pnpm
- Vercel target deployment

## Main Modules

- Marketing landing page
- Authentication
- Role-based dashboard shell
- Specialist profile management
- Profile completion and gating
- Services management
- Calendar and booking-status settings
- Public specialist profile
- Mock booking flow
- Mock session workspace
- Mock archive/settings

## Development Philosophy

- Keep the app as a simple monolithic Next.js application during MVP.
- Prefer clear domain helpers under `src/lib` over database calls inside large UI components.
- Keep business logic in reusable helpers when it affects multiple pages.
- Keep mock data only in unfinished areas.
- Do not add backend tables or dependencies without a specific task.
- Do not bypass Supabase RLS.

## Things That Must Not Change Without Discussion

- The product is not a marketplace.
- Session Workspace is the core concept.
- Chat exists only inside a session.
- Materials are separate from chat.
- Built-in video calls are out of scope; use external meeting links.
- The project remains a monolithic Next.js app during MVP.
- Supabase is the backend foundation.
- Client profiles are required for the MVP model, but the table is not created yet.
- Product name is not finalized.
- Payments provider is not decided.
