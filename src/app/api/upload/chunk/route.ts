import { auth } from '@/auth'
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { randomUUID } from 'crypto'

const uploadsDir  = path.join(process.cwd(), 'data', 'uploads')
const chunksDir   = path.join(process.cwd(), 'data', '.chunks')
const metaFile    = path.join(process.cwd(), 'data', 'files.json')

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
  try { formData = await req.formData() }
  catch { return NextResponse.json({ error: 'Invalid form data' }, { status: 400 }) }

  const uploadId   = formData.get('uploadId')   as string
  const chunkIndex = parseInt(formData.get('chunkIndex') as string)
  const totalChunks= parseInt(formData.get('totalChunks') as string)
  const filename   = formData.get('filename')   as string
  const fileSize   = parseInt(formData.get('fileSize') as string)
  const chunk      = formData.get('chunk')      as File | null

  if (!uploadId || isNaN(chunkIndex) || isNaN(totalChunks) || !filename || !chunk) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }
  if (fileSize > 50 * 1024 * 1024) {
    return NextResponse.json({ error: 'حداکثر سایز فایل ۵۰ مگابایت است' }, { status: 413 })
  }

  // Save this chunk
  const uploadTmpDir = path.join(chunksDir, uploadId)
  fs.mkdirSync(uploadTmpDir, { recursive: true })
  const chunkPath = path.join(uploadTmpDir, `${chunkIndex}`)
  fs.writeFileSync(chunkPath, Buffer.from(await chunk.arrayBuffer()))

  // Check how many chunks we have
  const received = fs.readdirSync(uploadTmpDir).length
  if (received < totalChunks) {
    return NextResponse.json({ done: false, received })
  }

  // All chunks received — assemble
  fs.mkdirSync(uploadsDir, { recursive: true })
  const ext        = path.extname(filename)
  const id         = randomUUID()
  const storedName = `${id}${ext}`
  const finalPath  = path.join(uploadsDir, storedName)
  const out        = fs.createWriteStream(finalPath)

  await new Promise<void>((resolve, reject) => {
    const writeNext = (i: number) => {
      if (i >= totalChunks) { out.end(); return }
      const data = fs.readFileSync(path.join(uploadTmpDir, `${i}`))
      out.write(data, () => writeNext(i + 1))
    }
    out.on('finish', resolve)
    out.on('error', reject)
    writeNext(0)
  })

  // Clean up chunks
  fs.rmSync(uploadTmpDir, { recursive: true, force: true })

  const record = {
    id,
    name: storedName,
    originalName: filename,
    size: fileSize,
    uploader: session.user.username ?? session.user.name ?? 'unknown',
    uploaderName: session.user.name ?? session.user.username ?? 'unknown',
    createdAt: new Date().toISOString(),
  }

  const records = readMeta()
  records.push(record)
  writeMeta(records)

  return NextResponse.json({ done: true, record })
}
