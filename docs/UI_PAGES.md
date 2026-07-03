# UI Pages Specification

Status: Draft
Version: 0.1

---

# Purpose

This document describes every page that exists in the MVP.

It explains:

- page purpose
- user
- components
- actions
- navigation
- future improvements

This document is the primary UI specification.

---

# Page List

MVP pages:

/

/login

/register

/dashboard

/dashboard/calendar

/dashboard/services

/dashboard/profile

/dashboard/sessions

/dashboard/settings

/profile/[slug]

/profile/[slug]/book

/session/[id]

/archive

---

# Landing Page (/)

Purpose:

Convert visitors into registered specialists.

Primary audience:

Professionals.

The landing page should answer:

- What is this?
- Who is it for?
- Why should I use it?
- How does it work?
- What makes it different?

Sections:

Hero

Features

How it works

Who it's for

Benefits

Testimonials (mock)

Pricing preview

FAQ

Footer

Hero CTA:

Create your workspace

Secondary CTA:

See demo

Navigation:

Login

Register

Features

Pricing

FAQ

---

# Login

Purpose:

Authenticate specialists.

Fields:

Email

Password

Remember me

Forgot password

Button:

Sign in

Links:

Register

Forgot password

Future:

Google

Apple

Microsoft

---

# Register

Purpose:

Create specialist account.

Fields:

Name

Email

Password

Confirm password

Agreement checkbox

Primary button:

Create account

---

# Dashboard

Purpose:

Main workspace.

Cards:

Today's sessions

Upcoming sessions

Recent bookings

Quick actions

Profile completion

Sidebar:

Dashboard

Calendar

Services

Profile

Sessions

Settings

---

# Calendar

Purpose:

Manage availability.

Contains:

Month view

Week view

Available slots

Blocked dates

Working hours

Future:

Drag and drop

Recurring schedule

Google Calendar sync

---

# Services

Purpose:

Manage services.

Each service card contains:

Title

Duration

Price

Status

Actions

Edit

Duplicate

Delete

Create Service button

---

# Public Profile

Purpose:

Client-facing page.

Contains:

Photo

Name

Profession

Bio

Services

Prices

Available times

Booking button

Rules

FAQ

Contact links

Future:

Reviews

Custom domain

Themes

---

# Booking Page

Purpose:

Client books a session.

Flow:

Select service

↓

Select date

↓

Select time

↓

Client details

↓

Comment

↓

Confirmation

Future:

Payment

Coupons

Reschedule

---

# Session Workspace

Purpose:

Main collaboration space.

Layout:

Session summary

Chat

Materials

Files

Meeting link

Status

Client information

Archive button

Tabs:

Overview

Chat

Materials

Files

Notes (future)

---

# Archive

Purpose:

Display completed sessions.

Filters:

Date

Client

Service

Status

Search

Cards:

Completed session

Archived materials

History

Future:

Export

Restore

Statistics

---

# Settings

Purpose:

Manage account.

Sections:

Profile

Password

Notifications

Availability

Billing (future)

Integrations (future)

Danger zone

---

# Navigation Principles

Users should never be more than three clicks away from:

Dashboard

Current session

Calendar

Services

Profile

---

# Mobile Principles

Sidebar becomes bottom navigation.

Cards stack vertically.

Tables become lists.

Buttons become full width.

---

# Empty States

Every page must have a designed empty state.

Examples:

No services yet

No sessions today

No archived sessions

No materials

No upcoming bookings

---

# Loading States

Every async page should have skeleton loading.

---

# Error States

Friendly messages.

Recovery actions.

Retry buttons.

---

# Future Pages

Analytics

Billing

Team

Notifications

Templates

Marketplace (optional, not decided)

Mobile app screens

---

# Related Documents

MASTER_CONTEXT.md

PRODUCT.md

FEATURES.md

USER_FLOWS.md

DESIGN_SYSTEM.md

ROADMAP.md
