# Database Schema Design

## Purpose

This document designs the future Supabase/PostgreSQL schema for the platform.

It is documentation only. Do not treat this file as a migration.

Do not create tables, execute SQL, or implement backend logic from this document until the schema is reviewed.

## Source Of Truth

This design follows [MASTER_CONTEXT.md](./MASTER_CONTEXT.md):

- the platform is not a marketplace;
- the product is centered around session workspaces;
- chat exists only inside a session;
- materials are separate from chat;
- MVP starts frontend-first with mock data;
- Supabase is planned for auth, database, storage, and realtime after UI flows are stable.

## Entity Relationship Overview

```text
auth.users
  1 -> 1 specialist_profiles
  1 -> 1 client_profiles

specialist_profiles
  1 -> many services
  1 -> many availability_blocks
  1 -> many bookings
  1 -> many sessions
  1 -> many materials

client_profiles
  1 -> many bookings
  1 -> many sessions

services
  1 -> many bookings
  1 -> many sessions

bookings
  1 -> 1 session

sessions
  1 -> many messages
  1 -> many materials
  1 -> many files

materials
  many -> 1 session
  many -> 1 specialist_profile

files
  many -> 1 session
  many -> 1 material, optional
  many -> 1 message, optional
```

## Permissions Model

- Public users can read published specialist profiles and active public services.
- Specialists can manage their own profile, services, availability, bookings, sessions, messages, materials, and files.
- Clients can access their own cabinet, bookings, session history, archived sessions, session workspaces, materials, and files through `client_profiles.user_id = auth.uid()`.
- Clients can read and participate only in their own bookings and session workspaces.
- Guest booking may be considered later, but authenticated client profiles are the primary MVP model.
- Chat is scoped to a session. There is no global messaging.
- Materials are scoped to sessions and can optionally become reusable later.
- Admin tables and admin permissions are delayed.

## MVP Table List

Recommended MVP schema:

- `specialist_profiles`
- `client_profiles`
- `services`
- `availability_blocks`
- `availability_exceptions`
- `bookings`
- `sessions`
- `messages`
- `materials`
- `files`

## Booking Lifecycle

Recommended booking statuses:

- `draft`
- `pending`
- `confirmed`
- `cancelled`
- `completed`

Typical flow:

1. Client selects service, date, and time.
2. Client enters contact details and a comment.
3. Booking is created as `pending` or `confirmed`.
4. Session is created from the booking.
5. Specialist prepares workspace.
6. Session moves toward completion.

## Session Lifecycle

Recommended session statuses:

- `pending`
- `confirmed`
- `active`
- `completed`
- `archived`
- `cancelled`

Typical flow:

1. Session is created from booking.
2. Specialist adds meeting link and materials.
3. Client and specialist communicate inside session chat.
4. Session becomes completed.
5. Session becomes archived.
6. Archived sessions are mostly read-only.

## Tables

## auth.users

### Purpose

Supabase-managed authentication table. Application tables reference this table but do not own it.

### Columns

Managed by Supabase Auth.

Common referenced fields:

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary user id. |
| email | text | User email. |
| created_at | timestamptz | Auth creation time. |

### Relationships

- `auth.users.id` -> `specialist_profiles.user_id`
- `auth.users.id` -> `client_profiles.user_id`

### Indexes

Managed by Supabase.

### Row Level Security Rules

Managed by Supabase Auth. Application tables should use `auth.uid()`.

### Important Constraints

- Do not duplicate authentication credentials in application tables.
- Do not store passwords outside Supabase Auth.

### Example Record

```json
{
  "id": "00000000-0000-0000-0000-000000000001",
  "email": "specialist@example.com"
}
```

### MVP

- Use Supabase Auth user id as the owner id for specialist and client profiles.

### Delayed

- Social auth providers.
- Admin role management.
- Organization accounts.

## specialist_profiles

### Purpose

