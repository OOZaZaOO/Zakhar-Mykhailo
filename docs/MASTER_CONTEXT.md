# Master Project Context

## Purpose of this document

This file is the main context file for the project.

Any developer or AI assistant working on the project should read this file first before making decisions or writing code.

The goal of this document is to explain:
- what the platform is;
- who it is for;
- what problem it solves;
- what has already been decided;
- what should not be changed without discussion;
- what the current development priorities are.

---

## Product summary

The platform is a SaaS product for independent professionals who work with clients by appointment.

It is intended for professionals such as:
- psychologists;
- tutors;
- consultants;
- lawyers;
- accountants;
- coaches;
- dietitians;
- trainers;
- therapists;
- mentors;
- other specialists who sell their time and expertise.

The platform is not a marketplace.

The goal is not to help clients discover random specialists.  
The specialist usually already gets clients from Instagram, Telegram, TikTok, Facebook, referrals, personal websites, or other channels.

The platform helps the specialist organize work with those clients.

---

## Core idea

The product is more than a booking calendar.

A client opens the specialist’s public profile, chooses a service, picks an available time, leaves a comment, and books or requests a session.

After booking, the platform creates a dedicated session workspace.

This session workspace is the core feature.

Each session workspace may include:
- session details;
- date and time;
- service type;
- client information;
- payment status;
- Google Meet or Zoom link;
- session-specific chat;
- materials;
- files;
- notes;
- archive status.

The key idea:

Booking tools stop after the appointment is created.  
This platform helps manage everything that happens before, during, and after the session.

---

## Product positioning

Main positioning:

One workspace for every client. Every session.

Alternative positioning:
- A workspace for independent professionals.
- More than booking.
- From booking to follow-up in one place.
- Run your practice from one workspace.
- Everything you need to work with clients in one place.

Do not position the product as:
- a marketplace;
- a social network;
- a general messenger;
- a video-call platform;
- only a calendar;
- only a CRM.

The platform should feel like a lightweight operating system for independent professionals.

---

## Main user roles

### Specialist

The specialist is the professional who provides services.

They can:
- create a profile;
- describe themselves;
- add services;
- set prices;
- configure availability;
- share a public or private link;
- receive bookings;
- manage sessions;
- add meeting links;
- send materials;
- communicate inside session workspaces;
- close and archive sessions.

### Client

The client is the person booking a session with a specialist.

They can:
- open a specialist profile;
- view services;
- view available time slots;
- book or request a session;
- leave a comment;
- access the session workspace;
- read messages;
- receive materials;
- open files;
- join the external meeting link;
- access archived session history.

### Admin

Admin functionality is not part of the first MVP.

It may be added later for moderation, support, analytics, billing, and system management.

---

## Main user flow

### Specialist flow

1. Specialist registers.
2. Specialist creates a profile.
3. Specialist adds services.
4. Specialist sets prices and durations.
5. Specialist configures working hours.
6. Specialist gets a public profile link.
7. Specialist shares the link on Instagram, Telegram, website, or directly with clients.
8. Client books a session.
9. Specialist sees the booking in the dashboard.
10. A session workspace is created.
11. Specialist adds a meeting link if needed.
12. Specialist communicates with the client inside the session workspace.
13. Specialist shares materials or files.
14. After the session, specialist closes it.
15. The session becomes archived.

### Client flow

1. Client opens the specialist’s link.
2. Client views profile, services, prices, rules, and available times.
3. Client selects a service.
4. Client selects date and time.
5. Client enters contact details and a comment.
6. Client confirms booking.
7. Client gets access to the session workspace.
8. Client sees meeting link, messages, files, and materials.
9. After completion, client can view the archived session.

---

## Session workspace

The session workspace is the most important product concept.

It is not a general messenger.

Users should not be able to randomly message anyone on the platform.

Communication exists only inside a specific session.

Each session workspace is connected to:
- one specialist;
- one client;
- one service;
- one booking;
- one date/time;
- one session state.

