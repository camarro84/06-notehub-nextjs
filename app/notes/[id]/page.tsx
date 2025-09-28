import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import NoteDetailsClient from './NoteDetails.client'

type NoteDetailsPageProps = {
  params: { id: string }
  searchParams?: Record<string, string | string[] | undefined>
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const id = Number(params.id)
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
