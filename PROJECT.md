# BuyMyTime MVP Product Requirements

## Product Summary

BuyMyTime is a SaaS platform for professionals who sell access to their time: consultants, coaches, mentors, tutors, therapists, advisors, creators, and independent specialists. The MVP helps a specialist publish a public booking profile, accept paid or free bookings, run a scheduled session with chat and materials, attach files, provide a meeting link, and keep a post-session archive.

The product should feel trustworthy, efficient, and focused. Specialists need setup to be fast; clients need booking to feel obvious and low-friction.

## MVP Goals

- Let a specialist create an account and configure a public profile.
- Let clients discover a specialist profile and book a time slot.
- Let specialists manage upcoming, active, and archived sessions.
- Provide a session workspace containing chat, materials, uploaded files, meeting link, and session notes/archive.
- Provide enough landing-page content to explain the product and convert specialists.
- Establish a clean foundation for future billing, marketplace discovery, integrations, and analytics.

## Non-Goals For MVP

- Full marketplace search across all specialists.
- Native video calling.
- Complex multi-staff organization scheduling.
- Subscription billing for specialists.
- Automatic calendar synchronization.
- Advanced CRM, email marketing, or client segmentation.
- Mobile native apps.
- AI features.

## Primary Users

### Specialist

A professional who sells time-based services. They need a public booking presence, a way to organize sessions, and a simple workspace to share information before, during, and after the session.

Key needs:

- Create a trustworthy profile quickly.
- Define services and availability.
- Receive bookings.
- Prepare materials before a session.
- Communicate with the client.
- Keep session history organized.

### Client

A person booking time with a specialist. They need to understand the offer, pick a time, provide basic details, and access session resources.

Key needs:

- Understand who the specialist is and what they offer.
- Pick an available service and time.
- Receive clear confirmation.
- Access the session workspace and meeting link.
- Find shared materials and files after the session.

## Core MVP Surfaces

### 1. Landing Page

Purpose: convert specialists into signups.

Required sections:

- Hero with product name, short value proposition, and primary signup call-to-action.
- Brief explanation of how it works.
- Feature overview:
  - Public profile.
  - Bookings.
  - Session workspace.
  - Files and materials.
  - Archive.
- Example professional categories.
- Pricing placeholder or simple "MVP early access" message.
- Footer with basic links.

Primary actions:

- Sign up.
- Log in.
- View sample profile.

Success criteria:

- A new visitor understands the product within 10 seconds.
- A specialist can start account creation from the first viewport.

### 2. Authentication

Purpose: allow specialists and clients to access private areas.

MVP requirements:

- Email and password signup.
- Email and password login.
- Logout.
- Basic password reset flow can be planned, but may be deferred if using an auth provider that supplies it.
- User roles:
  - Specialist.
  - Client.

Rules:

- Specialists have dashboards and profile management.
- Clients can access their booked session workspaces.
- Public profiles are viewable without login.
- Booking may allow guest flow if technically simple, but authenticated client accounts are acceptable for MVP.

### 3. Specialist Dashboard

Purpose: central workspace for the professional.

Required views:

- Overview:
  - Upcoming sessions.
  - Recent activity.
  - Profile completion status.
- Bookings:
  - Upcoming.
  - Past.
  - Cancelled.
- Services:
  - Create and edit service offerings.
  - Name, description, duration, price, and visibility.
- Availability:
  - Weekly availability blocks.
  - Basic unavailable dates or manual blocking if feasible.
- Profile:
  - Name.
  - Title.
  - Bio.
  - Photo/avatar.
  - Expertise tags.
  - Location/time zone.
  - Public URL slug.
  - Social/professional links.
- Materials:
  - Reusable files or links that can be attached to sessions.

Primary actions:

- Edit public profile.
- Add service.
- Set availability.
- Open upcoming session.
- Copy public profile link.

Success criteria:

- A specialist can go from empty account to bookable profile.
- Upcoming sessions are visible without digging through settings.
- Session workspace is one click away from dashboard.

### 4. Public Specialist Profile

Purpose: let clients evaluate and book a specialist.

Required content:

- Specialist name, title, photo/avatar.
- Short bio and longer description.
- Expertise tags.
- Services list with duration and price.
- Booking call-to-action.
- Professional links if provided.
- Optional testimonials placeholder, not required for MVP.

Required behavior:

