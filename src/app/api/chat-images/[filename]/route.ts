import { auth } from '@/auth'
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const chatImagesDir = path.join(process.cwd(), 'data', 'chat-images')

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const session = await auth()
  if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })

  const { filename } = await params
  if (filename.includes('..') || filename.includes('/')) {
    return new NextResponse('Invalid', { status: 400 })
  }

  const filePath = path.join(chatImagesDir, filename)
  if (!fs.existsSync(filePath)) return new NextResponse('Not found', { status: 404 })

  const buffer = fs.readFileSync(filePath)
  const ext = path.extname(filename).slice(1).toLowerCase()
  const mime = ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'

  return new NextResponse(buffer, {
    headers: { 'Content-Type': mime, 'Cache-Control': 'private, max-age=31536000' },
  })
}
