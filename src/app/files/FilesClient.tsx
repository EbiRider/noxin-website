'use client'

import { useState, useTransition, useRef, useCallback } from 'react'
import { deleteFile } from '@/app/actions/files'
import type { FileRecord } from '@/app/actions/files'
function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'short', day: 'numeric' })
}

function fileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (['jpg','jpeg','png','gif','webp','svg'].includes(ext ?? '')) return '🖼️'
  if (['pdf'].includes(ext ?? '')) return '📄'
  if (['zip','rar','7z','tar','gz'].includes(ext ?? '')) return '🗜️'
  if (['mp4','mov','avi','mkv'].includes(ext ?? '')) return '🎬'
  if (['mp3','wav','flac'].includes(ext ?? '')) return '🎵'
  if (['doc','docx'].includes(ext ?? '')) return '📝'
  if (['xls','xlsx'].includes(ext ?? '')) return '📊'
  if (['ppt','pptx'].includes(ext ?? '')) return '📋'
  return '📁'
}

const CHUNK_SIZE  = 1 * 1024 * 1024  // 1 MB per chunk
const MAX_RETRIES = 4
const RETRY_BASE  = 800              // ms — doubles each retry

async function uploadChunk(
  uploadId: string,
  file: File,
  chunkIndex: number,
  totalChunks: number,
  signal: AbortSignal,
): Promise<{ done: boolean; record?: FileRecord }> {
  const start = chunkIndex * CHUNK_SIZE
  const blob  = file.slice(start, start + CHUNK_SIZE)

  const fd = new FormData()
  fd.append('uploadId',    uploadId)
  fd.append('chunkIndex',  String(chunkIndex))
  fd.append('totalChunks', String(totalChunks))
  fd.append('filename',    file.name)
  fd.append('fileSize',    String(file.size))
  fd.append('chunk',       blob, file.name)

  const res = await fetch('/api/upload/chunk', { method: 'POST', body: fd, signal })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    let msg = `HTTP ${res.status}`
    try { msg = JSON.parse(text).error ?? msg } catch { /* keep default */ }
    throw new Error(msg)
  }
  return res.json()
}

async function sleep(ms: number) {
  return new Promise(r => setTimeout(r, ms))
}

type UploadState = {
  name: string
  progress: number    // 0–100, based on server-confirmed chunks
  speed: string
  retrying: boolean
  retryCount: number
  error: string
  done: boolean
}

