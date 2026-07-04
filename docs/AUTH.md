# Authentication

## Purpose

This document explains the current Supabase authentication setup.

## How Auth Works

The application uses Supabase Auth with email and password.

Browser and server clients are created with `@supabase/ssr` so authenticated sessions are stored in cookies and persist across refreshes.

## Role Metadata

Registration stores the selected account type in Supabase user metadata:

- `account_type = "specialist"`
- `account_type = "client"`

This metadata controls the first authenticated destination.

## Redirects

After registration:

- Specialists go to `/dashboard/profile`.
- Clients go to `/dashboard/client`.

After login:

- Specialists go to `/dashboard`.
- Clients go to `/dashboard/client`.

## Protected Routes

Middleware protects `/dashboard` and all nested dashboard routes.

Logged-out users are redirected to `/login`.

Public routes remain accessible:

- `/`
- `/login`
- `/register`
- `/profile/[slug]`
- `/profile/[slug]/book`
- `/session/[id]`

## Implemented

- Email and password registration.
- Email and password login.
- Account type selection during registration.
- Account type metadata storage.
- Logout from dashboard navigation.
- Cookie-based session persistence.
- Dashboard route protection.
- Loading, success, and error states in auth forms.

## Intentionally Delayed

- Client profile CRUD.
- Services CRUD.
- Bookings.
- Sessions persistence.
- Chat.
- Materials.
- Payments.
- Social login providers.
