'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from '@tanstack/react-query'
import {
  createNote,
  deleteNote,
  fetchNotes,
  type FetchNotesResult,
} from '@/lib/api'
import { useDebounce } from 'use-debounce'
import NoteForm from '@/components/NoteForm/NoteForm'
import NoteList from '@/components/NoteList/NoteList'
import SearchBox from '@/components/SearchBox/SearchBox'
import Pagination from '@/components/Pagination/Pagination'
import { Note, NoteTag } from '@/types/note'

export default function NotesClient() {
  const [page, setPage] = useState(1)
  const [perPage] = useState(12)
  const [term, setTerm] = useState('')
  const [deletingId, setDeletingId] = useState<number | undefined>(undefined)
  const [debounced] = useDebounce(term.trim(), 300)
  const qc = useQueryClient()

  useEffect(() => {
    setPage(1)
  }, [debounced])

  const queryKey = useMemo(
    () => ['notes', { page, perPage, search: debounced }],
    [page, perPage, debounced],
  )

  const { data, isLoading, isError, error } = useQuery<FetchNotesResult>({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage, search: debounced }),
    placeholderData: keepPreviousData,
  })

  const createMutation = useMutation({
    mutationFn: (payload: { title: string; content: string; tag: NoteTag }) =>
      createNote(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      setDeletingId(id)
      await deleteNote(id as any)
    },
    onSettled: () => {
      setDeletingId(undefined)
      qc.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const items: Note[] = data?.notes ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <>
      <SearchBox value={term} onChange={setTerm} onSubmit={() => setPage(1)} />
      <NoteForm
        onSubmit={(values) => createMutation.mutate(values)}
        isSubmitting={createMutation.isPending}
      />
      {isLoading && <p>Loading, please wait...</p>}
      {isError && (
        <p>Could not fetch the list of notes. {(error as Error).message}</p>
      )}
      {!isLoading && !isError && (
        <>
          <NoteList
            items={items}
            onDelete={(id) => deleteMutation.mutate(id)}
            deletingId={deletingId}
          />
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </>
  )
}