Possible session states:
- pending;
- confirmed;
- paid;
- active;
- completed;
- archived;
- cancelled.

When a session is archived:
- chat should become read-only;
- files and materials remain visible;
- the history stays available;
- no new communication should happen inside that session unless the session is reopened by future logic.

---

## Materials system

Materials are structured content blocks shared by the specialist with the client.

They are not just random files in chat.

Materials may be used differently depending on profession.

Examples:

For tutors:
- homework;
- recommended reading;
- lesson summary;
- useful links;
- exercises.

For psychologists:
- exercises;
- reflection prompts;
- session summary;
- recommended practices;
- reading materials.

For dietitians:
- meal plan;
- shopping list;
- recipes;
- calorie targets;
- product recommendations.

For lawyers:
- required documents;
- legal checklist;
- next steps;
- templates.

For consultants:
- action plan;
- strategy notes;
- roadmap;
- recommendations.

Materials should be separate from chat because important information should not be lost in message history.

---

## Booking system

The booking system should allow clients to choose only available slots.

Basic booking flow:
1. Select service.
2. Select date.
3. Select time.
4. Enter client details.
5. Add comment.
6. Confirm booking.
7. Create session workspace.

For MVP, booking can initially use mock data.

Later, it should support:
- working hours;
- service duration;
- unavailable days;
- breaks between sessions;
- double-booking prevention;
- manual confirmation by specialist;
- optional online payment.

---

## Video calls

The platform should not build its own video-calling system in the MVP.

Reason:
Google Meet, Zoom, and similar tools are already good enough.

The platform should allow the specialist to add an external meeting link.

In the session workspace, the client should see a clear button:

Join meeting

This should open the external link.

---

## Payments

Payments are not required for the UI-only stage.

Possible future models:
- payment outside the platform;
- payment through platform;
- commission on payments;
- paid subscription;
- free plan with higher commission;
- pro plan with lower or zero commission.

Payment provider is not decided yet.

Possible options:
- Stripe;
- WayForPay;
- LiqPay;
- Fondy;
- manual payment methods;
- bank transfer;
- other regional providers.

No final payment architecture should be implemented without discussion.

---

## Business model

Possible monetization models:

### Commission model

The platform takes a small percentage from payments processed through the platform.

Example:
- Free plan: 3% commission.
- Paid plan: lower or zero commission.

### Subscription model

Specialists pay monthly.

Possible tiers:
- Free;
- Basic;
- Pro;
- Business.

### Hybrid model

Free plan includes commission.  
Paid plan reduces commission and unlocks advanced features.

This is likely the best direction, but not final.

---

## MVP strategy

The MVP should be developed in stages.

### Stage 1: UI-only clickable prototype

Goal:
Create the full user experience with mock data only.

No backend.
No auth.
No database.
No real payments.
No real file uploads.

Required screens:
- landing page;
- login;
- register;
- specialist dashboard;
- calendar;
- services;
- public profile;
- booking;
- session workspace;
- materials;
- settings;
- archive.

### Stage 2: Authentication and database foundation

Add:
- Supabase;
- auth;
- roles;
- protected routes;
- basic database schema.

### Stage 3: Specialist vertical slice

Add:
- create profile;
- create service;
- configure availability;
- publish profile.

### Stage 4: Booking vertical slice

Add:
- real public profile;
- booking creation;
- booking persistence;
- session workspace creation.

### Stage 5: Session workspace

Add:
- persistent messages;
- materials;
- files;
- meeting link;
- archive state.

---

## Current tech stack

Current stack:
- Next.js;
- React;
- TypeScript;
- Tailwind CSS;
- shadcn/ui;
- pnpm;
- GitHub;
- Vercel.

Planned:
- Supabase for database, auth, storage, and realtime;
- possibly Stripe or regional payment provider later;
- possibly Resend or another email provider later.

Do not introduce major new technologies without discussion.

Avoid:
- microservices;
- Kubernetes;
- custom video calls;
- custom authentication from scratch;
- overcomplicated backend architecture;
- unnecessary state-management libraries;
- premature AI features.

