# Product Requirements Document

Status: Draft  
Version: 0.2  
Owner: Product Team  
Product name: Not finalized  
Last updated: 2026-07-03  

---

# 1. Purpose of this document

This document defines the product direction, scope, user problems, target audience, value proposition, MVP boundaries, and long-term vision of the platform.

It should be used as the main product specification by:
- founders;
- developers;
- AI coding agents;
- designers;
- product managers;
- future contributors.

This document should be read together with:

- `MASTER_CONTEXT.md`
- `FEATURES.md`
- `USER_FLOW.md`
- `ROADMAP.md`
- `ARCHITECTURE.md`
- `DESIGN_SYSTEM.md`

The product name is not finalized. Until a final name is selected, all documentation should use neutral wording:

- the platform
- the application
- the product

Avoid hardcoding the temporary product name into strategic documentation.

---

# 2. Executive summary

The platform is a SaaS workspace for independent professionals who work with clients by appointment.

It is designed for specialists such as psychologists, tutors, consultants, lawyers, accountants, coaches, dietitians, therapists, trainers, and mentors.

The platform helps these professionals manage the full client workflow:

1. Create a professional profile.
2. Add services, prices, rules, and availability.
3. Share a public or private booking link.
4. Let clients choose an available time.
5. Create a dedicated session workspace after booking.
6. Use that workspace for communication, materials, files, meeting links, and notes.
7. Close and archive the session after completion.

The platform is not a marketplace. It does not focus on helping clients discover random specialists. Specialists usually already acquire clients through social media, personal brands, referrals, websites, communities, or direct communication.

The core value is workflow organization.

The key product idea is:

> Booking tools stop after the appointment is created.  
> This platform helps professionals manage everything that happens before, during, and after the session.

The most important product concept is the Session Workspace.

A Session Workspace is a structured space attached to one booked session. It is not a generic chat and not a social messenger. It exists only in the context of a specific professional-client interaction.

---

# 3. Vision

The long-term vision is to build the default workspace for independent professionals who sell their time and expertise.

The platform should become the place where a specialist manages:
- profile;
- booking;
- schedule;
- services;
- client communication;
- session materials;
- files;
- notes;
- payment status;
- meeting links;
- session archive.

The product should replace messy combinations of:
- Telegram chats;
- WhatsApp chats;
- Google Calendar;
- spreadsheets;
- manual notes;
- Google Drive folders;
- separate payment links;
- scattered reminders;
- random files sent in old messages.

The platform does not need to replace every tool completely. It should coordinate the workflow around client sessions.

For example, the platform should not build its own video calling system during MVP. Instead, it should allow the specialist to add an external Google Meet, Zoom, or similar link.

The vision is not to create a giant all-in-one enterprise CRM.

The vision is to create a simple, focused, modern workspace for solo professionals and small independent practices.

---

# 4. Mission

The mission is:

> Help independent professionals spend less time organizing their work and more time helping their clients.

The platform should reduce administrative friction:
- fewer back-and-forth messages;
- fewer lost files;
- fewer missed bookings;
- fewer forgotten details;
- fewer disconnected tools;
- less manual coordination.

The product succeeds when specialists feel that their work is more organized, professional, and easier to manage.

---

# 5. Product philosophy

## 5.1 Simplicity before completeness

The platform should not try to include every possible feature immediately.

A small set of well-designed workflows is more valuable than a large number of poorly connected features.

The MVP should focus on:
- profile;
- services;
- availability;
- booking;
- session workspace;
- chat;
- materials;
- archive.

Everything else should be added only when it clearly improves the main workflow.

## 5.2 Session-first thinking

The platform is built around sessions.

A session is more than a calendar event.

A session may include:
- preparation;
- client comment;
- meeting link;
- messages;
- materials;
- files;
- notes;
- payment status;
- completion status;
- archive.

Most product decisions should be evaluated by asking:

> Does this improve the session workflow?

If not, it should probably wait.

## 5.3 Not a marketplace

