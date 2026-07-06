# UI Pages

## Landing: `/`

Purpose: explain the product to guests and convert independent professionals.

Main sections: hero, dashboard preview, how it works, feature grid, audience, session workspace preview, pricing preview, FAQ, footer.

Primary actions: Start free, See demo, Log in.

Navigation: marketing links are shown only to guests. Authenticated users are redirected to their workspace.

## Login: `/login`

Purpose: authenticate returning users.

Main sections: social buttons UI-only, email/password form, remember me, forgot password link, account-type note.

Primary actions: Log in, Create account.

Navigation: authenticated users are redirected to their workspace.

## Register: `/register`

Purpose: create a Supabase Auth account.

Main sections: specialist/client selector, first name, last name, email, password, confirm password, password strength, terms checkbox, social signup buttons UI-only.

Primary actions: Create specialist account or Create client account.

Navigation: specialist redirects to `/dashboard/profile`; client redirects to `/dashboard/client`.

## Specialist Dashboard: `/dashboard`

Purpose: specialist overview.

Main sections: profile setup card when incomplete, mock dashboard stats, mock today's sessions.

Primary actions: Complete profile, view public profile when unlocked, open mock session.

Navigation: role-based dashboard sidebar.

## Client Dashboard Placeholder: `/dashboard/client`

Purpose: temporary workspace route for authenticated client accounts.

Main sections: polished placeholder content.

Primary actions: none real yet.

Navigation: client navigation config exists, but deeper client routes are not implemented yet.

## Profile: `/dashboard/profile`

Purpose: create and edit the specialist public profile.

Main sections: avatar upload, visible name, public slug, profession, country/timezone, languages, bio, working rules.

Primary actions: save changed profile fields through floating save bar, upload/change/remove avatar immediately.

Navigation: unlocks Services, Calendar, and Public Profile after visible name, slug, country, and timezone are complete.

## Services: `/dashboard/services`

Purpose: manage real bookable services in Supabase.

Main sections: service cards, active/inactive state, create/edit form overlay.

Primary actions: create, edit, delete, activate, deactivate.

Navigation: gated until profile completion is 100%.

## Calendar: `/dashboard/calendar`

Purpose: manage booking availability settings.

Main sections: specialist timezone, real booking-status toggle, weekly working-hours editor, quick setup actions.

Primary actions: turn accepting new bookings on/off, enable or disable days, add/remove time ranges, copy a day to weekdays or all days, save/cancel changes.

Navigation: gated until profile completion is 100%.

## Settings: `/dashboard/settings`

Purpose: account/workspace settings surface.

Main sections: currently mock cards.

Primary actions: none real yet.

## Archive: `/dashboard/archive`

Purpose: future completed-session history.

Main sections: currently mock archive cards.

Primary actions: open historical session mock.

## Public Profile: `/profile/[slug]`

Purpose: client-facing specialist profile.

Main sections: Supabase specialist profile, profile status badges, bio, languages, working rules, mock services.

Primary actions: book session when `is_accepting_bookings` is true.

Navigation: public route. If profile does not exist, renders 404. If hidden/private, renders unavailable state.

## Booking: `/profile/[slug]/book`

Purpose: future client booking flow.

Main sections: mock service, date, time, client details, comment.

Primary actions: confirm mock booking and open mock session.

Navigation: public route. Does not write to Supabase yet.

## Session Workspace: `/session/[id]`

Purpose: future collaboration space for one booked session.

Main sections: mock session summary, meeting link, chat, materials.

Primary actions: join meeting mock, archive mock.

Navigation: public route for now. Real access control is not implemented yet.
