# Database Architecture Decisions

## Purpose

This file records database architecture decisions before Supabase migrations are created.

It exists to keep the first real database implementation aligned with the product direction and to avoid adding tables or relationships before they are needed.

This is documentation only. Do not create tables, write migrations, execute SQL, or implement backend logic from this file until the decisions are reviewed.

## Core Principle

The database is built around the Session Workspace lifecycle:

```text
Profile -> Service -> Availability -> Booking -> Session Workspace -> Archive
```

The session workspace is the center of the product. Supporting tables should exist only when they help specialists manage this lifecycle more clearly.

## Decision: Do Not Implement `client_profiles` In MVP

- Clients may book as guests.
- The MVP should store `client_name`, `client_email`, and `client_phone` directly on `bookings`.
- `client_profiles` can be added later when a client portal becomes necessary.
- Specialists should authenticate first; clients may not need accounts in the MVP.

This keeps booking simpler and avoids building account management for clients before there is a clear need.

## Decision: Auth Users Are Primarily Specialists In MVP

- Supabase `auth.users` should initially represent specialists.
- Client authentication is delayed.
- This reduces complexity.

The first backend stage should focus on specialist accounts, specialist-owned data, and public booking flows.

## Decision: Booking Creates Session

- A session must not exist without a booking.
- `sessions.booking_id` should be unique.
- Booking is the event; Session is the workspace created from that event.

This preserves a clear one-to-one relationship between the scheduled appointment and the collaboration workspace.

## Decision: Session Workspace Is The Core Product Object

- Messages, materials, files, meeting link, and archive state belong to a session.
- There is no global chat.
- Communication exists only inside a session.

This keeps the product focused on session-specific work instead of becoming a general messenger or CRM.

## Decision: Messages Should Support Guest Clients

- `sender_user_id` alone is not enough because clients may not have accounts.
- `messages` should include `sender_role` or `sender_type`.
- Possible values: `specialist`, `client`, `system`.
- `sender_user_id` can be nullable for guest clients.

This allows a guest client to participate in session chat without requiring a full client account.

## Decision: Add `availability_exceptions`

- `availability_blocks` define weekly recurring availability.
- `availability_exceptions` handle vacations, sick days, blocked time, and one-off changes.
- This should be included early because scheduling depends on it.

Recurring availability alone is not enough for real booking behavior.

## Decision: Add `is_accepting_bookings` To `specialist_profiles`

- A specialist may keep their profile public but temporarily stop accepting bookings.

This separates profile visibility from booking availability.

## Decision: Add `sort_order` To `services`

- Specialists should control the display order of services.

This keeps the public profile useful when a specialist offers multiple services.

## Decision: Meeting Links Are External

- The platform does not build video calls in the MVP.
- `sessions` should store `meeting_url` and optionally `meeting_provider`.
- Providers may include `google_meet`, `zoom`, `teams`, and `other`.

The product organizes the session workspace but does not replace video providers.

## Decision: Files Belong To Sessions

- Every file must belong to a session.
- A file may optionally belong to a material or message.
- `session_id` is required; `material_id` and `message_id` are optional.

This keeps uploaded files anchored to the session history even when they are attached through another feature.

## Decision: Notes Should Not Be Overbuilt In MVP

- `sessions.private_notes` is enough for the MVP.
- A separate notes table may be added later if multiple notes, history, or templates are needed.

The first version should support useful private notes without creating a complex note system.

## Decision: Tags Are Delayed

- Client and session tags are useful, but not required for the initial MVP.
- Add tags later when client management becomes more important.

The MVP should prioritize the booking-to-session workflow over advanced organization tools.

## Updated MVP Table List

Recommended MVP schema:

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`
- `bookings`
- `sessions`
- `messages`
- `materials`
- `files`

Do not include `client_profiles` in the MVP.

## Delayed Tables

- `client_profiles`
- `payments`
- `subscriptions`
- `notifications`
- `integrations`
- `notes`
- `tags`
- `material_templates`

## Open Questions

- Should booking require email verification?
- Should clients receive magic links?
- Should sessions be created immediately on pending booking or only after confirmation?
- Should archived sessions ever be reopened?
- Which payment provider will be used first?
- Should materials be reusable templates in v1 or later?

## Next Step

After this document is reviewed, update [DATABASE.md](./DATABASE.md) to reflect the approved decisions.

Then create the first Supabase SQL migration.