- Public route based on specialist slug.
- Clear empty states when no services are available.
- Service selection starts booking flow.

Success criteria:

- Client can understand the specialist and choose a service.
- Specialist profile can be shared as a direct link.

### 5. Booking Flow

Purpose: allow a client to reserve time with a specialist.

Required steps:

1. Select service.
2. Select available date and time.
3. Enter client details:
   - Name.
   - Email.
   - Optional message or goal for the session.
4. Review booking details.
5. Confirm booking.

MVP payment options:

- Support free bookings first.
- Store price on service and booking records.
- Payment collection can be deferred, but the data model should not block future Stripe integration.

Booking rules:

- Only show available time slots based on service duration and specialist availability.
- Prevent double booking.
- Record booking status:
  - Pending.
  - Confirmed.
  - Cancelled.
  - Completed.
  - Archived.
- Generate or assign a session workspace for every confirmed booking.

Notifications:

- MVP may display confirmation in-app only.
- Email confirmation should be planned as an early follow-up if not included in first build.

Success criteria:

- Client can complete booking without specialist intervention.
- Specialist sees the booking in dashboard.
- Both parties can access the session workspace.

### 6. Session Workspace

Purpose: shared space for specialist and client before, during, and after the booked session.

Required elements:

- Session header:
  - Specialist.
  - Client.
  - Service.
  - Date/time.
  - Status.
- Meet link:
  - Field for specialist to paste a Google Meet or external meeting URL.
  - Prominent join button when link exists.
- Chat:
  - Threaded or simple chronological messages.
  - Sender attribution.
  - Timestamp.
  - Specialist and client can both send messages.
- Materials:
  - Specialist can attach reusable materials.
  - Materials can be links or uploaded files.
  - Client can view/download.
- Files:
  - Specialist and client can upload session-specific files if storage is available.
  - File name, size, uploader, upload date.
- Notes:
  - Private specialist notes should be planned.
  - Shared notes or summary can be MVP if simple.
- Archive:
  - After completion, workspace becomes read-only or mostly read-only.
  - Chat, materials, files, and meeting details remain accessible.

Success criteria:

- Workspace contains everything needed to prepare for and join the session.
- Materials and files remain available after the session.
- Archived sessions can be found from dashboard.

### 7. Archive

Purpose: preserve session history and shared resources.

Required behavior:

- Specialist can mark a session complete.
- Completed sessions move to archive or past bookings.
- Archived session detail page shows:
  - Booking details.
  - Chat history.
  - Materials.
  - Files.
  - Meeting link.
  - Completion timestamp.
- Archived sessions should not be accidentally deleted.

Success criteria:

- Specialist can review previous work with a client.
- Client can return to shared materials after the session.

## Data Model Draft

### User

- id
- email
- password/auth provider id
- role
- createdAt
- updatedAt

### SpecialistProfile

- id
- userId
- slug
- displayName
- title
- bioShort
- bioLong
- avatarUrl
- expertiseTags
- timezone
- links
- published
- createdAt
- updatedAt

### Service

- id
- specialistProfileId
- name
- description
- durationMinutes
- priceAmount
- currency
- active
- createdAt
- updatedAt

### AvailabilityBlock

- id
- specialistProfileId
- dayOfWeek
- startTime
- endTime
- timezone
- active

### Booking

- id
- specialistProfileId
- serviceId
- clientUserId
- clientName
- clientEmail
- clientMessage
- startsAt
- endsAt
- status
- priceAmount
- currency
- createdAt
- updatedAt

### SessionWorkspace

- id
- bookingId
- meetLink
- status
- archivedAt
- createdAt
- updatedAt

### Message

- id
- workspaceId
- senderUserId
- body
- createdAt

### Material

- id
- specialistProfileId
- title
- type
- url
- fileId
- createdAt
- updatedAt

### WorkspaceMaterial

- id
- workspaceId
- materialId
- addedAt

### FileAsset

- id
- ownerUserId
- workspaceId
- fileName
- mimeType
- sizeBytes
- storagePath
- createdAt

## Permissions

- Public:
  - View landing page.
  - View published specialist profiles.
- Specialist:
  - Manage own profile, services, availability, materials.
  - View and manage own bookings.
  - Access session workspaces for own bookings.
  - Upload files and attach materials.
  - Add or edit Meet link.
  - Mark sessions complete/archive.
