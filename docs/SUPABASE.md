# Supabase Foundation

## What Has Been Configured

- Installed `@supabase/supabase-js`.
- Added browser and server Supabase client helpers.
- Added placeholder database types.
- Added a dashboard developer check page at `/dashboard/dev/supabase`.
- Added local environment configuration support.

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
- `src/lib/supabase/types.ts`: temporary database type placeholder until generated types exist.
- `src/app/dashboard/dev/supabase/page.tsx`: simple initialization check page.

## What Remains To Be Implemented

- Database schema.
- Generated Supabase database types.
- Authentication.
- Protected routes.
- Storage.
- Realtime chat.
- Booking persistence.
- Payments.
- Application business logic.
