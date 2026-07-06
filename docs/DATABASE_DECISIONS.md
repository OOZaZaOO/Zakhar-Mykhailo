# Database Architecture Decisions

## Purpose

This file records database decisions before additional migrations are created. It should guide future schema work but is not itself a migration.

## Core Principle

The database is built around the Session Workspace lifecycle:

```text
Profile -> Service -> Availability -> Booking -> Session Workspace -> Archive
```

## Decision: Use `gen_random_uuid()`

- Current migrations use `gen_random_uuid()` for UUID primary keys.
- This matches modern Supabase/PostgreSQL practice through `pgcrypto`.

## Decision: Include `client_profiles` In MVP

- Clients need access to their personal cabinet, session history, archived sessions, materials, files, and session workspaces.
- `client_profiles` are required for client dashboard access and future session access control.
- Bookings should reference `client_profiles`.
- Sessions should reference `client_profiles`.
- RLS should use `auth.uid()` through `client_profiles.user_id` for client access.
- Guest booking may be considered later, but it is not the primary MVP model.

Current state: the `client_profiles` table has not been created yet.

## Decision: Auth Users Represent Specialists And Clients

- Supabase `auth.users` represents authenticated specialists and authenticated clients.
- Specialist ownership is resolved through `specialist_profiles.user_id`.
- Client ownership should be resolved through future `client_profiles.user_id`.
- There are no teams, organizations, marketplace accounts, or complex roles in the MVP.

## Decision: Booking Creates Session

- A session must not exist without a booking.
- `sessions.booking_id` should be unique.
- Booking is the event; Session is the workspace created from that event.

## Decision: Session Workspace Is The Core Product Object

- Messages, materials, files, meeting link, notes, and archive state belong to a session.
- There is no global chat.
- Communication exists only inside a session.

## Decision: Messages Support Specialist, Client, And System Senders

- `sender_user_id` alone is not enough because system messages may not have a human sender.
- Future messages should include `sender_role` or `sender_type`.
- Possible values: `specialist`, `client`, `system`.
- `sender_user_id` can be nullable for system messages.

## Decision: Availability Has Blocks And Exceptions

- `availability_blocks` define weekly recurring availability.
- `availability_exceptions` handle vacations, sick days, blocked time, and one-off changes.
- Both tables already exist in Migration 001.

## Decision: Booking Status Lives On Specialist Profile For Now

- `specialist_profiles.is_accepting_bookings` controls whether a public profile can accept new bookings.
- This is currently edited from the Calendar page.
- Existing bookings should remain unchanged when new bookings are paused.

## Decision: Services Have Sort Order And Active State

- `services.sort_order` lets specialists control display order.
- `services.is_active` controls whether the service is publicly readable and later bookable.
- Current UI supports create, edit, delete, and active toggle.

## Decision: Meeting Links Are External

- The platform does not build video calls in the MVP.
- Future sessions should store `meeting_url` and optionally `meeting_provider`.
- Providers may include `google_meet`, `zoom`, `teams`, and `other`.

## Decision: Files Belong To Sessions

- Every future file must belong to a session.
- A file may optionally belong to a material or message.
- `session_id` should be required.

## Decision: Notes Are Delayed

- A single future `sessions.private_notes` field is enough for the first implementation.
- A separate notes table can be added later if multiple notes, history, or templates become necessary.

## Decision: Tags Are Delayed

- Client and session tags are useful, but not required for the initial MVP.

## Current Tables

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

## MVP Tables Still Needed

- `client_profiles`
- `bookings`
- `sessions`
- `messages`
- `materials`
- `files`

## Delayed Tables

- `payments`
- `subscriptions`
- `notifications`
- `integrations`
- `notes`
- `tags`
- `material_templates`

## Open Questions

- Should booking require email verification?
- Should clients receive magic links in addition to password authentication?
- Should sessions be created immediately on pending booking or only after confirmation?
- Should archived sessions ever be reopened?
- Which payment provider will be used first?
- Should materials be reusable templates in v1 or later?

## Next Step

Create a second database migration for `client_profiles`, then continue with bookings and sessions.
