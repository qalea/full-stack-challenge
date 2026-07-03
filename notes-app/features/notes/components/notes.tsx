import { Suspense } from 'react';
import { getCategories } from '../notes-queries';
import { notesFilterSchema } from '../notes-schemas';
import { NoteForm } from './note-form';
import { NoteList, NoteListSkeleton } from './note-list';
import { NotesToolbar } from './notes-toolbar';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export async function Notes({ searchParams }: { searchParams: SearchParams }) {
  const [categories, raw] = await Promise.all([getCategories(), searchParams]);
  const filter = notesFilterSchema.parse(raw);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
      <NoteForm categories={categories} />
      <NotesToolbar categories={categories} />
      <Suspense
        key={`${filter.q ?? ''}|${filter.categoryId ?? ''}`}
        fallback={<NoteListSkeleton />}
      >
        <NoteList categories={categories} filter={filter} />
      </Suspense>
    </main>
  );
}