---

## Architecture principles

The project should remain a simple monolithic Next.js application during MVP.

Do not use microservices.

Preferred structure:
- app routes in `src/app`;
- reusable UI components in `src/components/ui`;
- product-specific components grouped by domain;
- mock data in `src/data`;
- shared helpers in `src/lib`;
- documentation in `docs`.

Future backend should be added carefully after UI flows are stable.

---

## Design principles

The design should feel:
- modern;
- clean;
- premium;
- calm;
- professional;
- trustworthy;
- simple.

Visual references:
- Linear;
- Notion;
- Stripe;
- modern SaaS dashboards.

Avoid:
- cheap startup templates;
- cluttered UI;
- too many colors;
- playful social-network style;
- marketplace-style design;
- overly medical design;
- overly corporate enterprise design.

The platform should work for many types of professionals, not only psychologists or tutors.

---

## Development rules

Rules for all developers and AI assistants:

1. Do not implement backend during UI-only stage.
2. Do not invent product decisions.
3. Do not rename the product unless explicitly requested.
4. Do not add marketplace functionality unless explicitly requested.
5. Do not add built-in video calls.
6. Do not add AI features without a clear use case.
7. Keep components clean and reusable.
8. Use TypeScript.
9. Use shadcn/ui where appropriate.
10. Run lint and build after meaningful changes.
11. Commit each completed task separately.
12. Update documentation when product decisions change.

---

## Git workflow

Recommended workflow:

1. Pull latest changes.
2. Pick one small task.
3. Implement only that task.
4. Run:
   - pnpm lint
   - pnpm build
5. Commit with clear message.
6. Push to GitHub.
7. Let Vercel deploy automatically.

One task = one commit.

Avoid huge commits that mix unrelated changes.

---

## Collaboration model

This project is developed by a small team.

The repository should be the source of truth.

Important context must live in:
- docs;
- issues;
- roadmap;
- decisions log;
- commit history.

Do not rely only on ChatGPT memory or Codex memory.

Any teammate should be able to understand the project by reading:
1. MASTER_CONTEXT.md
2. PRODUCT.md
3. ROADMAP.md
4. STAGE_1.md
5. ARCHITECTURE.md
6. CONTRIBUTING.md

---

## What must not be changed without discussion

Do not change these decisions without explicit discussion:

1. The product is not a marketplace.
2. The product is not a messenger.
3. The product is not a video-call platform.
4. The product is centered around session workspaces.
5. Materials should be structured separately from chat.
6. MVP should start as UI-only.
7. Backend should be added after UI flows are stable.
8. The project should remain a simple monolith for MVP.
9. The product name is not final and should not be hardcoded in documentation as a strategic brand decision.
10. External meeting links are preferred over built-in video calls.

---

## Current project status

Current status:
- Next.js project exists.
- shadcn/ui is configured.
- Mock landing page exists.
- Mock dashboard exists.
- Mock public profile exists.
- Mock booking preview exists.
- Mock session workspace exists.
- Mock data is centralized.
- GitHub repository is connected.
- Vercel deployment is connected.

Still missing:
- full route structure;
- login/register pages;
- dashboard routes;
- public profile route;
- booking route;
- real calendar UI;
- settings page;
- archive page;
- backend;
- auth;
- database;
- payments;
- file storage;
- real chat;
- real materials system.

---

## Next priorities

Immediate next priorities:

1. Complete Stage 1 UI-only prototype.
2. Create all required routes.
3. Add realistic mock data.
4. Make navigation clickable.
5. Improve responsive design.
6. Add empty/loading/error states where useful.
7. Only after that, plan Supabase integration.

---

## For AI assistants

Before writing code:
1. Read this file.
2. Check related docs.
3. Understand current stage.
4. Do not skip stages.
5. Do not implement backend unless the task explicitly says so.
6. Keep product decisions consistent with this document.

If there is uncertainty, ask for clarification instead of inventing functionality.
