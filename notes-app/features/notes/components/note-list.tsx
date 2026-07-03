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
    <ul className="grid gap-3 sm:grid-cols-2">
      {items.map((note) => (
        <NoteCard key={note.id} note={note} categories={categories} />
      ))}
    </ul>
  );
}

export function NoteListSkeleton() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2" aria-hidden>
      {Array.from({ length: 4 }).map((_, i) => (
        <li
          key={i}
          className="flex h-24 animate-pulse flex-col gap-2 rounded-lg border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900"
        >
          <div className="h-4 w-2/3 rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-full rounded bg-zinc-200 dark:bg-zinc-800" />
          <div className="h-3 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
        </li>
      ))}
    </ul>
  );
}
