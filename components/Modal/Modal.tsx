'use client'

import { ReactNode } from 'react'
import css from './Modal.module.css'

export default function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className={css.backdrop} onClick={onClose}>
      <div className={css.content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
