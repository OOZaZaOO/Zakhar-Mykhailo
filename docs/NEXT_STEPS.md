# Next Steps

## Recommended Implementation Order

## 1. Client Profiles

Create the `client_profiles` migration and connect client account creation to a profile record.

Why next:

- Product decisions require client accounts in MVP.
- Bookings and sessions need client ownership and RLS.

## 2. Booking Schema And Flow

Create bookings table and implement service/date/time/client confirmation flow.

Why next:

- This is the bridge from public profile to Session Workspace.

## 3. Session Schema

Create sessions from bookings with one-to-one `booking_id`.

Why next:

- Session Workspace is the core product object.

## 4. Session Access Control

Protect sessions so only the specialist and client can access them.

Why next:

- Current `/session/[id]` is public/mock.

## 5. Session Chat

Implement messages scoped only to sessions.

Why next:

- Chat is part of the core workspace, but must not become global messaging.

## 6. Materials And Files

Add session materials and file uploads.

Why next:

- Materials/files are central to post-session value and archive history.

## 7. Archive

Persist completed and archived session states.

Why next:

- Archive validates the complete session lifecycle.

## 8. Notifications And Email

Add booking/session notifications after core flows are stable.

## 9. Payments

Choose provider and add payment flow after booking logic is stable.

## Do Not Prioritize Yet

- Marketplace discovery.
- Built-in video calls.
- Team accounts.
- Advanced analytics.
- AI automation.
- Complex CRM features.
