import type { Category } from '../db/schema';
import { getNotes } from '../notes-queries';
import type { NotesFilter } from '../notes-schemas';
import { NoteCard } from './note-card';

export async function NoteList({
  categories,
  filter,
}: {
  categories: Category[];
  filter?: NotesFilter;
}) {
  const items = await getNotes(filter);

  if (!items.length) {
    const filtering = Boolean(filter?.q || filter?.categoryId);
    return (
      <p className="rounded-lg border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
        {filtering
          ? 'No notes match your search.'
          : 'No notes yet — create your first one above.'}
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((note) => (
        <NoteCard key={note.id} note={note} categories={categories} />
      ))}
    </ul>
  );
}

export function NoteListSkeleton() {
  return (
    <ul className="flex flex-col gap-3" aria-hidden>
      {Array.from({ length: 3 }).map((_, i) => (
        <li
          key={i}
          className="flex animate-pulse flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* mirrors NoteCard: title + chip, body lines, action buttons */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-2/5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-5 w-16 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
          <div className="h-4 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="mt-1 flex gap-2">
            <div className="h-7 w-14 rounded-md bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-7 w-16 rounded-md bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </li>
      ))}
    </ul>
  );
}
