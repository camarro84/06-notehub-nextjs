import {
  QueryClient,
  dehydrate,
  HydrationBoundary,
} from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import NotesClient from './Notes.client'

export const dynamic = 'force-dynamic'

export default async function NotesPage() {
  const qc = new QueryClient()
  const key = ['notes', { page: 1, perPage: 12, search: '' }]

  await qc.prefetchQuery({
    queryKey: key,
    queryFn: () => fetchNotes({ page: 1, perPage: 12, search: '' }),
  })

  return (
    <HydrationBoundary state={dehydrate(qc)}>
      <NotesClient />
    </HydrationBoundary>
  )
}
