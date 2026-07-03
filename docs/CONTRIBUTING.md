# Contributing Guide

## Purpose

This document explains how developers and AI assistants should work on the project.

The goal is to keep the project clean, consistent, and easy to maintain.

---

## Workflow

1. Pull latest changes from GitHub.
2. Pick ONE task.
3. Complete only that task.
4. Run:
   - pnpm lint
   - pnpm build
5. Commit.
6. Push.
7. Create next task.

Never work on multiple unrelated tasks in one commit.

---

## Before writing code

Always read:

MASTER_CONTEXT.md

PRODUCT.md

ROADMAP.md

Then understand the task.

---

## Branches

For now use:

main

Later:

feature/*
fix/*
docs/*

---

## Commit Style

Examples:

feat: add booking page

feat: implement profile form

fix: mobile navigation

docs: update roadmap

refactor: split landing components

style: improve spacing

---

## Rules

Keep components small.

Reuse components whenever possible.

Prefer composition over duplication.

Avoid premature optimization.

Avoid overengineering.

---

## UI

Use:

Next.js

TypeScript

Tailwind

shadcn/ui

Don't introduce another UI library.

---

## Architecture

Keep the project as a monolith during MVP.

Do not introduce:

Microservices

Redux

Complex state managers

Custom backend

Custom auth

---

## AI Rules

Before implementing a feature:

Understand existing components.

Reuse code.

Do not rewrite working components.

Do not rename files without reason.

Do not create duplicate components.

---

## Pull Requests

One feature = one commit.

One commit = one logical change.

---

## Goal

The repository should stay understandable even after hundreds of commits.
