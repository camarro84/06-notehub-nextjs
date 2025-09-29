'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchNotes } from '@/lib/api'
import SearchBox from '@/components/SearchBox/SearchBox'
import NoteList from '@/components/NoteList/NoteList'
import Pagination from '@/components/Pagination/Pagination'
import Modal from '@/components/Modal/Modal'
import NoteForm from '@/components/NoteForm/NoteForm'
import { useDebounce } from 'use-debounce'
import css from './NotesPage.module.css'

export default function NotesClient() {
  const [page, setPage] = useState(0)
  const [term, setTerm] = useState('')
  const [open, setOpen] = useState(false)
  const [debounced] = useDebounce(term.trim(), 300)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['notes', { page: page + 1, perPage: 12, search: debounced }],
    queryFn: () =>
      fetchNotes({ page: page + 1, perPage: 12, search: debounced }),
    placeholderData: (prev) => prev,
  })

  const notes = data?.notes ?? []
  const totalPages = data?.totalPages ?? 1

  return (
    <div className={css.app}>
      <div className={css.toolbar}>
        <SearchBox
          value={term}
          onChange={(v) => {
            setTerm(v)
            setPage(0)
          }}
          placeholder="Search notes..."
        />
        <button className={css.button} onClick={() => setOpen(true)}>
          New note
        </button>
      </div>

      {isLoading && <p>Loading...</p>}
      {isError && <p>Error: {(error as Error).message}</p>}

      {!isLoading && !isError && (
        <>
          {notes.length > 0 ? (
            <NoteList items={notes} />
          ) : (
            <p>No notes found</p>
          )}
          {totalPages > 1 && (
            <Pagination
              pageCount={totalPages}
              currentPage={page}
              onPageChange={setPage}
            />
          )}
        </>
      )}

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3>Create note</h3>
        <NoteForm onCancel={() => setOpen(false)} />
      </Modal>
    </div>
  )
}