Stores public and private profile information for specialists.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| user_id | uuid | References `auth.users.id`. Unique. |
| slug | text | Public profile slug. Unique. |
| display_name | text | Specialist name. |
| profession | text | Public professional title. |
| bio | text | Profile biography. |
| avatar_url | text | Optional avatar file URL. |
| timezone | text | IANA timezone string selected through country/timezone UI. Stores values such as `Europe/Bratislava`, not display labels. |
| languages | text[] | Optional language list. |
| contact_links | jsonb | Optional public links. |
| working_rules | text | Rules shown to clients. |
| visibility | text | `public`, `private`, `hidden`. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `auth.users`.
- Has many `services`.
- Has many `availability_blocks`.
- Has many `bookings`.
- Has many `sessions`.
- Has many `materials`.

### Indexes

- Unique index on `user_id`.
- Unique index on `slug`.
- Index on `visibility`.

### Row Level Security Rules

- Public can read rows where `visibility = 'public'`.
- Specialist can read and update own row where `user_id = auth.uid()`.
- Only authenticated users can create their own specialist profile.

### Important Constraints

- `slug` must be unique and URL-safe.
- `visibility` must be one of `public`, `private`, `hidden`.
- One auth user should have at most one specialist profile in MVP.

### Example Record

```json
{
  "id": "sp_001",
  "user_id": "00000000-0000-0000-0000-000000000001",
  "slug": "maya-sterling",
  "display_name": "Maya Sterling",
  "profession": "Product Strategy Advisor",
  "timezone": "Europe/Kyiv",
  "visibility": "public"
}
```

### MVP

- Profile owner.
- Slug.
- Display name.
- Profession.
- Bio.
- Timezone.
- Visibility.
- Create, read, and update flow at `/dashboard/profile`.

### Delayed

- Avatar upload.
- Private invitation codes.
- Themes.
- Custom domains.
- Multi-specialist organizations.

## client_profiles

### Purpose

Stores client identity information for authenticated client accounts in the MVP.

Client profiles are required for client dashboard access, session history, archived sessions, materials, files, and session workspace access control.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| user_id | uuid | References `auth.users.id`. Unique. |
| display_name | text | Client name. |
| email | text | Client email. |
| phone | text | Optional phone number. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `auth.users`.
- Has many `bookings`.
- Has many `sessions`.

### Indexes

- Unique index on `user_id`.
- Index on `email`.

### Row Level Security Rules

- Client can read and update own profile if `user_id = auth.uid()`.
- Specialist can read client profile only when connected through their own booking or session.
- Public cannot list client profiles.

### Important Constraints

- One auth user should have at most one client profile in MVP.
- `user_id` is required for MVP client cabinet and session access control.
- Guest booking may be considered later, but it is not the primary MVP model.

### Example Record

```json
{
  "id": "cp_001",
  "user_id": "00000000-0000-0000-0000-000000000002",
  "display_name": "Nina Park",
  "email": "nina@example.com"
}
```

### MVP

- Client name.
- Client email.
- Required link to auth user.
- Client dashboard access.
- Session history access.
- Archived session access.
- Session workspace access control.

### Delayed

- Client profile history.
- Client preferences.
- Guest booking.

## services

### Purpose

Defines bookable offers created by a specialist.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| specialist_profile_id | uuid | References `specialist_profiles.id`. |
| title | text | Service name. |
| description | text | Public description. |
| duration_minutes | integer | Session duration. |
| price_amount | integer | Minor currency units. |
| currency | text | Example: `USD`, `EUR`, `UAH`. |
| format | text | `online`, `offline`, `async`. |
| is_active | boolean | Whether clients can book it. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `specialist_profiles`.
- Has many `bookings`.
- Has many `sessions`.

### Indexes

- Index on `specialist_profile_id`.
- Index on `(specialist_profile_id, is_active)`.

### Row Level Security Rules

- Public can read active services for public specialist profiles.
- Specialist can create, read, update, and delete own services.
- Clients can read services linked to their bookings.

