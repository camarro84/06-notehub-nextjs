'use client'

import { FormEvent } from 'react'
import css from './SearchBox.module.css'

export default function SearchBox({
  value,
  onChange,
  onSubmit,
}: {
  value: string
  onChange: (v: string) => void
  onSubmit: () => void
}) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    onSubmit()
  }

  return (
    <form className={css.form} onSubmit={handleSubmit} noValidate>
      <input
        id="search"
        name="search"
        className={css.input}
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete="off"
      />
      <button className={css.button} type="submit">
        Search
      </button>
    </form>
  )
}
