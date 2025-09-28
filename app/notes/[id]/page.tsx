import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'

type Props = {
  params: Promise<{ id: string }>
}

export default async function NoteDetailsPage({ params }: Props) {
  const { id } = await params
  const noteId = Number(id)

  const qc = new QueryClient()
  await qc.prefetchQuery({
    queryKey: ['note', noteId],
    queryFn: () => fetchNoteById(noteId),
  })
  const state = dehydrate(qc)

  return (
    <HydrationBoundary state={state}>
      <NoteDetailsClient />
    </HydrationBoundary>
  )
}
