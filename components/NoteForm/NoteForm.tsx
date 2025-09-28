'use client'

import { useState } from 'react'
import { NoteTag } from '@/types/note'
import css from './NoteForm.module.css'

export default function NoteForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (v: { title: string; content: string; tag: NoteTag }) => void
  isSubmitting: boolean
}) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tag, setTag] = useState<NoteTag>('Todo')

  return (
    <form
      className={css.form}
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit({ title, content, tag })
        setTitle('')
        setContent('')
        setTag('Todo')
      }}
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <div className={css.row}>
        <select value={tag} onChange={(e) => setTag(e.target.value as NoteTag)}>
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        <div className={css.actions}>
          <button type="submit" disabled={isSubmitting}>
            Create
          </button>
        </div>
      </div>
    </form>
  )
}
