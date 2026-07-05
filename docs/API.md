# API

There are no custom application API routes yet.

Current backend interaction happens through Supabase client helpers:

- Supabase Auth for registration, login, logout, and sessions.
- Supabase Postgres for specialist profiles and services.
- Supabase Storage for avatars.

Existing route handler:

- `src/app/auth/callback/route.ts` handles Supabase email auth callback redirects.

Future API boundaries should be added only when Supabase direct client access is no longer enough or when server-side validation/orchestration is required.

Related:

- [AUTH.md](./AUTH.md)
- [SUPABASE.md](./SUPABASE.md)
- [DATABASE.md](./DATABASE.md)
