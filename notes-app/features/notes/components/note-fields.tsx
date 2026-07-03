import type { Category } from '../db/schema';

const inputClass =
  'w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900';

type Defaults = { title?: string; body?: string; categoryId?: number | null };

export function NoteFields({
  categories,
  errors,
  defaultValues,
}: {
  categories: Category[];
  errors?: Record<string, string[]>;
  defaultValues?: Defaults;
}) {
  return (
    <>
      <div>
        <input
          name="title"
          placeholder="Note title"
          aria-label="Note title"
          defaultValue={defaultValues?.title ?? ''}
          className={inputClass}
        />
        {errors?.title && (
          <p className="mt-1 text-xs text-red-600">{errors.title[0]}</p>
        )}
      </div>

      <textarea
        name="body"
        placeholder="Write your note…"
        aria-label="Note body"
        rows={3}
        defaultValue={defaultValues?.body ?? ''}
        className={`${inputClass} resize-y`}
      />

      <select
        name="categoryId"
        aria-label="Category"
        defaultValue={defaultValues?.categoryId?.toString() ?? ''}
        className={`${inputClass} sm:w-48`}
      >
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    </>
  );
}
