import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'

export const dynamic = 'force-dynamic'

type Params = { params: Promise<{ id: string }> }

export default async function NoteDetails({ params }: Params) {
  const { id } = await params
  const qc = new QueryClient()
  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })
  const state = dehydrate(qc)
  return (
    <HydrationBoundary state={state}>
      <NoteDetailsClient />
    </HydrationBoundary>
  )
}