The platform should not be designed as a marketplace where clients browse and compare specialists.

This is an important strategic decision.

The specialist brings their own clients.  
The platform helps organize work with those clients.

Future discovery features may be considered later, but they are out of scope for MVP.

## 5.4 Not a messenger

The platform should not become a general-purpose messenger.

Communication should happen only inside a specific session workspace.

This keeps communication structured and prevents the product from becoming a noisy chat app.

## 5.5 Not a video platform

The platform should not build its own video calling system for MVP.

External meeting links are enough.

Specialists should be able to paste a Google Meet, Zoom, Teams, or other meeting link into the session workspace.

## 5.6 Structured information beats chat history

Important information should not be buried in chat.

Materials should be separate from messages.

Examples:
- homework;
- exercises;
- meal plans;
- legal checklists;
- recommended reading;
- session summaries;
- action plans.

This is one of the product’s strongest differentiators.

## 5.7 Professional but not corporate

The product should feel professional, trustworthy, and clean.

It should not feel like:
- a social network;
- a cheap startup template;
- an enterprise CRM;
- a medical-only system;
- a marketplace.

The visual direction should be modern SaaS, inspired by products like Linear, Notion, and Stripe.

---

# 6. Target audience

The target audience is independent professionals who work with clients by appointment.

The specific profession is less important than the workflow pattern.

The shared workflow is:

1. The professional offers time-based services.
2. Clients book or request time.
3. The professional prepares for the session.
4. The session happens online or offline.
5. The professional may share materials or follow-up information.
6. The history should remain organized.

## 6.1 Primary professional categories

### Psychologists and therapists

They may need:
- private booking;
- session notes;
- exercises;
- reflection prompts;
- meeting links;
- archived session history.

Important note:
The platform should not make medical claims or pretend to be a clinical health record system during MVP.

### Tutors

They may need:
- lesson booking;
- homework;
- recommended materials;
- repeated sessions;
- student progress history;
- file sharing.

### Consultants and coaches

They may need:
- session agendas;
- action plans;
- strategy notes;
- summaries;
- client communication;
- task-like follow-up materials.

### Lawyers

They may need:
- appointment booking;
- document collection;
- checklists;
- next steps;
- meeting links;
- archived conversation and files.

### Accountants

They may need:
- consultation booking;
- document requests;
- tax or reporting checklists;
- file exchange;
- status notes.

### Dietitians

They may need:
- consultations;
- meal plans;
- shopping lists;
- recipes;
- progress-related notes;
- client-specific materials.

### Trainers and instructors

They may need:
- training sessions;
- plans;
- instructions;
- follow-up materials;
- booking availability.

---

# 7. User personas

## 7.1 Solo psychologist

A psychologist gets most clients from Instagram and referrals.

Current workflow:
- clients message in Instagram or Telegram;
- scheduling happens manually;
- payment happens separately;
- Google Meet links are sent manually;
- exercises and notes are buried in chat.

Pain points:
- hard to track sessions;
- clients ask the same questions repeatedly;
- materials get lost in messages;
- booking takes unnecessary time.

What the platform should provide:
- simple profile link;
- available time slots;
- session-specific workspace;
- meeting link field;
- structured exercises/materials;
- archived history.

## 7.2 Private tutor

A tutor works with multiple students every week.

Current workflow:
- Google Calendar for schedule;
- Telegram for communication;
- homework sent as messages;
- files are hard to find later.

Pain points:
- homework gets lost;
- student history is messy;
- rescheduling is manual;
- no organized view of past sessions.

What the platform should provide:
- services with duration and price;
- booking or request flow;
- session workspace;
- homework/materials;
- archive per session.

## 7.3 Consultant or coach

A consultant sells strategy sessions.

Current workflow:
- clients book via messages;
- payment may be manual;
- session summary is sent separately;
- action items are not structured.

Pain points:
- no clean client workspace;
- scattered notes;
- hard to show professionalism;
- difficult to manage multiple clients.