- Client:
  - View own bookings and workspaces.
  - Send workspace chat messages.
  - Upload files to own session workspace.
  - View attached materials and files.

## Key User Journeys

### Specialist Onboarding

1. Specialist lands on marketing page.
2. Specialist signs up.
3. Specialist enters profile basics.
4. Specialist creates first service.
5. Specialist sets weekly availability.
6. Specialist publishes profile.
7. Specialist copies profile link.

### Client Booking

1. Client opens specialist profile link.
2. Client selects service.
3. Client chooses date and time.
4. Client enters details.
5. Client confirms booking.
6. Client sees confirmation and workspace link.

### Session Preparation

1. Specialist opens booking from dashboard.
2. Specialist adds Meet link.
3. Specialist attaches materials.
4. Client sends pre-session context in chat.
5. Both parties join via workspace.

### Session Archive

1. Specialist marks session complete.
2. Workspace becomes archived.
3. Specialist can find session under past bookings.
4. Client can revisit materials and files.

## MVP Implementation Roadmap

### Phase 0: Project Foundation

- Choose stack and app architecture.
- Set up repository conventions.
- Define environment variables.
- Add database schema/migrations.
- Add authentication provider.
- Add basic design system and layout shell.

Exit criteria:

- App boots locally.
- Database connection works.
- Authenticated and unauthenticated routes can be protected.

### Phase 1: Landing And Auth

- Build landing page.
- Implement signup, login, logout.
- Add role assignment for specialists and clients.
- Create initial specialist onboarding route after signup.

Exit criteria:

- Specialist can create an account and reach dashboard.
- Public visitor can navigate to login/signup.

### Phase 2: Specialist Profile And Dashboard

- Build dashboard shell.
- Add profile editor.
- Add service management.
- Add weekly availability management.
- Add public profile route.
- Add publish/unpublish behavior.

Exit criteria:

- Specialist can publish a shareable profile with at least one service.
- Public profile displays specialist and service information.

### Phase 3: Booking Flow

- Build service selection.
- Build date/time picker based on availability.
- Add booking details form.
- Add booking confirmation.
- Create booking and session workspace records.
- Prevent overlapping bookings.

Exit criteria:

- Client can book an available slot.
- Specialist sees booking in dashboard.
- Booking creates a workspace.

### Phase 4: Session Workspace

- Build workspace page for specialist and client.
- Add session details header.
- Add Meet link management.
- Add chat.
- Add reusable materials.
- Add workspace file uploads if storage is ready.
- Add permissions for both participants.

Exit criteria:

- Specialist and client can access the same workspace.
- Both can chat.
- Specialist can add Meet link and materials.
- Workspace is private to session participants.

### Phase 5: Archive And Polish

- Add complete/archive action.
- Add past booking/archive view.
- Make archived workspace read-only where appropriate.
- Improve empty states and loading states.
- Add basic email notifications if feasible.
- Add QA pass for permissions, booking overlaps, and responsive layout.

Exit criteria:

- Completed sessions are preserved and discoverable.
- Core flows work on desktop and mobile.
- MVP is ready for private beta.

## Suggested First Technical Milestone

The first implementation milestone should produce a clickable vertical slice:

- Landing page.
- Specialist signup/login.
- Specialist dashboard.
- Profile editor.
- Public profile.
- One service.
- Manual availability.
- Booking form.
- Workspace page stub.

This gives the product a real end-to-end shape before deeper workspace functionality is added.

## Future Enhancements

- Stripe payments and specialist payout handling.
- Calendar sync with Google Calendar and Outlook.
- Automated Google Meet generation.
- Email and SMS notifications.
- Client portal.
- Package deals and recurring sessions.
- Intake forms.
- Coupons and discounts.
- Reviews and testimonials.
- Public marketplace search.
- Organization/team accounts.
- Analytics for profile views, booking conversion, and revenue.
- AI-generated session summaries.

## MVP Acceptance Checklist

- A visitor can understand the product from the landing page.
- A specialist can sign up and log in.
- A specialist can create and publish a profile.
- A specialist can create at least one service.
- A specialist can define bookable availability.
- A client can view a public profile.
- A client can book an available session.
- A booking appears in the specialist dashboard.
- A booking creates a private session workspace.
- Specialist and client can access the workspace.
- Workspace includes chat, materials, files, Meet link, and archive behavior.
- Completed sessions remain accessible as archived records.
