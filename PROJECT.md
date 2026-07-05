# Project Requirements And Roadmap

## Product Summary

The platform is a SaaS workspace for independent professionals who provide time-based services to clients. It helps specialists manage the work around sessions: public profile, services, availability, booking, meeting links, messages, materials, files, and archive history.

The core product concept is the Session Workspace: every booked session should have one organized workspace for both specialist and client.

## Primary Users

## Specialist

A professional who offers services by appointment.

Needs:

- Create a public profile.
- Publish bookable services.
- Control booking availability.
- Receive bookings.
- Prepare and run sessions.
- Share materials and files.
- Preserve session history.

## Client

A person booking time with a specialist.

Needs:

- View a specialist profile.
- Book a session.
- Access their session workspace.
- Return to materials, files, and archived sessions.

## MVP Scope

Implemented foundation:

- Landing page and auth pages.
- Specialist/client registration choice.
- Supabase Auth.
- Protected dashboard.
- Specialist profile CRUD.
- Persistent avatar upload through Supabase Storage.
- Profile completion and feature gating.
- Services CRUD.
- Public specialist profile from Supabase.
- Booking status toggle.

Still required for full MVP:

- Client profile persistence.
- Availability CRUD.
- Real booking flow.
- Session workspace persistence.
- Session chat.
- Materials and files persistence.
- Archive persistence.

## Non-Goals

- Marketplace discovery.
- Native video calls.
- Team or organization accounts.
- Enterprise CRM.
- Advanced analytics.
- AI automation.
- Payment automation until provider is chosen.

## Current Architecture

- Next.js App Router monolith.
- Supabase Auth for email/password users.
- Supabase Postgres with RLS for specialist data.
- Supabase Storage for avatars.
- Mock data remains in unfinished areas.

See [docs/AI_ONBOARDING.md](./docs/AI_ONBOARDING.md) and [docs/DEVELOPER_GUIDE.md](./docs/DEVELOPER_GUIDE.md) for current implementation details.

## Implementation Roadmap

1. Add `client_profiles` migration and client profile creation.
2. Connect public profile services to real `services`.
3. Implement availability CRUD using existing availability tables.
4. Implement booking tables and booking flow.
5. Implement sessions created from bookings.
6. Add session messages, materials, and files.
7. Add archive behavior.
8. Add notifications and email.
9. Add payments after provider decision.
