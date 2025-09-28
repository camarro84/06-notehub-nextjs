'use client'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { fetchNoteById } from '@/lib/api'
import css from './NoteDetails.module.css'

export default function NoteDetailsClient() {
  const params = useParams()
  const id = String(params.id)

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  })

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error: {(error as Error).message}</div>
  if (!data) return null

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>
          <time suppressHydrationWarning dateTime={data.createdAt}>
            {data.createdAt}
          </time>
        </p>
      </div>
    </div>
  )
}
