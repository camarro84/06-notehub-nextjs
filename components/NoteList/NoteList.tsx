'use client'
import Link from 'next/link'
import css from './NoteList.module.css'
import { Note } from '@/types/note'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteNote } from '@/lib/api'

interface NoteListProps {
  items: Note[]
}

export default function NoteList({ items }: NoteListProps) {
  const qc = useQueryClient()

  const delMut = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })

  if (!items.length) return null

  return (
    <ul className={css.list}>
      {items.map((n) => (
        <li key={n.id} className={css.listItem}>
          <div
            className={css.card}
            style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
          >
            <div className={css.header}>
              <h3 className={css.title}>{n.title}</h3>
              <span className={css.badge}>{n.tag}</span>
            </div>

            <p className={css.content}>{n.content}</p>

            <p className={css.meta}>
              <span style={{ fontWeight: 600 }}>
                <time suppressHydrationWarning>
                  {new Date(n.createdAt).toLocaleString()}
                </time>
              </span>
            </p>

            <div
              className={css.actions}
              style={{ marginTop: 'auto', display: 'flex', gap: 12 }}
            >
              <Link
                href={`/notes/${n.id}`}
                className={css.button}
                style={{ textDecoration: 'none' }}
              >
                View details
              </Link>
              <button
                type="button"
                className={css.button}
                onClick={() => delMut.mutate(n.id)}
                disabled={delMut.isPending}
              >
                Delete
              </button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
