# Architecture

## Purpose

This document summarizes the current technical architecture.

## Overview

The app is a monolithic Next.js App Router application. It uses server components for authenticated page loading where useful, client components for forms and interactive UI, and Supabase for auth, database, RLS, and avatar storage.

## Layers

- `src/app`: route entry points.
- `src/components`: UI components grouped by domain.
- `src/lib`: reusable domain logic and data access helpers.
- `src/hooks`: client-side hooks.
- `src/data`: mock data for unfinished features.
- `supabase/migrations`: SQL migrations.

## Routing

Public routes:

- `/`
- `/login`
- `/register`
- `/profile/[slug]`
- `/profile/[slug]/book`
- `/session/[id]`

Protected routes:

- `/dashboard`
- `/dashboard/profile`
- `/dashboard/services`
- `/dashboard/calendar`
- `/dashboard/settings`
- `/dashboard/archive`
- `/dashboard/client`
- `/dashboard/dev/supabase`

`middleware.ts` protects `/dashboard` routes and redirects authenticated users away from `/`, `/login`, and `/register`.

## Authentication

Supabase Auth handles email/password sessions. Account type is stored in user metadata as `account_type`.

## Data Access

Use helpers instead of putting database logic directly in large UI components:

- `src/lib/profile/service.ts`
- `src/lib/profile/avatar-storage.ts`
- `src/lib/profile/completion.ts`
- `src/lib/services/service.ts`
- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`

## State Management

There is no global state manager. React state is used in client components. The temporary avatar preview store is a small custom browser-side store used to update the header immediately.

## Feature Gating

Profile completion is computed in `src/lib/profile/completion.ts`. Services, Calendar, and Public Profile are gated until visible name, slug, country, and timezone are complete.

## Security

- Dashboard routes are protected by middleware.
- Supabase RLS protects tables.
- Application code uses the anon key only.
- No service-role key should be used in the client or app runtime.

## Limitations

- Session route is public/mock.
- Booking route is public/mock.
- Client dashboard is a placeholder.
