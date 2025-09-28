import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import NotesClient from './Notes.client'
import css from './NotesPage.module.css'

export const dynamic = 'force-dynamic'

export default async function NotesPage() {
  const qc = new QueryClient()
  await qc.prefetchQuery({
    queryKey: ['notes', { page: 1, perPage: 12, search: '' }],
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '' }),
  })
  const state = dehydrate(qc)
  return (
    <main className={css.container}>
      <HydrationBoundary state={state}>
        <NotesClient />
      </HydrationBoundary>
    </main>
  )
}
