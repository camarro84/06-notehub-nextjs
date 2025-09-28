'use client'

import Link from 'next/link'
import css from './NoteList.module.css'
import { Note } from '@/types/note'

export default function NoteList({
  items,
  onDelete,
  deletingId,
}: {
  items: Note[]
  onDelete: (id: number) => void
  deletingId?: number
}) {
  return (
    <ul className={css.list}>
      {items.map((n) => (
        <li key={`${n.id}-${n.createdAt}`} className={css.listItem}>
          <h3 className={css.title}>{n.title}</h3>
          <p className={css.content}>{n.content}</p>
          <div className={css.footer}>
            <span className={css.tag}>{n.tag}</span>
            <div>
              <Link className={css.link} href={`/notes/${n.id}`}>
                View details
              </Link>
              <button
                type="button"
                className={css.button}
                onClick={() => onDelete(n.id)}
                disabled={deletingId === n.id}
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
