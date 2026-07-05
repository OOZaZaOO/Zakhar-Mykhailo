# Authentication

## Purpose

This document explains the current Supabase authentication setup.

## Current Implementation

The application uses Supabase Auth with email and password.

Browser and server clients are created with `@supabase/ssr`, so authenticated sessions are stored in cookies and survive refreshes.

Relevant files:

- `src/lib/supabase/client.ts`
- `src/lib/supabase/server.ts`
- `src/lib/auth.ts`
- `middleware.ts`
- `src/app/auth/callback/route.ts`
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/components/auth/logout-button.tsx`

## Account Types

Registration stores the selected account type in Supabase user metadata:

```json
{
  "account_type": "specialist",
  "first_name": "John",
  "last_name": "Smith",
  "full_name": "John Smith"
}
```

Supported values:

- `specialist`
- `client`

The account type controls redirects and role-based navigation.

## Registration Flow

- User chooses Specialist or Client.
- User enters first name, last name, email, password, and password confirmation.
- Registration calls `supabase.auth.signUp`.
- Metadata stores `account_type`, `first_name`, `last_name`, and `full_name`.
- Specialist redirects to `/dashboard/profile`.
- Client redirects to `/dashboard/client`.

No profile row is created automatically during registration.

## Login Flow

- Login uses `supabase.auth.signInWithPassword`.
- Specialist redirects to `/dashboard` unless a safe `redirectedFrom` path is present.
- Client redirects to `/dashboard/client`.
- The header switches from public CTAs to the authenticated user button.

## Logout Flow

- Logout is available in dashboard navigation.
- Logout calls Supabase Auth sign-out and returns the user to `/login`.

## Route Protection

`middleware.ts` protects `/dashboard` and nested dashboard routes.

Logged-out users are redirected to `/login?redirectedFrom=...`.

Authenticated users are redirected away from guest-only routes:

- `/`
- `/login`
- `/register`

Public routes remain available to guests:

- `/`
- `/login`
- `/register`
- `/profile/[slug]`
- `/profile/[slug]/book`
- `/session/[id]`

## Implemented

- Email/password registration.
- Email/password login.
- Specialist/client account type selector.
- Auth metadata storage.
- Logout.
- Cookie-based session persistence.
- Dashboard route protection.
- Authenticated redirect away from marketing routes.
- Loading, success, and error states in auth forms.

## Delayed

- Password reset implementation.
- Social login providers. Current buttons are UI-only.
- Client profile CRUD.
- Role enforcement beyond route/navigation behavior.
- Email templates and production auth email configuration details.
