# Documentation

## Project Purpose

The repository contains a frontend-first MVP for a SaaS workspace for independent professionals who work with clients by appointment.

The product is centered on helping a specialist manage booking, client communication, materials, files, meeting links, and session history in one place.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- pnpm
- GitHub
- Vercel

## Local Setup

Install dependencies:

```bash
pnpm install
```

Run the development server:

```bash
pnpm dev
```

Run quality checks:

```bash
pnpm lint
pnpm build
```

## Folder Structure

```text
src/app                 App Router pages and layout
src/components/ui       Shared shadcn/ui components
src/components/landing  Landing page sections
src/components/dashboard Dashboard mock components
src/components/public-profile Public profile and booking preview
src/components/session Session workspace mock components
src/data                Mock data
src/lib                 Shared utilities
docs                    Short context docs for AI assistants and developers
```

## Documentation Overview

- [MASTER_CONTEXT.md](./MASTER_CONTEXT.md): first file to read for product context.
- [UI_PAGES.md](./UI_PAGES.md): current and planned MVP page intent.
- [DECISIONS.md](./DECISIONS.md): short list of project decisions.
- [AI_RULES.md](./AI_RULES.md): rules for AI assistants working in the repo.
