'use client'

import { useState } from 'react'
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
  const [local, setLocal] = useState(value)
  return (
    <div className={css.row}>
      <input
        placeholder="Search..."
        value={local}
        onChange={(e) => setLocal(e.target.value)}
      />
      <button
        onClick={() => {
          onChange(local)
          onSubmit()
        }}
      >
        Search
      </button>
    </div>
  )
}
