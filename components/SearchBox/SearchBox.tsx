'use client'
import { ChangeEvent } from 'react'
import css from './SearchBox.module.css'

interface SearchBoxProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export default function SearchBox({
  value,
  onChange,
  placeholder,
}: SearchBoxProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)
  return (
    <input
      className={css.input}
      value={value}
      onChange={handle}
      placeholder={placeholder ?? 'Search...'}
    />
  )
}
