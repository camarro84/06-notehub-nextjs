'use client'

import axios from 'axios'
import { useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import css from './NoteDetails.module.css'

const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN ?? ''

async function fetchNoteLocal(id: number) {
  const res = await axios.get(
    `https://notehub-public.goit.study/api/notes/${id}`,
    {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    },
  )
  return res.data?.item ?? res.data
}

function formatISOLocal(dt: string) {
  const d = new Date(dt)
  return d.toISOString().replace('T', ' ').slice(0, 16)
}

export default function NoteDetailsClient() {
  const params = useParams()
  const id = Number(params.id as string)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteLocal(id),
  })

  if (isLoading) return <p>Loading, please wait...</p>
  if (isError || !data) return <p>Something went wrong.</p>

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{data.title}</h2>
        </div>
        <p className={css.content}>{data.content}</p>
        <p className={css.date}>
          <time suppressHydrationWarning dateTime={data.createdAt}>
            {formatISOLocal(data.createdAt)}
          </time>
        </p>
      </div>
    </div>
  )
}
