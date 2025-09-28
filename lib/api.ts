import axios, { AxiosInstance } from 'axios'
import { Note, NoteTag } from '@/types/note'

const api: AxiosInstance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
})

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN
  if (token) {
    config.headers = config.headers ?? {}
    ;(config.headers as Record<string, string>).Authorization =
      `Bearer ${token}`
  }
  return config
})

export interface FetchNotesParams {
  page?: number
  perPage?: number
  search?: string
}

export interface FetchNotesResponse {
  items: Note[]
  totalPages: number
}

interface ItemEnvelope {
  item: Note
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function isNote(v: unknown): v is Note {
  return (
    isRecord(v) &&
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    typeof v.content === 'string' &&
    typeof v.tag === 'string' &&
    typeof v.createdAt === 'string' &&
    typeof v.updatedAt === 'string'
  )
}

function isNoteArray(v: unknown): v is Note[] {
  return Array.isArray(v) && v.every((x) => isNote(x))
}

function extractItems(payload: unknown): Note[] {
  const d = payload
  if (isRecord(d) && isNoteArray(d.items)) return d.items
  if (isRecord(d) && isNoteArray(d.data)) return d.data
  if (
    isRecord(d) &&
    isRecord(d.items) &&
    isNoteArray((d.items as Record<string, unknown>).docs)
  ) {
    return (d.items as { docs: Note[] }).docs
  }
  if (
    isRecord(d) &&
    isRecord(d.items) &&
    isNoteArray((d.items as Record<string, unknown>).data)
  ) {
    return (d.items as { data: Note[] }).data
  }
  if (isRecord(d) && isNoteArray(d.notes)) return d.notes
  if (isRecord(d) && isNoteArray(d.results)) return d.results
  return []
}

function extractTotalPages(payload: unknown): number {
  const d = payload
  if (isRecord(d) && typeof d.totalPages === 'number') return d.totalPages
  if (
    isRecord(d) &&
    isRecord(d.items) &&
    typeof (d.items as Record<string, unknown>).totalPages === 'number'
  ) {
    return (d.items as { totalPages: number }).totalPages
  }
  if (
    isRecord(d) &&
    isRecord(d.meta) &&
    typeof (d.meta as Record<string, unknown>).totalPages === 'number'
  ) {
    return (d.meta as { totalPages: number }).totalPages
  }
  if (
    isRecord(d) &&
    isRecord(d.pagination) &&
    typeof (d.pagination as Record<string, unknown>).totalPages === 'number'
  ) {
    return (d.pagination as { totalPages: number }).totalPages
  }
  return 1
}

function extractItem(payload: unknown): Note {
  if (isRecord(payload) && isRecord(payload.item) && isNote(payload.item)) {
    return payload.item
  }
  if (isNote(payload)) {
    return payload
  }
  throw new Error('Invalid note response shape')
}

type CreatePayload = { title: string; content: string; tag: NoteTag }
type UpdatePayload = Partial<CreatePayload>

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = '' } = params
  const res = await api.get<unknown>('/notes', {
    params: { page, perPage, search },
  })
  const items = extractItems(res.data)
  const totalPages = extractTotalPages(res.data)
  return { items, totalPages }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<unknown>(`/notes/${id}`)
  return extractItem(res.data)
}

export async function createNote(payload: CreatePayload): Promise<Note> {
  const res = await api.post<unknown>('/notes', payload)
  return extractItem(res.data)
}

export async function updateNote(
  id: string,
  payload: UpdatePayload,
): Promise<Note> {
  const res = await api.put<unknown>(`/notes/${id}`, payload)
  return extractItem(res.data)
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete<void>(`/notes/${id}`)
}