### Important Constraints

- `duration_minutes` must be positive.
- `price_amount` must be zero or positive.
- `format` must be one of `online`, `offline`, `async`.

### Example Record

```json
{
  "id": "svc_001",
  "specialist_profile_id": "sp_001",
  "title": "Roadmap Reset",
  "duration_minutes": 60,
  "price_amount": 18000,
  "currency": "USD",
  "format": "online",
  "is_active": true
}
```

### MVP

- Title.
- Description.
- Duration.
- Price.
- Currency.
- Format.
- Active status.

### Delayed

- Service categories.
- Per-service availability.
- Packages.
- Recurring services.

## availability_blocks

### Purpose

Stores when a specialist is generally available for bookings.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| specialist_profile_id | uuid | References `specialist_profiles.id`. |
| day_of_week | integer | 0-6 or 1-7, choose one convention before migration. |
| start_time | time | Local start time. |
| end_time | time | Local end time. |
| timezone | text | IANA timezone. |
| is_active | boolean | Whether this block is bookable. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `specialist_profiles`.
- Used to calculate possible `bookings`.

### Indexes

- Index on `specialist_profile_id`.
- Index on `(specialist_profile_id, day_of_week, is_active)`.

### Row Level Security Rules

- Public can read active availability for public specialist profiles.
- Specialist can manage own availability blocks.

### Important Constraints

- `start_time` must be before `end_time`.
- `day_of_week` must stay within the chosen convention.
- Timezone should match or intentionally override specialist timezone.

### Example Record

```json
{
  "id": "av_001",
  "specialist_profile_id": "sp_001",
  "day_of_week": 1,
  "start_time": "09:00",
  "end_time": "17:00",
  "timezone": "Europe/Kyiv",
  "is_active": true
}
```

### MVP

- Weekly availability blocks.
- Active/inactive state.

### Delayed

- Holidays.
- Vacation mode.
- Per-service availability.
- Recurring exceptions.
- Calendar sync.

## bookings

### Purpose

Stores the appointment request or confirmation that connects a specialist, client, service, and time.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| specialist_profile_id | uuid | References `specialist_profiles.id`. |
| client_profile_id | uuid | References `client_profiles.id`. |
| service_id | uuid | References `services.id`. |
| starts_at | timestamptz | Start datetime. |
| ends_at | timestamptz | End datetime. |
| client_name_snapshot | text | Client name at booking time. |
| client_email_snapshot | text | Client email at booking time. |
| client_comment | text | Comment entered during booking. |
| status | text | Booking lifecycle status. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `specialist_profiles`.
- Belongs to `client_profiles`.
- Belongs to `services`.
- Has one `sessions`.

### Indexes

- Index on `specialist_profile_id`.
- Index on `client_profile_id`.
- Index on `service_id`.
- Index on `(specialist_profile_id, starts_at)`.
- Index on `status`.

### Row Level Security Rules

- Specialist can read and manage bookings for own profile.
- Client can read bookings connected to own client profile through `client_profiles.user_id = auth.uid()`.
- Booking creation should require a valid client profile in the MVP.

### Important Constraints

- `starts_at` must be before `ends_at`.
- `status` must be one of `draft`, `pending`, `confirmed`, `cancelled`, `completed`.
- Prevent double-booking for confirmed sessions.

### Example Record

```json
{
  "id": "book_001",
  "specialist_profile_id": "sp_001",
  "client_profile_id": "cp_001",
  "service_id": "svc_001",
  "starts_at": "2026-07-10T13:00:00Z",
  "ends_at": "2026-07-10T14:00:00Z",
  "client_comment": "I want to clarify roadmap priorities.",
  "status": "confirmed"
}
```

### MVP

- Specialist.
- Client.
- Client profile reference.
- Service.
- Start/end time.
- Client comment.
- Status.

### Delayed

- Payment status details.
- Rescheduling history.
- Cancellation policy automation.
- Coupons.

