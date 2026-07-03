'use client';

import { useActionState, useState, useTransition } from 'react';
import type { Category } from '../db/schema';
import type { NoteWithCategory } from '../notes-queries';
import { deleteNote, updateNote, type NoteFormState } from '../notes-actions';
import { NoteFields } from './note-fields';

const btn =
  'rounded-md px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50';

export function NoteCard({
  note,
  categories,
}: {
  note: NoteWithCategory;
  categories: Category[];
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <EditCard
        note={note}
        categories={categories}
        onClose={() => setEditing(false)}
      />
    );
  }

  return <ViewCard note={note} onEdit={() => setEditing(true)} />;
}

function ViewCard({
  note,
  onEdit,
}: {
  note: NoteWithCategory;
  onEdit: () => void;
}) {
  const [deletePending, startDelete] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${note.title}"?`)) return;
    startDelete(() => deleteNote(note.id));
  }

  return (
    <li className="flex flex-col gap-2 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-tight">{note.title}</h3>
        {note.category && (
          <span className="shrink-0 rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {note.category.name}
          </span>
        )}
      </div>

      {note.body && (
        <p className="whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-400">
          {note.body}
        </p>
      )}

      <div className="mt-1 flex gap-2">
        <button
          onClick={onEdit}
          className={`${btn} bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={deletePending}
          className={`${btn} bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400`}
        >
          {deletePending ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </li>
  );
}

function EditCard({
  note,
  categories,
  onClose,
}: {
  note: NoteWithCategory;
  categories: Category[];
  onClose: () => void;
}) {
  // Wrap the action so a successful save closes the editor — no useEffect needed.
  const [state, action, pending] = useActionState<NoteFormState, FormData>(
    async (prev, formData) => {
      const result = await updateNote(prev, formData);
      if (result.ok) onClose();
      return result;
    },
    {},
  );

  return (
    <li className="rounded-lg border border-zinc-300 bg-white p-4 dark:border-zinc-700 dark:bg-zinc-900">
      <form action={action} className="flex flex-col gap-3">
        <input type="hidden" name="id" value={note.id} />
        <NoteFields
          categories={categories}
          errors={state.errors}
          defaultValues={state.values ?? note}
        />
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className={`${btn} bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700`}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={pending}
            className={`${btn} bg-zinc-900 text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300`}
          >
            {pending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </li>
  );
}