export default function FilesClient({ initialFiles, currentUser }: {
  initialFiles: FileRecord[]
  currentUser: string
}) {
  const [files, setFiles]       = useState(initialFiles)
  const [search, setSearch]     = useState('')
  const [upload, setUpload]     = useState<UploadState | null>(null)
  const [dragging, setDragging] = useState(false)
  const [, startTransition]     = useTransition()
  const inputRef    = useRef<HTMLInputElement>(null)
  const abortRef    = useRef<AbortController | null>(null)

  const filtered = files.filter(f =>
    f.originalName.toLowerCase().includes(search.toLowerCase()) ||
    f.uploaderName.toLowerCase().includes(search.toLowerCase())
  )

  const startUpload = useCallback(async (file: File) => {
    if (file.size > 50 * 1024 * 1024) {
      setUpload({ name: file.name, progress: 0, speed: '', retrying: false, retryCount: 0, error: 'حداکثر سایز فایل ۵۰ مگابایت است', done: false })
      return
    }

    const abort      = new AbortController()
    abortRef.current = abort
    const uploadId   = generateId()
    const totalChunks = Math.max(1, Math.ceil(file.size / CHUNK_SIZE))

    setUpload({ name: file.name, progress: 0, speed: '', retrying: false, retryCount: 0, error: '', done: false })

    let confirmed    = 0   // chunks successfully saved on server
    let startTime    = Date.now()
    let startBytes   = 0

    for (let i = 0; i < totalChunks; i++) {
      if (abort.signal.aborted) return

      let attempt = 0
      let lastErr = ''

      while (attempt <= MAX_RETRIES) {
        if (abort.signal.aborted) return

        try {
          if (attempt > 0) {
            setUpload(p => p ? { ...p, retrying: true, retryCount: attempt } : p)
            await sleep(RETRY_BASE * Math.pow(2, attempt - 1))
            if (abort.signal.aborted) return
          }

          const result = await uploadChunk(uploadId, file, i, totalChunks, abort.signal)

          confirmed++
          const now         = Date.now()
          const elapsed     = (now - startTime) / 1000
          const bytesNow    = confirmed * CHUNK_SIZE
          const bps         = elapsed > 0.3 ? (bytesNow - startBytes) / elapsed : 0

          let speed = ''
          if (bps > 0) {
            speed = bps >= 1024 * 1024
              ? `${(bps / (1024 * 1024)).toFixed(1)} MB/s`
              : `${(bps / 1024).toFixed(0)} KB/s`
          }

          const pct = Math.round((confirmed / totalChunks) * 100)
          setUpload(p => p ? { ...p, progress: pct, speed, retrying: false, retryCount: 0, error: '' } : p)

          if (result.done && result.record) {
            setFiles(prev => [result.record!, ...prev])
            setUpload(p => p ? { ...p, progress: 100, speed: '', done: true } : p)
            setTimeout(() => setUpload(null), 2000)
            return
          }

          break  // chunk succeeded, move to next

        } catch (err: unknown) {
          if (abort.signal.aborted) return
          lastErr = err instanceof Error ? err.message : 'خطای ناشناخته'
          attempt++
        }
      }

      // All retries exhausted for this chunk
      if (attempt > MAX_RETRIES) {
        setUpload(p => p ? { ...p, error: `خطا پس از ${MAX_RETRIES} تلاش: ${lastErr}`, retrying: false, progress: Math.round((confirmed / totalChunks) * 100) } : p)
        return
      }
    }
  }, [])

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) startUpload(file)
    e.target.value = ''
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) startUpload(file)
  }

  function handleCancel() {
    abortRef.current?.abort()
    setUpload(null)
  }

  function handleDelete(id: string) {
    if (!confirm('حذف شود؟')) return
    setFiles(prev => prev.filter(f => f.id !== id))
    startTransition(() => { deleteFile(id) })
  }

  const isActive = upload !== null && !upload.done && !upload.error

  return (
    <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-8 flex flex-col gap-4" dir="rtl">

      {/* Upload area */}
      <div
        onClick={() => !isActive && inputRef.current?.click()}
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 transition select-none
          ${isActive ? 'cursor-default' : 'cursor-pointer'}
          ${dragging ? 'border-[#0a3d6b] bg-[#0a3d6b]/5' : 'border-gray-200 hover:border-[#0a3d6b]/40 hover:bg-white/50'}
        `}
      >
        {!upload ? (
          <>
            <span className="text-4xl">☁️</span>
            <p className="text-sm font-medium text-gray-600">
              {dragging ? 'رها کنید' : 'کلیک کنید یا فایل را اینجا بکشید'}
            </p>
            <p className="text-xs text-gray-400">حداکثر ۵۰ مگابایت</p>
          </>
        ) : upload.error ? (
          <div className="flex flex-col items-center gap-2" onClick={e => e.stopPropagation()}>
            <span className="text-3xl">❌</span>
            <p className="text-sm text-red-500 text-center">{upload.error}</p>
            <button
              onClick={() => setUpload(null)}
              className="text-xs text-gray-500 hover:text-gray-700 underline mt-1"
            >بستن</button>
          </div>
        ) : (
          <div className="w-full max-w-sm flex flex-col gap-2" onClick={e => e.stopPropagation()}>
            {/* File name + status */}
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="text-gray-600 truncate flex-1">{upload.name}</span>
              <span className="text-gray-400 shrink-0 tabular-nums" dir="ltr">
                {upload.done
                  ? '✓ آپلود شد'
                  : upload.retrying
                    ? `تلاش مجدد ${upload.retryCount}/${MAX_RETRIES}...`
                    : `${upload.progress}%${upload.speed ? ` · ${upload.speed}` : ''}`
                }
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${
                  upload.done      ? 'bg-green-400' :
                  upload.retrying  ? 'bg-yellow-400 animate-pulse' :
                                     'bg-[#0a3d6b]'
                }`}
                style={{ width: `${upload.progress}%` }}
              />
            </div>

            {/* Retry hint */}
            {upload.retrying && (
              <p className="text-[10px] text-yellow-600 text-center">
                اتصال قطع شد — در حال تلاش مجدد...
              </p>
            )}

            {!upload.done && (
              <button
                onClick={handleCancel}
                className="text-xs text-gray-400 hover:text-red-500 transition self-center mt-1"
              >لغو</button>
            )}
          </div>
        )}
        <input ref={inputRef} type="file" className="hidden" onChange={handleFileInput} />
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          placeholder="جستجو در فایل‌ها..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">✕</button>
        )}
      </div>

      {/* File list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📂</p>
          <p className="text-sm">{search ? 'فایلی یافت نشد' : 'هنوز فایلی آپلود نشده'}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map(file => (
            <div key={file.id} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-3">
              <span className="text-2xl shrink-0">{fileIcon(file.originalName)}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate text-right">{file.originalName}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-gray-400" dir="ltr">{formatSize(file.size)}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">{file.uploaderName}</span>
                  <span className="text-gray-200">·</span>
                  <span className="text-xs text-gray-400">{formatDate(file.createdAt)}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/api/files/${file.id}`}
                  download={file.originalName}
                  className="text-xs bg-[#0a3d6b] text-white rounded-lg px-3 py-1.5 hover:bg-[#0d4d87] transition"
                >دانلود</a>
                {file.uploader === currentUser && (
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >حذف</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