What the platform should provide:
- professional public profile;
- booking flow;
- session agenda;
- action plan materials;
- file sharing;
- session archive.

## 7.4 Lawyer or accountant

A professional provides consultations and document-based services.

Current workflow:
- clients send files through email or messenger;
- meeting is scheduled manually;
- required documents are listed in messages;
- follow-up is fragmented.

Pain points:
- missing documents;
- hard to track what was requested;
- messy communication;
- files not connected to a specific consultation.

What the platform should provide:
- consultation booking;
- file/material blocks;
- document checklist;
- client comment before booking;
- session archive.

---

# 8. Problems to solve

## 8.1 Manual scheduling

Professionals often spend too much time agreeing on a time.

Typical conversation:
- “When are you free?”
- “Maybe Tuesday?”
- “What time?”
- “I can after 16:00.”
- “What about Thursday?”
- “Let me check.”

The platform should reduce this by showing available time slots.

## 8.2 Scattered communication

Messages are often spread across:
- Telegram;
- Instagram;
- WhatsApp;
- email;
- SMS.

The platform should not replace all communication immediately, but session-related communication should be structured in one place.

## 8.3 Lost materials

Important files and instructions get buried in chat.

The platform should separate materials from messages.

## 8.4 No session history

Professionals may not have a clear view of:
- what happened in the previous session;
- which files were shared;
- what the client asked before the session;
- which materials were sent after the session.

The platform should preserve a structured archive.

## 8.5 Unprofessional client experience

Many specialists rely only on direct messages.

A dedicated profile and session workspace can make the experience feel more professional.

## 8.6 Too many tools

The goal is not necessarily to replace every tool, but to reduce fragmentation by making the platform the central place for session-related work.

---

# 9. Value proposition

For specialists:

> Create one profile, share one link, manage every booking and session from one workspace.

For clients:

> Book a session, join the meeting, receive materials, and access history in one place.

For the product:

> More than booking. A structured workspace for the full client-session workflow.

---

# 10. Product scope

The product scope includes:

- public specialist profile;
- service listing;
- prices and durations;
- working hours and availability;
- booking or booking request;
- specialist dashboard;
- session workspace;
- chat inside session;
- materials inside session;
- files inside session;
- meeting link field;
- archive;
- settings;
- future payments;
- future notifications;
- future mobile app.

The MVP does not need all of these immediately as real backend functionality.

Stage 1 should make them visible and understandable through UI-only mock flows.

---

# 11. Out of scope for MVP

The following are out of scope for MVP:

- marketplace discovery;
- built-in video calls;
- complex AI assistant;
- full mobile app;
- enterprise admin panel;
- team management;
- complex analytics;
- automatic Google Calendar sync;
- automatic Google Meet creation;
- payment automation;
- invoicing;
- public reviews;
- ratings;
- SEO marketplace pages;
- complex notification system;
- full CRM.

Some of these may be added later, but they should not block the first MVP.

---

# 12. Core product modules

## 12.1 Public profile

The public profile is the specialist-facing landing page for clients.

It should include:
- photo or avatar;
- name;
- profession;
- short bio;
- services;
- prices;
- duration;
- rules;
- available times;
- booking CTA.

The profile can eventually support:
- public link;
- private access code;
- custom slug;
- hidden profile mode.

## 12.2 Services

A service defines what a client can book.

Service fields:
- title;
- description;
- duration;
- price;
- format;
- availability rules;
- active/inactive status.

Examples:
- 60-minute consultation;
- trial lesson;
- legal consultation;
- nutrition plan review;
- coaching session.

## 12.3 Availability

Availability controls when a client can book.

It should eventually support:
- working days;
- working hours;
- unavailable days;
- breaks;
- vacation mode;
- service-specific availability;
- buffer time between sessions.

For Stage 1, mock availability is enough.

## 12.4 Booking

Booking connects:
- client;
- specialist;
- service;
- date;
- time;
- comment;
- status.

