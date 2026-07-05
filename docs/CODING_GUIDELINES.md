# Coding Guidelines

## Core Rules

- Use TypeScript.
- Keep the application as a monolithic Next.js App Router project during MVP.
- Use existing local shadcn/ui-style primitives before adding new UI dependencies.
- Keep reusable business logic in `src/lib`.
- Keep large route components thin when possible.
- Keep mock data in `src/data/mock.ts` and only for unfinished areas.
- Do not bypass Supabase RLS.
- Do not use a Supabase service-role key in application code.

## Components

- Prefer small domain components.
- Reuse existing layout components.
- Preserve current visual language unless the task asks for redesign.
- Mobile behavior must be considered for dashboard and public routes.

## Quality Checks

Run before commit:

```bash
pnpm lint
pnpm build
```

Testing is not configured yet. See [TECH_DEBT.md](./TECH_DEBT.md).
