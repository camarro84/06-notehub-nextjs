'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Note, NoteTag } from '@/types/note'
import { createNote, updateNote } from '@/lib/api'
import css from './NoteForm.module.css'

interface NoteFormProps {
  initial?: Partial<Pick<Note, 'id' | 'title' | 'content' | 'tag'>>
  onCancel: () => void
  onSuccess?: (note: Note) => void
}

type FormValues = { title: string; content: string; tag: NoteTag }

const Schema = Yup.object({
  title: Yup.string().min(1).max(200).required(),
  content: Yup.string().min(1).required(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required(),
})

export default function NoteForm({
  initial,
  onCancel,
  onSuccess,
}: NoteFormProps) {
  const qc = useQueryClient()

  const createMut = useMutation({
    mutationFn: createNote,
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ['notes'] })
      onSuccess?.(note)
    },
  })

  const updateMut = useMutation({
    mutationFn: (payload: { id: string; data: Partial<FormValues> }) =>
      updateNote(payload.id, payload.data),
    onSuccess: (note) => {
      qc.invalidateQueries({ queryKey: ['notes'] })
      qc.invalidateQueries({ queryKey: ['note', note.id] })
      onSuccess?.(note)
    },
  })

  const isEdit = Boolean(initial?.id)

  return (
    <Formik<FormValues>
      initialValues={{
        title: initial?.title ?? '',
        content: initial?.content ?? '',
        tag: (initial?.tag ?? 'Todo') as NoteTag,
      }}
      validationSchema={Schema}
      onSubmit={async (
        values,
        { setSubmitting }: FormikHelpers<FormValues>,
      ) => {
        try {
          if (isEdit && initial?.id) {
            await updateMut.mutateAsync({ id: initial.id, data: values })
          } else {
            await createMut.mutateAsync(values)
          }
        } finally {
          setSubmitting(false)
        }
      }}
    >
      {({ isSubmitting }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label>Title</label>
            <Field name="title" className={css.input} />
            <ErrorMessage name="title" component="div" />
          </div>

          <div className={css.formGroup}>
            <label>Content</label>
            <Field
              as="textarea"
              name="content"
              rows={6}
              className={css.textarea}
            />
            <ErrorMessage name="content" component="div" />
          </div>

          <div className={css.formGroup}>
            <label>Tag</label>
            <Field as="select" name="tag" className={css.select}>
              <option value="Todo">Todo</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Meeting">Meeting</option>
              <option value="Shopping">Shopping</option>
            </Field>
            <ErrorMessage name="tag" component="div" />
          </div>

          <div className={css.actions}>
            <button type="submit" disabled={isSubmitting}>
              {isEdit ? 'Save' : 'Create'}
            </button>
            <button type="button" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
