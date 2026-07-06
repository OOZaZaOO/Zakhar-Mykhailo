# Database

## Purpose

This document explains the current Supabase/PostgreSQL schema and the planned MVP schema. It is documentation, not a migration.

## Current Real Schema

Created by:

- `supabase/migrations/20260704120000_initial_specialist_schema.sql`

Current application tables:

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

Current application storage bucket used by code:

- `avatars`

## Entity Overview

```text
auth.users
  1 -> 1 specialist_profiles

specialist_profiles
  1 -> many services
  1 -> many availability_blocks
  1 -> many availability_exceptions
```

Planned MVP extension:

```text
auth.users
  1 -> 1 client_profiles

client_profiles
  1 -> many bookings
  1 -> many sessions

bookings
  1 -> 1 sessions

sessions
  1 -> many messages
  1 -> many materials
  1 -> many files
```

## Permissions Model

Current RLS:

- Public users can read public specialist profiles.
- Public users can read active services for public specialist profiles.
- Public users can read active availability for public specialist profiles.
- Specialists can read, create, update, and delete only their own specialist profile.
- Specialists can manage only services and availability rows attached to their own specialist profile.

Planned RLS:

- Clients should access only their own client profile, bookings, sessions, materials, files, and messages through `client_profiles.user_id = auth.uid()`.
- Specialists should access bookings and sessions connected to their own `specialist_profiles.id`.

## Current Tables

## `specialist_profiles`

Purpose: stores specialist profile data used by dashboard settings and public profile pages.

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key, default `gen_random_uuid()`. |
| `user_id` | uuid | References `auth.users(id)` with `on delete cascade`; unique. |
| `slug` | text | Unique URL-safe public slug. |
| `display_name` | text | User-facing label is "Visible name". |
| `profession` | text | Public professional title. |
| `bio` | text | Public profile biography. |
| `avatar_url` | text | Public Supabase Storage URL for avatar. |
| `timezone` | text | IANA timezone string, for example `Europe/Bratislava`. |
| `languages` | text[] | Selected languages from curated list. |
| `contact_links` | jsonb | Internal field; raw JSON is not exposed in UI. |
| `working_rules` | text | Booking instructions shown on profile. |
| `visibility` | text | `public`, `private`, or `hidden`; not currently exposed in profile form. |
| `is_accepting_bookings` | boolean | Edited from Calendar booking-status toggle. |
| `created_at` | timestamptz | Insert timestamp. |
| `updated_at` | timestamptz | Updated by trigger. |

Constraints:

- Unique `user_id`.
- Unique `slug`.
- URL-safe slug check.
- Non-empty display name, profession, and timezone.
- `contact_links` must be a JSON object.
- Visibility must be `public`, `private`, or `hidden`.

Indexes:

- Public slug lookup where visibility is public.
- Visibility filtering.

RLS:

- Public can read rows where `visibility = 'public'`.
- Owner can read, insert, update, and delete when `user_id = auth.uid()`.

Current usage:

- `/dashboard/profile` create/edit/load profile.
- `/profile/[slug]` public profile lookup.
- Header avatar/name display.
- Profile completion calculation.
- Calendar booking-status toggle.

## `services`

Purpose: stores bookable service offerings for a specialist.

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key, default `gen_random_uuid()`. |
| `specialist_profile_id` | uuid | References `specialist_profiles(id)` with `on delete cascade`. |
| `title` | text | Service title. |
| `description` | text | Service description. |
| `duration_minutes` | integer | Must be 1 to 1440. |
| `price_amount` | integer | Minor currency units. |
| `currency` | text | Three uppercase letters. |
| `format` | text | `online`, `offline`, or `async`. |
| `location_details` | text | Present in DB, not currently exposed in UI. |
| `is_active` | boolean | Public/readable and later bookable state. |
| `sort_order` | integer | Specialist-controlled display order. |
| `created_at` | timestamptz | Insert timestamp. |
| `updated_at` | timestamptz | Updated by trigger. |

Indexes:

- By `specialist_profile_id`.
- Public listing by `specialist_profile_id`, `is_active`, and `sort_order`.

RLS:

- Public can read active services for public specialists.
- Owner can manage services for their own specialist profile.

Current usage:

- `/dashboard/services` real CRUD.
- Public profile still uses mock service cards and should be connected later.

## `availability_blocks`

Purpose: recurring weekly availability windows.

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key. |
| `specialist_profile_id` | uuid | References `specialist_profiles(id)` with `on delete cascade`. |
| `day_of_week` | smallint | 0 Sunday through 6 Saturday. |
| `start_time` | time | Local start time. |
| `end_time` | time | Local end time. |
| `timezone` | text | IANA timezone. |
| `is_active` | boolean | Active state. |
| `created_at` | timestamptz | Insert timestamp. |
| `updated_at` | timestamptz | Updated by trigger. |

Current usage:

- Reserved for a future default weekly template.
- `/dashboard/calendar` no longer edits this table directly.

## `availability_exceptions`

Purpose: one-off changes such as unavailable blocks, sick days, vacations, or extra openings.

Columns:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | uuid | Primary key. |
| `specialist_profile_id` | uuid | References `specialist_profiles(id)` with `on delete cascade`. |
| `starts_at` | timestamptz | Exception start. |
| `ends_at` | timestamptz | Exception end. |
| `exception_type` | text | `available` or `unavailable`. |
| `is_active` | boolean | Active state. |
| `created_at` | timestamptz | Insert timestamp. |
| `updated_at` | timestamptz | Updated by trigger. |

Current usage:

- `/dashboard/calendar` stores date-specific available ranges with `exception_type = 'available'`.
- One time range for one date is stored as one row.
- Save currently replaces existing available exceptions within the selected week.

## Storage

Bucket used by code:

- `avatars`

Policies:

- Anyone can read avatar images.
- Authenticated users can upload only into their own folder.
- Authenticated users can update only their own avatar files.
- Authenticated users can delete only their own avatar files.

See [SUPABASE.md](./SUPABASE.md) for manual setup notes.

## Profile Completion Logic

Profile completion is not stored in the database.

It is computed in `src/lib/profile/completion.ts`.

Required fields:

- Visible name from `specialist_profiles.display_name`
- Public slug from `specialist_profiles.slug`
- Country inferred from `specialist_profiles.timezone`
- Timezone from `specialist_profiles.timezone`

Gated features:

- Services
- Calendar
- Public Profile
- Booking configuration

## Planned MVP Tables

## `client_profiles`

Purpose: authenticated client identity and future access control.

Expected fields:

- `id`
- `user_id`
- `display_name`
- `email`
- `phone`
- `timezone`
- `created_at`
- `updated_at`

## `bookings`

Purpose: scheduled appointment event.

Expected relationships:

- belongs to specialist profile;
- belongs to client profile;
- belongs to service;
- creates one session.

## `sessions`

Purpose: workspace created from booking.

Expected fields include:

- `booking_id` unique;
- `specialist_profile_id`;
- `client_profile_id`;
- `service_id`;
- `meeting_url`;
- `meeting_provider`;
- `private_notes`;
- status/archive fields.

## `messages`

Purpose: session-scoped chat.

Important decision:

- no global chat;
- sender type should support `specialist`, `client`, and `system`.

## `materials`

Purpose: session-scoped shared resources.

## `files`

Purpose: session-scoped uploaded files. A file may optionally attach to a material or message.

## Delayed Tables

- `payments`
- `subscriptions`
- `notifications`
- `integrations`
- `notes`
- `tags`
- `material_templates`
