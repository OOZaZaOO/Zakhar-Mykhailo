# Supabase

## Purpose

This document explains what is currently configured in Supabase and what still requires manual setup.

## Configured In Code

- `@supabase/supabase-js`
- `@supabase/ssr`
- Browser client helper in `src/lib/supabase/client.ts`
- Server client helper in `src/lib/supabase/server.ts`
- Local database types in `src/lib/supabase/types.ts`
- Auth middleware in `middleware.ts`
- Auth callback route in `src/app/auth/callback/route.ts`
- Developer connection check at `/dashboard/dev/supabase`

## Environment Variables

Required:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Source:

- `NEXT_PUBLIC_SUPABASE_URL`: Supabase Project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon or publishable key.

These values are public browser keys by design. They must exist in `.env.local` for local development and in Vercel Project Settings for deployment.

## Database

Current real tables from the first schema migration:

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

The code currently uses:

- `specialist_profiles` for specialist profile CRUD, public profiles, avatars, profile completion, and booking status.
- `services` for real services CRUD.

The code does not yet use:

- `availability_blocks`
- `availability_exceptions`

Future tables are documented in [DATABASE.md](./DATABASE.md).

## Storage

Current avatar upload code uses bucket:

```text
avatars
```

Important:

- The bucket must exist manually in Supabase before avatar upload works.
- Files are public.
- Upload path format is `avatars/{auth.uid()}/avatars/{random-id}.{ext}` in public URL terms, with object name `{auth.uid()}/avatars/{random-id}.{ext}` inside the bucket.
- Allowed formats in the UI are jpg, jpeg, png, and webp.
- Maximum UI file size is 5 MB.

Storage helper:

- `src/lib/profile/avatar-storage.ts`

Storage policies:

- `supabase/migrations/20260705143000_configure_avatars_storage_policies.sql`

Historical note:

- `supabase/migrations/20260705130000_specialist_avatar_storage.sql` creates/configures a `specialist-avatars` bucket.
- Current application code no longer uses `specialist-avatars`; it uses `avatars`.
- Do not rely on the older bucket unless code is intentionally changed.

## RLS Overview

The initial schema migration enables RLS on:

- `specialist_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`

Public users can read:

- public specialist profiles;
- active services for public specialist profiles;
- active availability for public specialist profiles.

Authenticated specialists can manage:

- their own specialist profile;
- services belonging to their own specialist profile;
- availability rows belonging to their own specialist profile.

Storage policies for `avatars` allow:

- anyone to read avatar images;
- authenticated users to upload, update, and delete only files in their own user-id folder.

## Manual Supabase Setup

Before local or deployed avatar/profile work is reliable:

1. Set auth Site URL and redirect URLs for local and Vercel environments.
2. Apply `supabase/migrations/20260704120000_initial_specialist_schema.sql`.
3. Ensure the `avatars` bucket exists and is public.
4. Apply `supabase/migrations/20260705143000_configure_avatars_storage_policies.sql`.
5. Verify `.env.local` contains the Supabase URL and anon key.

## What Remains

- Generate Supabase types from the remote project instead of maintaining them manually.
- Create `client_profiles`.
- Implement availability CRUD.
- Implement booking/session/message/material/file tables.
- Implement realtime chat if needed.
- Add payments and subscriptions after provider selection.