Booking may be:
- instant;
- request-based;
- manually confirmed.

The exact default booking mode is not final.

## 12.5 Dashboard

The dashboard is the specialist’s main workspace.

It should show:
- today’s sessions;
- upcoming sessions;
- recent activity;
- quick actions;
- profile completeness;
- open slots;
- service overview.

## 12.6 Session Workspace

The Session Workspace is the core module.

It contains:
- session summary;
- status;
- client;
- service;
- time;
- payment status;
- meeting link;
- chat;
- materials;
- files;
- notes;
- archive controls.

## 12.7 Materials

Materials are structured content blocks.

They should support:
- title;
- body;
- files;
- links;
- categories;
- optional due date;
- status in future versions.

Materials must not be treated as random chat messages.

## 12.8 Files

Files may be attached to:
- session;
- material;
- message;
- client profile in future versions.

For MVP, file upload can be postponed.

## 12.9 Archive

Archive stores completed sessions.

Archived sessions should be mostly read-only.

The goal is to preserve history.

---

# 13. Related documents

- `MASTER_CONTEXT.md`
- `FEATURES.md`
- `USER_FLOW.md`
- `ROADMAP.md`
- `STAGE_1.md`
- `ARCHITECTURE.md`
- `DATABASE.md`
- `DESIGN_SYSTEM.md`

---

# 14. Functional Requirements

The following functional requirements describe what the platform must eventually support.

These are not implementation tasks.
They define product capabilities.

## FR-1 User Accounts

The platform shall allow specialists to create an account.

The platform shall allow clients to participate in bookings.

Client authentication model is still open for discussion.

---

## FR-2 Specialist Profile

The platform shall allow specialists to:

- upload avatar
- enter name
- profession
- biography
- languages
- contact links
- working rules
- timezone

Profile visibility:

- public
- private by invitation
- hidden

---

## FR-3 Services

The platform shall allow specialists to create multiple services.

Each service contains:

- title
- description
- duration
- price
- currency
- format (online/offline)
- active status

Future:

- service categories
- service tags

---

## FR-4 Availability

The platform shall support:

- working days
- working hours
- holidays
- unavailable dates
- vacation mode
- breaks
- booking buffers

---

## FR-5 Booking

Booking should include:

- selected service
- selected date
- selected time
- client information
- optional message
- booking status

Possible statuses:

- pending
- confirmed
- cancelled
- completed

---

## FR-6 Dashboard

Dashboard should display:

- today's sessions
- upcoming sessions
- recent bookings
- quick actions
- service overview
- profile completion
- notifications (future)

---

## FR-7 Session Workspace

Session Workspace shall support:

- session summary
- client information
- booking status
- payment status
- meeting link
- chat
- materials
- files
- archive

The Session Workspace is the heart of the application.

---

## FR-8 Chat

Chat belongs ONLY to a specific session.

No global messaging.

Messages may support:

- text
- attachments
- timestamps

Future:

- reactions
- editing
- message search

---

## FR-9 Materials

Materials are structured content.

Possible material types:

- text
- file
- checklist
- link
- homework
- exercise
- meal plan
- reading
- action plan

Future:

- templates
- reusable materials

---

## FR-10 Files

Files belong to:

- session
- material

Future:

- version history
- previews

---

## FR-11 Archive

Completed sessions move to archive.

Archive preserves:

- chat
- files
- materials
- meeting link
- notes
- timestamps

Archive is mostly read-only.

---

## FR-12 Notifications

Future notifications:

- booking created
- booking cancelled
- reminder
- material shared
- session starts soon

Notification channels:

- email
- push
- Telegram (future)

---

## FR-13 Payments

Payment system is intentionally postponed.

Architecture should allow future integration.

Possible providers:

- Stripe
- WayForPay
- LiqPay
- Fondy

Decision not finalized.

---

## FR-14 Analytics

Future dashboard metrics:

- sessions
- revenue
- completed bookings
- cancellations
- client count

---
