# Master Context

## Product Overview

The platform is a SaaS workspace for independent professionals who work with clients by appointment.

It helps specialists organize the client workflow around bookings, sessions, communication, materials, files, meeting links, and archive history.

The product is not a marketplace, social network, messenger, video-call platform, or full CRM.

## Target Audience

The primary users are independent professionals such as psychologists, tutors, consultants, lawyers, accountants, coaches, dietitians, trainers, therapists, mentors, and similar specialists.

These users usually bring clients from their own channels: social media, referrals, communities, personal websites, direct messages, or existing client relationships.

## Core Idea

The core idea is: one workspace for every client session.

Booking creates or leads to a dedicated session workspace. That workspace is where session-specific communication, materials, files, meeting links, notes, status, and history belong.

## Main Modules

- Landing page
- Authentication pages
- Specialist dashboard
- Calendar and availability
- Services
- Public profile
- Booking flow
- Session workspace
- Materials and files
- Archive
- Settings

## Current Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm
- GitHub
- Vercel

Planned after UI completion:

- Supabase for auth, database, storage, and realtime
- Payment provider later, not decided
- Email provider later, not decided

## Development Philosophy

Build the MVP as a simple monolithic Next.js application.

Keep the project frontend-first until the UI flows are clear.

Prefer simple components, mock data, clear routes, and practical UI over premature backend architecture.

## Current Project Stage

The project is in the UI-only MVP prototype stage.

Current implementation includes a single composed landing/mock page with domain components, mock data, shadcn/ui setup, and documentation.

Backend, auth, database, payments, real file storage, and real chat are not implemented yet.

## Things That Must Not Change Without Discussion

- The product is not a marketplace.
- The product is centered around session workspaces.
- Chat exists only inside a session.
- Materials are separate from chat.
- MVP starts frontend-first with mock data.
- Backend is added only after UI flows are stable.
- The app stays a simple monolith during MVP.
- External meeting links are used instead of built-in video calls.
- Product name is not finalized.
- Major new dependencies require discussion.
