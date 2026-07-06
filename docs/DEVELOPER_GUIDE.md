# Developer Guide

## Local Start

Install dependencies:

```bash
pnpm install
```

Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Start local development:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Required Environment Variables

`NEXT_PUBLIC_SUPABASE_URL`

- Source: Supabase Project URL.
- Public browser value.

`NEXT_PUBLIC_SUPABASE_ANON_KEY`

- Source: Supabase anon/publishable key.
- Public browser value.

Add both values to Vercel for production and preview deployments. Redeploy after adding or changing them.

## Supabase Setup

The app expects:

- Supabase Auth enabled.
- Initial specialist schema migration applied.
- Public `avatars` Storage bucket available.
- Storage policies applied for `avatars`.

## Migrations

Current migrations:

- `20260704120000_initial_specialist_schema.sql`
- `20260705130000_specialist_avatar_storage.sql`
- `20260705143000_configure_avatars_storage_policies.sql`

Important:

- Current app code uses bucket `avatars`.
- The older `specialist_avatar_storage` migration references `specialist-avatars`.
- Prefer `20260705143000_configure_avatars_storage_policies.sql` for current avatar policies.

If applying manually in Supabase SQL Editor:

1. Apply initial specialist schema.
2. Create or verify public bucket `avatars`.
3. Apply avatar storage policies.

## Storage Bucket

Bucket:

```text
avatars
```

Recommended settings:

- Public bucket.
- Maximum file size: 5 MB.
- Allowed MIME types: `image/jpeg`, `image/png`, `image/webp`.

Policies:

- Anyone can read avatar images.
- Authenticated users can upload only to their own folder.
- Authenticated users can update only their own folder.
- Authenticated users can delete only their own folder.

## Build Process

```bash
pnpm build
```

This runs a production Next.js build with TypeScript checks.

## Lint Process

```bash
pnpm lint
```

This runs ESLint.

## Deployment

Target: Vercel.

Vercel settings:

- Framework: Next.js.
- Install command: `pnpm install`.
- Build command: `pnpm build`.
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Supabase Auth settings should include deployed Vercel URLs in allowed redirect URLs.

## Git Workflow

- Work on one logical task at a time.
- Run lint and build before committing.
- Do not mix docs, feature work, refactors, and schema changes in one commit unless explicitly requested.
- Do not rewrite existing migrations after they have been applied.

## Commit Conventions

Examples:

- `feat(auth): implement Supabase authentication`
- `feat(profile): implement specialist profile management`
- `feat(services): implement Supabase services management`
- `refactor(onboarding): simplify profile completion logic`
- `docs: improve project onboarding and developer documentation`

## Manual QA Checklist

After auth/profile/service changes:

- Register as specialist.
- Complete required profile fields.
- Verify Services, Calendar, and Public Profile unlock.
- Upload avatar and refresh page.
- Create/edit/delete a service.
- Log out and log back in.
- Visit `/profile/[slug]`.

## Do Not Do Without Explicit Task

- Do not add a service-role key.
- Do not modify database schema.
- Do not create payments logic.
- Do not implement guest booking.
- Do not add a new UI library.
