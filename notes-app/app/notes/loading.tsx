import { NoteListSkeleton } from '@/features/notes/components/note-list';

// Route-level fallback shown while the page's server work resolves.
// Mirrors the /notes layout (form + toolbar + list) so there's no shift.
export default function NotesLoading() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6" aria-hidden>
      <div className="h-8 w-24 rounded bg-zinc-200 dark:bg-zinc-800" />

      {/* create form: title input, textarea, submit button */}
      <div className="flex animate-pulse flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-9 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-20 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        <div className="flex justify-end">
          <div className="h-9 w-24 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        </div>
      </div>

      {/* toolbar: search + category */}
      <div className="flex animate-pulse flex-col gap-2 sm:flex-row">
        <div className="h-9 flex-1 rounded-md bg-zinc-100 dark:bg-zinc-800" />
        <div className="h-9 flex-1 rounded-md bg-zinc-100 dark:bg-zinc-800" />
      </div>

      <NoteListSkeleton />
    </main>
  );
}
