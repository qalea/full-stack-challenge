# Notes App

A note-taking app: create, edit, delete, categorize, and search notes. Built with
Next.js (App Router) and Server Actions, backed by Postgres via Drizzle ORM.

## Setup & Run

```bash
cd notes-app
pnpm install
cp .env.example .env      # then set DATABASE_URL (see note below)
pnpm db:migrate           # apply schema
pnpm db:seed              # one category + a welcome note
pnpm dev                  # http://localhost:3000  (/ redirects to /notes)
```

**`DATABASE_URL`** — a ready-to-use connection string was sent to the reviewer by email
(so no setup is needed). Otherwise, create a free Neon Postgres database at
https://neon.tech and paste its connection string.

Optional: `pnpm db:studio` opens Drizzle Studio to browse the tables.

## Stack

- **Next.js 16** — App Router, React Server Components, Server Actions
- **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling
- **Drizzle ORM** + **Postgres** (Neon HTTP driver)
- **Zod v4** for validation

## Architecture

Feature-sliced. Everything for the notes domain lives under `features/notes/`; the
route files in `app/` are thin shells that only render feature components.

```
app/
  page.tsx              redirects / → /notes
  notes/
    page.tsx            thin shell → <Notes />
    loading.tsx         route-level skeleton
    error.tsx           error boundary + retry
features/notes/
  db/
    schema.ts           tables + relations, exports $inferSelect types
    index.ts            Neon HTTP connection (no pool)
    seed.ts             idempotent seed
  notes-schemas.ts      Zod schemas — single source of validation (client + server)
  notes-queries.ts      server-only, cache()-wrapped reads (filter → SQL WHERE)
  notes-actions.ts      'use server' mutations (create / update / delete)
  components/
    notes.tsx           server: composes form + toolbar + <Suspense> list
    note-list.tsx       server: fetches + renders cards, + skeleton
    note-form.tsx       client: create form
    note-card.tsx       client: view / inline-edit / delete
    note-fields.tsx     shared inputs for create + edit
    notes-toolbar.tsx   client: URL-driven search + category filter
shared/hooks/
  use-debounce.ts       ref-based debounce (no useEffect)
```

**Data model** — `categories 1-N notes`: a note has zero or one category, a category
has many notes. Deleting a category sets its notes' `category_id` to null
(`ON DELETE SET NULL`).

**Data flow**
- **Reads**: server components call `cache()`-wrapped queries; `getNotes(filter)`
  builds a single SQL `WHERE` (`ILIKE` on title/body + exact category match).
- **Writes**: Server Actions validate with Zod → mutate → confirm the affected row
  via `.returning()` → `revalidatePath('/notes')` + `refresh()`.
- **Search/filter state lives in the URL** (`?q=&categoryId=`). The toolbar writes
  params (search debounced), and the list re-suspends on change via a `<Suspense key>`,
  so filters are shareable and bookmarkable with no client list state.

## Key decisions & tradeoffs

- **Category 1-N notes over M:N tags** — simpler to model and query for this scope.
  Straightforward to grow into a join table + multi-select tags later.
- **Drizzle + Neon HTTP driver** — typed queries from one schema; the HTTP driver is
  one round-trip per query with no connection pool to manage.
- **Server Actions + Zod, no REST layer** — one validation schema shared between
  client and server; mutations live with the feature and are re-validated server-side.
- **`revalidatePath` + `refresh` together** — invalidate the server cache *and* nudge
  the client router, so the list reflects mutations without a full reload.
- **Plain `<textarea>` for note body** — chosen for simplicity within the live/timebox
  context; a rich editor is intentionally deferred (see Possible improvements).
- **No component library (e.g. shadcn) / no `cn` helper** — a deliberate timebox call
  (~1h30 build window): focused on the MVP and core functionality over UI scaffolding.
  Plain Tailwind classes cover the current surface; a component lib is the natural next
  step if the UI grows.
- **No pagination** — full list newest-first + server-side `ILIKE` search fits the
  dataset. Add a trigram/full-text index + pagination only if the note count grows.

## Possible improvements

- **Richer note editor** — a Markdown editor or a WYSIWYG library (e.g. Tiptap) to make
  the note component more dynamic. The plain `<textarea>` was a deliberate simplicity
  choice for this context; storage stays plain text, so this is an editor-layer swap.
- **Tags (M:N)** — evolve categories into multi-tag support via a join table.
- **Pagination / full-text search** — add a trigram or `tsvector` index once the
  dataset grows.
- **A component library (shadcn)** for a more consistent, scalable UI.

**Deployment** — runs on Vercel as-is by setting `DATABASE_URL`; not deployed here.