## sessions

### Purpose

Stores the session workspace. This is the core product object.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| booking_id | uuid | References `bookings.id`. Unique. |
| specialist_profile_id | uuid | References `specialist_profiles.id`. |
| client_profile_id | uuid | References `client_profiles.id`. |
| service_id | uuid | References `services.id`. |
| status | text | Session lifecycle status. |
| meeting_url | text | External Meet/Zoom/etc link. |
| private_notes | text | Specialist-only notes, optional. |
| shared_summary | text | Optional client-visible summary. |
| archived_at | timestamptz | Archive timestamp. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `bookings`.
- Belongs to `specialist_profiles`.
- Belongs to `client_profiles`.
- Belongs to `services`.
- Has many `messages`.
- Has many `materials`.
- Has many `files`.

### Indexes

- Unique index on `booking_id`.
- Index on `specialist_profile_id`.
- Index on `client_profile_id`.
- Index on `status`.
- Index on `archived_at`.

### Row Level Security Rules

- Specialist can read and manage sessions for own profile.
- Client can read sessions connected to own client profile through `client_profiles.user_id = auth.uid()`.
- Client can participate only while session is not archived or cancelled.
- Archived sessions should be read-only except for future reopen logic.

### Important Constraints

- One booking creates one session.
- `status` must be one of `pending`, `confirmed`, `active`, `completed`, `archived`, `cancelled`.
- `meeting_url` must be external; no built-in video system in MVP.

### Example Record

```json
{
  "id": "sess_001",
  "booking_id": "book_001",
  "specialist_profile_id": "sp_001",
  "client_profile_id": "cp_001",
  "service_id": "svc_001",
  "status": "confirmed",
  "meeting_url": "https://meet.google.com/example"
}
```

### MVP

- Booking link.
- Specialist.
- Client.
- Client profile reference.
- Service.
- Status.
- Meeting URL.
- Archive state.

### Delayed

- Shared summaries.
- Private notes.
- Reopen archived session.
- Session templates.

## messages

### Purpose

Stores chat messages scoped only to a session.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| session_id | uuid | References `sessions.id`. |
| sender_user_id | uuid | References `auth.users.id`. |
| sender_role | text | `specialist`, `client`, or `system`. |
| body | text | Message text. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |
| deleted_at | timestamptz | Optional soft delete. |

### Relationships

- Belongs to `sessions`.
- Belongs to sender in `auth.users`.
- May have files attached in future through `files.message_id`.

### Indexes

- Index on `session_id`.
- Index on `(session_id, created_at)`.
- Index on `sender_user_id`.

### Row Level Security Rules

- Specialist can read and send messages in own sessions.
- Client can read and send messages in own sessions through `client_profiles.user_id = auth.uid()`.
- No user can message outside a session.
- No new messages when session is archived or cancelled.

### Important Constraints

- `body` should not be empty unless file-only messages are supported later.
- `sender_role` should be one of `specialist`, `client`, `system`.
- `sender_user_id` should be required for specialist and client messages and may be nullable for system messages.
- Messages are not global.

### Example Record

```json
{
  "id": "msg_001",
  "session_id": "sess_001",
  "sender_user_id": "00000000-0000-0000-0000-000000000001",
  "sender_role": "specialist",
  "body": "I added the roadmap notes before our call."
}
```

### MVP

- Session-scoped text messages.
- Sender.
- Timestamp.

### Delayed

- Reactions.
- Editing.
- Search.
- Read receipts.
- File-only messages.

## materials

### Purpose

Stores structured content shared with a client inside a session. Materials are separate from chat.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| session_id | uuid | References `sessions.id`. |
| specialist_profile_id | uuid | References `specialist_profiles.id`. |
| title | text | Material title. |
| body | text | Structured content. |
| material_type | text | Example: `text`, `link`, `checklist`, `homework`, `exercise`, `plan`. |
| url | text | Optional link. |
| is_visible_to_client | boolean | Client visibility. |
| created_at | timestamptz | Insert timestamp. |
| updated_at | timestamptz | Update timestamp. |

