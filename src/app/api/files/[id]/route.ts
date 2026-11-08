import { auth } from '@/auth'
import { getFiles } from '@/app/actions/files'
import fs from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'

const uploadsDir = path.join(process.cwd(), 'data', 'uploads')

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth()
  if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })

  const { id } = await params
  const files = await getFiles()
  const file = files.find(f => f.id === id)
  if (!file) return new NextResponse('Not found', { status: 404 })

  const filePath = path.join(uploadsDir, file.name)
  if (!fs.existsSync(filePath)) return new NextResponse('File missing', { status: 404 })

  const buffer = fs.readFileSync(filePath)
  return new NextResponse(buffer, {
    headers: {
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Content-Type': 'application/octet-stream',
      'Content-Length': String(file.size),
    },
  })
}
