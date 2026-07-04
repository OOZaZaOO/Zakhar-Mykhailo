# Migration 001: Initial Specialist Schema

## Purpose

This document explains the first production-ready Supabase migration for the MVP foundation.

Migration file:

[20260704120000_initial_specialist_schema.sql](../supabase/migrations/20260704120000_initial_specialist_schema.sql)

## What Was Created

The migration creates the first specialist-owned database foundation:

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

It also creates:

- `public.set_updated_at()`
- `public.is_specialist_profile_owner(profile_id uuid)`
- `public.is_specialist_profile_public(profile_id uuid)`
- updated-at triggers for every MVP table in this migration
- Row Level Security policies for every table
- indexes for public lookup, ownership access, service listing, and availability lookup

No booking, session, message, material, file, payment, subscription, or notification tables are created in this migration.

## Design Decisions

This migration follows the current database decisions:

- Supabase `auth.users` initially represents specialists.
- Client profiles are not part of the MVP foundation.
- Public users can read public profiles, active services, and active availability only for public specialists.
- Specialists can manage only their own profile, services, and availability.
- Availability is split into recurring weekly blocks and one-off exceptions.
- Public meeting, booking, session workspace, chat, materials, and archive behavior will be added in later migrations.

## Tables

## `specialist_profiles`

Purpose:

Stores the specialist-owned profile used by public profile pages and specialist settings.

Why it exists:

The public profile is the entry point for clients. It connects a Supabase auth user to a specialist identity, public slug, professional description, visibility state, timezone, and booking availability state.

Important choices:

- `user_id` references `auth.users(id)` and is unique.
- `slug` is unique and constrained to lowercase URL-safe text.
- `visibility` supports `public`, `private`, and `hidden`.
- `is_accepting_bookings` allows a public profile to pause booking without hiding the profile.
- `contact_links` is `jsonb` and constrained to an object.

## `services`

Purpose:

Stores bookable services created by a specialist.

Why it exists:

Services are the offers clients will choose during booking. They belong to a specialist and define the service title, duration, price, format, active state, and display order.

Important choices:

- `specialist_profile_id` references `specialist_profiles(id)`.
- `duration_minutes` must be positive and no more than 24 hours.
- `price_amount` uses minor currency units and must be zero or positive.
- `currency` is constrained to three uppercase letters.
- `format` supports `online`, `offline`, and `async`.
- `sort_order` lets specialists control public display order.

## `availability_blocks`

Purpose:

Stores recurring weekly availability.

Why it exists:

Recurring availability is the base schedule used by future booking flows to determine possible appointment times.

Important choices:

- `day_of_week` uses `0` for Sunday through `6` for Saturday.
- `start_time` must be before `end_time`.
- `timezone` is stored on each block so availability can be interpreted correctly.
- Duplicate weekly slots are prevented per specialist.

## `availability_exceptions`

Purpose:

Stores one-off schedule changes.

Why it exists:

Real scheduling needs exceptions for vacations, sick days, blocked time, and extra openings. Recurring weekly availability is not enough by itself.

Important choices:

- `exception_type` supports `available` and `unavailable`.
- `starts_at` and `ends_at` use `timestamptz`.
- `starts_at` must be before `ends_at`.
- Active overlapping exceptions are blocked per specialist with a GiST exclusion constraint.

## Indexes

## `idx_specialist_profiles_public_slug`

Why it exists:

Supports fast public profile lookup by slug while filtering to public profiles.

## `idx_specialist_profiles_visibility`

Why it exists:

Supports visibility filtering for public/private/hidden profile queries.

## `idx_services_specialist_profile`

Why it exists:

Supports specialist-owned service management and future joins from bookings.

## `idx_services_public_listing`

Why it exists:

Supports public profile service lists filtered by active state and ordered by specialist-defined display order.

## `idx_availability_blocks_specialist_day`

Why it exists:

Supports weekly availability lookup by specialist and day during booking date selection.

## `idx_availability_exceptions_specialist_range`

Why it exists:

Supports date-range lookup of active one-off availability changes during scheduling.

## RLS Policies

## Specialist profiles

- Public profile read policy allows visitors and authenticated users to read only profiles where `visibility = 'public'`.
- Own profile read policy allows specialists to read their own profile regardless of visibility.
- Own profile insert policy requires `user_id = auth.uid()`.
- Own profile update policy allows updates only by the owning specialist and prevents ownership transfer.
- Own profile delete policy allows deleting only the owning specialist profile.

## Services

- Public service read policy exposes only active services for public specialist profiles.
- Own service read policy lets specialists see all of their services, including inactive services.
- Own service create, update, and delete policies require ownership of the parent specialist profile.

## Availability blocks

- Public availability block read policy exposes only active recurring availability for public specialist profiles.
- Own availability block read policy lets specialists see their full weekly schedule.
- Own availability block create, update, and delete policies require ownership of the parent specialist profile.

## Availability exceptions

- Public availability exception read policy exposes only active one-off changes for public specialist profiles.
- Own availability exception read policy lets specialists see all their one-off schedule changes.
- Own availability exception create, update, and delete policies require ownership of the parent specialist profile.

## Future Migration Dependencies

Future migrations should build on this foundation in this order:

1. Bookings with guest client contact fields.
2. Sessions created from bookings with unique `booking_id`.
3. Session messages with guest-client sender support.
4. Session materials.
5. Session files and Supabase Storage policies.
6. Optional client profiles when a client portal becomes necessary.
7. Payments and subscriptions after the provider decision is made.
8. Notifications and integrations after channels are selected.

## Notes

This migration intentionally does not create bookings, sessions, messages, materials, files, payments, subscriptions, notifications, integrations, notes, tags, or reusable material templates.
