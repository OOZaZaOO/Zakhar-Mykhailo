# Technical Debt

## High Priority

- `client_profiles` are required by product/database decisions but the table and CRUD do not exist.
- Public profile services still use mock data instead of the real `services` table.
- Booking and session routes are public/mock and have no real access control.
- Supabase types are manually maintained and should be generated from the remote project after migrations are finalized.
- Avatar storage migrations contain a historical bucket mismatch: current code uses `avatars`, while an older migration references `specialist-avatars`.
- No automated tests exist for auth redirects, profile completion, profile CRUD, services CRUD, or RLS-sensitive flows.

## Medium Priority

- Auth copy still contains some prototype-era language in register/login.
- Client navigation includes future routes that are not implemented.
- Services delete is hard delete; it should become archive/deactivate after bookings reference services.
- Public profile displays mock services even when real services exist.
- Calendar weekly availability replaces rows on save; future booking-aware updates may need versioning or audit handling.
- Header loads specialist profile in a client component after auth load, causing a small delayed identity update.
- Profile `contact_links` exists in database but is not represented by friendly UI fields.
- `visibility` remains in database but is not exposed in UI; current create flow inserts `public`.
- There is no formal error boundary strategy.

## Low Priority

- Many older documentation files are sparse placeholders.
- No test runner is configured.
- No generated API documentation exists because there are no custom API routes yet.
- No design-token documentation beyond current Tailwind classes.
- Some UI strings still mention future/mock behavior directly.
- Mock data remains broad and may drift from real schema.
