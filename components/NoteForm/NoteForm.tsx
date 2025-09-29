'use client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Note, NoteTag } from '@/types/note'
import { createNote } from '@/lib/api'
import css from './NoteForm.module.css'

interface NoteFormProps {
  onCancel: () => void
}

type FormValues = {
  title: string
  content?: string
  tag: NoteTag
}

const Schema = Yup.object({
  title: Yup.string().min(3).max(50).required(),
  content: Yup.string().max(500).optional(),
  tag: Yup.mixed<NoteTag>()
    .oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'])
    .required(),
})

export default function NoteForm({ onCancel }: NoteFormProps) {
  const qc = useQueryClient()

  const createMut = useMutation({
    mutationFn: (values: FormValues) => createNote(values),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['notes'] })
      onCancel()
    },
  })

  return (
    <Formik<FormValues>
      initialValues={{
        title: '',
        content: '',
        tag: 'Todo',
      }}
      validationSchema={Schema}
      onSubmit={async (
        values,
        { setSubmitting }: FormikHelpers<FormValues>,
      ) => {
        try {
          await createMut.mutateAsync(values)
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
              Create
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
