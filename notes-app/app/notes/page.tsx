import { Notes } from '@/features/notes/components/notes';

export default function NotesPage({ searchParams }: PageProps<'/notes'>) {
  return <Notes searchParams={searchParams} />;
}
