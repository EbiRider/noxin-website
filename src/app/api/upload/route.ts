import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const uploadsDir = path.join(process.cwd(), 'data', 'uploads')
const metaFile = path.join(process.cwd(), 'data', 'files.json')

function readMeta() {
  if (!fs.existsSync(metaFile)) return []
  try { return JSON.parse(fs.readFileSync(metaFile, 'utf8')) } catch { return [] }
}

function writeMeta(records: unknown[]) {
  fs.mkdirSync(path.dirname(metaFile), { recursive: true })
  fs.writeFileSync(metaFile, JSON.stringify(records, null, 2))
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })
  }

  const file = formData.get('file') as File | null
  if (!file || file.size === 0) return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  if (file.size > 50 * 1024 * 1024) return NextResponse.json({ error: 'حداکثر سایز فایل ۵۰ مگابایت است' }, { status: 413 })

  fs.mkdirSync(uploadsDir, { recursive: true })

  const ext = path.extname(file.name)
  const id = randomUUID()
  const storedName = `${id}${ext}`
  const filePath = path.join(uploadsDir, storedName)

  const buffer = Buffer.from(await file.arrayBuffer())
  fs.writeFileSync(filePath, buffer)

  const record = {
    id,
    name: storedName,
    originalName: file.name,
    size: file.size,
    uploader: session.user.username ?? session.user.name ?? 'unknown',
    uploaderName: session.user.name ?? session.user.username ?? 'unknown',
    createdAt: new Date().toISOString(),
  }

  const records = readMeta()
  records.push(record)
  writeMeta(records)

  return NextResponse.json(record)
}
