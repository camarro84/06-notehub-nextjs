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

type AnyJson = unknown

/** извлекаем массив заметок из разных возможных форматов ответа */
function extractItems(payload: AnyJson): Note[] {
  const tryArrays: any[] = []

  const pushIfArray = (v: any) => {
    if (Array.isArray(v)) tryArrays.push(v)
  }

  const d: any = payload as any

  pushIfArray(d?.items)
  pushIfArray(d?.data)
  pushIfArray(d?.notes)
  pushIfArray(d?.results)
  pushIfArray(d?.list)
  pushIfArray(d?.rows)

  pushIfArray(d?.items?.docs)
  pushIfArray(d?.items?.data)
  pushIfArray(d?.items?.rows)

  pushIfArray(d?.data?.items)
  pushIfArray(d?.data?.docs)
  pushIfArray(d?.data?.list)
  pushIfArray(d?.data?.rows)

  pushIfArray(d?.payload?.items)
  pushIfArray(d?.payload?.data)
  pushIfArray(d?.payload?.docs)

  const pick = tryArrays.find(
    (arr) =>
      Array.isArray(arr) &&
      arr.length >= 0 &&
      (arr.length === 0 ||
        (typeof arr[0] === 'object' &&
          arr[0] !== null &&
          ('title' in arr[0] || 'content' in arr[0] || 'tag' in arr[0]))),
  )

  return (pick ?? []) as Note[]
}

/** извлекаем totalPages из разных возможных мест */
function extractTotalPages(payload: AnyJson): number {
  const d: any = payload as any
  if (typeof d?.totalPages === 'number') return d.totalPages
  if (typeof d?.items?.totalPages === 'number') return d.items.totalPages
  if (typeof d?.meta?.totalPages === 'number') return d.meta.totalPages
  if (typeof d?.pagination?.totalPages === 'number')
    return d.pagination.totalPages
  return 1
}

function extractItem(payload: AnyJson): Note {
  const d: any = payload as any
  return (d?.item ?? d) as Note
}

type CreatePayload = { title: string; content: string; tag: NoteTag }
type UpdatePayload = Partial<CreatePayload>

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = '' } = params
  const res = await api.get<AnyJson>('/notes', {
    params: { page, perPage, search },
  })
  const items = extractItems(res.data)
  const totalPages = extractTotalPages(res.data)
  return { items, totalPages }
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<AnyJson>(`/notes/${id}`)
  return extractItem(res.data)
}

export async function createNote(payload: CreatePayload): Promise<Note> {
  const res = await api.post<AnyJson>('/notes', payload)
  return extractItem(res.data)
}

export async function updateNote(
  id: string,
  payload: UpdatePayload,
): Promise<Note> {
  const res = await api.put<AnyJson>(`/notes/${id}`, payload)
  return extractItem(res.data)
}

export async function deleteNote(id: string): Promise<void> {
  await api.delete<void>(`/notes/${id}`)
}
