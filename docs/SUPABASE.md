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
- Added specialist profile create, read, and update flow at `/dashboard/profile`.
- Specialist profile CRUD uses the existing `specialist_profiles` table and Supabase RLS.
- Added Supabase Storage configuration for persistent specialist avatars through the `avatars` bucket.
- Specialist avatar URLs are stored in `specialist_profiles.avatar_url`.
- Specialist profile timezone is selected through a country/timezone UI and stored as an IANA timezone string in `specialist_profiles.timezone`.
- Client timezone conversion is intentionally delayed; future `client_profiles` should store the client's selected IANA timezone for booking slot display.

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
- `src/lib/profile/avatar-storage.ts`: browser-side helper for specialist avatar upload/removal in Supabase Storage.
- `middleware.ts`: protects dashboard routes and refreshes auth cookies.
- `src/app/auth/callback/route.ts`: handles Supabase email auth callback redirects.
- `src/app/dashboard/profile/page.tsx`: loads the authenticated specialist profile.
- `src/components/profile/specialist-profile-form.tsx`: creates and updates specialist profile records.
- `src/app/dashboard/dev/supabase/page.tsx`: simple initialization check page.

## What Remains To Be Implemented

- Additional database schema after the initial specialist foundation.
- Generated Supabase database types from the remote database after migrations are applied.
- Client profile persistence.
- Services CRUD.
- Booking persistence.
- Session persistence.
- Realtime chat.
- Payments.
- Application business logic.
