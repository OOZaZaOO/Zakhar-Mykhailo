# Features

## Implemented

- Landing page.
- Login page.
- Register page with specialist/client account type.
- Supabase email/password auth.
- Logout.
- Authenticated redirects and protected dashboard routes.
- Role-based navigation configuration.
- Specialist dashboard shell.
- Specialist profile create/edit/load from Supabase.
- Visible name, slug, profession, country/timezone, languages, bio, and working rules form.
- Slug normalization and availability check when edited.
- Persistent avatar upload/removal through Supabase Storage.
- Header user identity and avatar/initials.
- Profile completion percentage.
- Profile gating for Services, Calendar, and Public Profile.
- Services CRUD connected to Supabase.
- Booking status toggle persisted to Supabase.
- Public specialist profile loaded by slug from Supabase.

## Partially Implemented

- Calendar: booking status is real; availability slots are mock.
- Public profile: specialist data is real; service list is mock.
- Client dashboard: placeholder only.
- Archive/settings/session workspace/booking flow: UI mock only.

## Not Implemented

- Client profile database table and CRUD.
- Real availability CRUD.
- Booking persistence.
- Session persistence.
- Chat persistence.
- Materials persistence.
- Files persistence outside avatars.
- Archive persistence.
- Payments.
- Notifications and email.
- Analytics.
- Integrations.
