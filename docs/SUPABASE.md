# Supabase Foundation

## What Has Been Configured

- Installed `@supabase/supabase-js`.
- Installed `@supabase/ssr` for cookie-aware App Router authentication.
- Added browser and server Supabase client helpers.
- Added generated-style database types for the current migration.
- Added a dashboard developer check page at `/dashboard/dev/supabase`.
- Added local environment configuration support.
- Added real Supabase Auth registration, login, logout, auth callback handling, and route protection.
- Registration stores `account_type` in Supabase user metadata with `specialist` or `client`.

## Environment Variables

The project uses:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Local values live in `.env.local`.

Empty placeholders live in `.env.example`.

`.env.local` is ignored by Git and should not be committed.

## Files

- `src/lib/supabase/client.ts`: browser-side Supabase client factory.
- `src/lib/supabase/server.ts`: server-side Supabase client factory for App Router server components.
- `src/lib/supabase/types.ts`: local Supabase database types.
- `src/lib/auth.ts`: account type and auth redirect helpers.
- `middleware.ts`: protects authenticated workspace routes and refreshes auth cookies.
- `src/app/auth/callback/route.ts`: handles Supabase email auth callback redirects.
- `src/app/dashboard/dev/supabase/page.tsx`: simple initialization check page.

## What Remains To Be Implemented

- Additional database schema after the initial specialist foundation.
- Generated Supabase database types from the remote database after migrations are applied.
- Profile CRUD.
- Client profile persistence.
- Storage.
- Realtime chat.
- Booking persistence.
- Payments.
- Application business logic.
