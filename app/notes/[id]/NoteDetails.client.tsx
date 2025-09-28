'use client'

import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import css from './NoteDetails.module.css'

function formatISOLocal(dt: string) {
  const d = new Date(dt)
  return d.toISOString().replace('T', ' ').slice(0, 16)
}

export default function NoteDetailsClient() {
  const params = useParams()
  const id = Number(params.id as string)

  const { data: note, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  })

  if (isLoading) return <p>Loading, please wait...</p>
  if (isError || !note) return <p>Something went wrong.</p>

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>
          <time suppressHydrationWarning dateTime={note.createdAt}>
            {formatISOLocal(note.createdAt)}
          </time>
        </p>
      </div>
    </div>
  )
}
