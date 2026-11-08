'use server'

import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'
import { revalidatePath } from 'next/cache'
import { auth } from '@/auth'

const uploadsDir = path.join(process.cwd(), 'data', 'uploads')
const metaFile = path.join(process.cwd(), 'data', 'files.json')

export type FileRecord = {
  id: string
  name: string
  originalName: string
  size: number
  uploader: string
  uploaderName: string
  createdAt: string
}

function readMeta(): FileRecord[] {
  if (!fs.existsSync(metaFile)) return []
  try { return JSON.parse(fs.readFileSync(metaFile, 'utf8')) } catch { return [] }
}

function writeMeta(records: FileRecord[]) {
  fs.mkdirSync(path.dirname(metaFile), { recursive: true })
  fs.writeFileSync(metaFile, JSON.stringify(records, null, 2))
}

export async function getFiles(): Promise<FileRecord[]> {
  return readMeta().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function uploadFile(formData: FormData): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user) return { error: 'Unauthorized' }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return { error: 'No file provided' }
  if (file.size > 50 * 1024 * 1024) return { error: 'File too large (max 50MB)' }

  fs.mkdirSync(uploadsDir, { recursive: true })

  const ext = path.extname(file.name)
  const id = randomUUID()
  const storedName = `${id}${ext}`
  const filePath = path.join(uploadsDir, storedName)

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(filePath, buffer)

  const records = readMeta()
  records.push({
    id,
    name: storedName,
    originalName: file.name,
    size: file.size,
    uploader: session.user.username ?? session.user.name ?? 'unknown',
    uploaderName: session.user.name ?? session.user.username ?? 'unknown',
    createdAt: new Date().toISOString(),
  })
  writeMeta(records)
  revalidatePath('/files')
  return {}
}

export async function deleteFile(id: string): Promise<void> {
  const session = await auth()
  if (!session?.user) return

  const records = readMeta()
  const file = records.find(f => f.id === id)
  if (!file) return

  const filePath = path.join(uploadsDir, file.name)
  if (fs.existsSync(filePath)) fs.unlinkSync(filePath)

  writeMeta(records.filter(f => f.id !== id))
  revalidatePath('/files')
}