### Relationships

- Belongs to `sessions`.
- Belongs to `specialist_profiles`.
- Has many `files`.

### Indexes

- Index on `session_id`.
- Index on `specialist_profile_id`.
- Index on `material_type`.

### Row Level Security Rules

- Specialist can manage materials in own sessions.
- Client can read visible materials in own sessions through `client_profiles.user_id = auth.uid()`.
- Client cannot create specialist materials in MVP.

### Important Constraints

- Materials are not chat messages.
- Material must have a title.
- Hidden materials should not be visible to clients.

### Example Record

```json
{
  "id": "mat_001",
  "session_id": "sess_001",
  "specialist_profile_id": "sp_001",
  "title": "Session agenda",
  "material_type": "text",
  "is_visible_to_client": true
}
```

### MVP

- Session-specific materials.
- Title.
- Body or URL.
- Visibility.

### Delayed

- Reusable material templates.
- Due dates.
- Completion status.
- Material categories.

## files

### Purpose

Stores metadata for files attached to sessions, materials, or messages. Actual binary storage should use Supabase Storage.

### Columns

| Column | Type | Notes |
| --- | --- | --- |
| id | uuid | Primary key. |
| session_id | uuid | References `sessions.id`. |
| material_id | uuid | Optional reference to `materials.id`. |
| message_id | uuid | Optional reference to `messages.id`. |
| uploaded_by_user_id | uuid | References `auth.users.id`. |
| bucket | text | Supabase Storage bucket. |
| storage_path | text | Storage object path. |
| file_name | text | Original or display name. |
| mime_type | text | File MIME type. |
| size_bytes | bigint | File size. |
| created_at | timestamptz | Insert timestamp. |

### Relationships

- Belongs to `sessions`.
- Optionally belongs to `materials`.
- Optionally belongs to `messages`.
- Belongs to uploader in `auth.users`.

### Indexes

- Index on `session_id`.
- Index on `material_id`.
- Index on `message_id`.
- Index on `uploaded_by_user_id`.
- Unique index on `(bucket, storage_path)`.

### Row Level Security Rules

- Specialist can read and manage files in own sessions.
- Client can read files in own sessions through `client_profiles.user_id = auth.uid()`.
- Client uploads may be allowed only for active session workspaces.
- Archived sessions should not accept new files in MVP.

### Important Constraints

- `storage_path` must be unique inside a bucket.
- File must belong to a session.
- File may optionally belong to a material or message.

### Example Record

```json
{
  "id": "file_001",
  "session_id": "sess_001",
  "material_id": "mat_001",
  "uploaded_by_user_id": "00000000-0000-0000-0000-000000000001",
  "bucket": "session-files",
  "storage_path": "sessions/sess_001/agenda.pdf",
  "file_name": "agenda.pdf",
  "mime_type": "application/pdf",
  "size_bytes": 142000
}
```

### MVP

- File metadata model.
- Session ownership.
- Storage path.
- Uploader.

### Delayed

- Version history.
- File previews.
- Virus scanning.
- Expiring links.
- Large file workflows.

## Future Tables

## payments

Purpose: store payment attempts, provider references, and payment state.

Delay until payment architecture is decided.

## subscriptions

Purpose: store specialist plan, billing period, and entitlement state.

Delay until business model is finalized.

## notifications

Purpose: store email, push, or Telegram notification events.

Delay until notification channels are selected.

## integrations

Purpose: store external provider connections such as calendar, meeting, email, or payment integrations.

Delay until integration priorities are confirmed.

## Implementation Notes

- Do not create these tables yet.
- Do not execute SQL yet.
- Review RLS rules before any migration.
- Generate real Supabase types after migrations exist.
- Keep the first backend milestone small: auth, profiles, services, and availability before session workspace persistence.
