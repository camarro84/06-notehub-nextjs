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
  notes: Note[]
  totalPages: number
}

interface ItemResponse {
  item: Note
}

type CreatePayload = {
  title: string
  content?: string
  tag: NoteTag
}

type UpdatePayload = Partial<CreatePayload>

export async function fetchNotes(
  params: FetchNotesParams = {},
): Promise<FetchNotesResponse> {
  const { page = 1, perPage = 12, search = '' } = params
  const res = await api.get<FetchNotesResponse>('/notes', {
    params: { page, perPage, search },
  })
  return res.data
}

export async function fetchNoteById(id: string): Promise<Note> {
  const res = await api.get<ItemResponse>(`/notes/${id}`)
  return res.data.item
}

export async function createNote(payload: CreatePayload): Promise<Note> {
  const res = await api.post<ItemResponse>('/notes', payload)
  return res.data.item
}

export async function updateNote(
  id: string,
  payload: UpdatePayload,
): Promise<Note> {
  const res = await api.patch<ItemResponse>(`/notes/${id}`, payload)
  return res.data.item
}

export async function deleteNote(id: string): Promise<Note> {
  const res = await api.delete<ItemResponse>(`/notes/${id}`)
  return res.data.item
}
