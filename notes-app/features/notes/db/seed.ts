import 'dotenv/config';
import { db } from './index';
import { notes, categories } from './schema';

async function seed() {
  const existing = await db.select().from(notes).limit(1);
  if (existing.length) {
    console.log('Already seeded — skipping.');
    return;
  }

  const [category] = await db
    .insert(categories)
    .values({ name: 'Personal' })
    .returning();

  const [note] = await db
    .insert(notes)
    .values({
      title: 'Welcome to your notes',
      body: 'This is your first note. Edit it, delete it, or create a new one.',
      categoryId: category.id,
    })
    .returning();

  console.log(`Seeded category "${category.name}" and note #${note.id}.`);
}

seed();
