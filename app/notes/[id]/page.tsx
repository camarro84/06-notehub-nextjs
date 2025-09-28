import axios from 'axios'
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query'
import NoteDetailsClient from './NoteDetails.client'

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? ''

async function ssrFetchNoteById(id: number) {
  const res = await axios.get(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  )
  return res.data?.item ?? res.data
}

interface Params {
  params: { id: string }
}

export default async function NoteDetails({ params }: Params) {
  const id = Number(params.id)
  const qc = new QueryClient()
  await qc.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => ssrFetchNoteById(id),
  })
  const state = dehydrate(qc)
  return (
    <HydrationBoundary state={state}>
      <NoteDetailsClient />
    </HydrationBoundary>
  )
}
