'use client';

import { useActionState, useEffect, useRef } from 'react';
import { createNote, type CreateNoteState } from '../notes-actions';

type Category = { id: number; name: string };

const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900';

export function NoteForm({ categories }: { categories: Category[] }) {
  const [state, action, pending] = useActionState<CreateNoteState, FormData>(
    createNote,
    {},
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={action}
      className="flex flex-col gap-3 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div>
        <input
          name="title"
          placeholder="Note title"
          aria-label="Note title"
          className={inputClass}
        />
        {state.errors?.title && (
          <p className="mt-1 text-xs text-red-600">{state.errors.title[0]}</p>
        )}
      </div>

      <textarea
        name="body"
        placeholder="Write your note…"
        aria-label="Note body"
        rows={3}
        className={`${inputClass} resize-y`}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <select name="categoryId" aria-label="Category" className={`${inputClass} sm:w-48`}>
          <option value="">No category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? 'Saving…' : 'Add note'}
        </button>
      </div>
    </form>
  );
}
