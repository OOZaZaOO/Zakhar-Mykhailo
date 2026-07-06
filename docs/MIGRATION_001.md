# Migration 001: Initial Specialist Schema

Migration file:

- `supabase/migrations/20260704120000_initial_specialist_schema.sql`

## Purpose

Creates the first production-ready Supabase schema for specialist-owned data.

## Created Tables

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

No booking, session, message, material, file, payment, subscription, notification, integration, or client profile tables are created in this migration.

## Created Functions

- `public.set_updated_at()`
- `public.is_specialist_profile_owner(profile_id uuid)`
- `public.is_specialist_profile_public(profile_id uuid)`

## Created Triggers

Each table has an `updated_at` trigger:

- `set_specialist_profiles_updated_at`
- `set_services_updated_at`
- `set_availability_blocks_updated_at`
- `set_availability_exceptions_updated_at`

## UUID Strategy

The migration enables `pgcrypto` and uses `gen_random_uuid()`.

## Foreign Keys

- `specialist_profiles.user_id` references `auth.users(id)` with `on delete cascade`.
- `services.specialist_profile_id` references `specialist_profiles(id)` with `on delete cascade`.
- `availability_blocks.specialist_profile_id` references `specialist_profiles(id)` with `on delete cascade`.
- `availability_exceptions.specialist_profile_id` references `specialist_profiles(id)` with `on delete cascade`.

Deleting a specialist profile cascades specialist-owned MVP foundation rows. Do not expose destructive profile deletion casually in UI.

## Indexes

- `idx_specialist_profiles_public_slug`: fast public profile lookup by slug.
- `idx_specialist_profiles_visibility`: visibility filtering.
- `idx_services_specialist_profile`: owner service management and joins.
- `idx_services_public_listing`: active service listing ordered by sort order.
- `idx_availability_blocks_specialist_day`: weekly availability lookup.
- `idx_availability_exceptions_specialist_range`: active exception date-range lookup.

## RLS Policies

Specialist profiles:

- Public can read public specialist profiles.
- Specialists can read own specialist profile.
- Specialists can create own specialist profile.
- Specialists can update own specialist profile.
- Specialists can delete own specialist profile.

Services:

- Public can read active services for public specialists.
- Specialists can read own services.
- Specialists can create own services.
- Specialists can update own services.
- Specialists can delete own services.

Availability blocks:

- Public can read active availability blocks for public specialists.
- Specialists can read own availability blocks.
- Specialists can create own availability blocks.
- Specialists can update own availability blocks.
- Specialists can delete own availability blocks.

Availability exceptions:

- Public can read active availability exceptions for public specialists.
- Specialists can read own availability exceptions.
- Specialists can create own availability exceptions.
- Specialists can update own availability exceptions.
- Specialists can delete own availability exceptions.

## Current Code Usage

Currently used by code:

- `specialist_profiles`
- `services`
- `availability_exceptions`

Created but not yet used by real UI:

- `availability_blocks`

## Related Storage Migrations

Avatar storage is separate from this schema migration.

Current avatar code uses:

- bucket `avatars`
- policies from `supabase/migrations/20260705143000_configure_avatars_storage_policies.sql`

Historical note:

- `supabase/migrations/20260705130000_specialist_avatar_storage.sql` configures `specialist-avatars`, but current app code uses `avatars`.

## Future Dependencies

Next database migrations should add, in order:

1. `client_profiles`
2. `bookings`
3. `sessions`
4. `messages`
5. `materials`
6. `files`
7. payments/subscriptions after provider choice
