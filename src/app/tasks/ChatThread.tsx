'use client'

import { useState, useEffect, useRef, useCallback, useTransition } from 'react'
import Image from 'next/image'
import { getMessages, sendMessage, type Message } from '@/app/actions/messages'
import { getSocket } from '@/lib/socket'

const ALL_USERS = ['ebrahim', 'elham', 'javad']

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img')
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      const MAX = 1200
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round((height * MAX) / width); width = MAX }
        else { width = Math.round((width * MAX) / height); height = MAX }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', 0.75))
    }
    img.onerror = reject
    img.src = url
  })
}

export default function ChatThread({
  taskId,
  taskTitle,
  currentUser,
  currentName,
}: {
  taskId: string
  taskTitle: string
  currentUser: string
  currentName: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [text, setText] = useState('')
  const [pendingImage, setPendingImage] = useState<string | null>(null)
  const [pendingImageName, setPendingImageName] = useState('')
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [typingUsers, setTypingUsers] = useState<{ username: string; name: string }[]>([])
  const [mentionQuery, setMentionQuery] = useState<string | null>(null)
  const [mentionIndex, setMentionIndex] = useState(0)
  const [, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isTypingRef = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load initial messages
  useEffect(() => {
    getMessages(taskId).then(setMessages)
  }, [taskId])

  // Socket setup
  useEffect(() => {
    const socket = getSocket()
    socket.emit('join-task', taskId)
    socket.emit('join-user', currentUser)

    socket.on('message', (msg: Message) => {
      setMessages(prev => [...prev, msg])
    })

    socket.on('typing', ({ username, name }: { username: string; name: string }) => {
      if (username === currentUser) return
      setTypingUsers(prev => {
        if (prev.find(u => u.username === username)) return prev
        return [...prev, { username, name }]
      })
    })

    socket.on('stop-typing', ({ username }: { username: string }) => {
      setTypingUsers(prev => prev.filter(u => u.username !== username))
    })

    return () => {
      socket.emit('leave-task', taskId)
      socket.off('message')
      socket.off('typing')
      socket.off('stop-typing')
    }
  }, [taskId, currentUser])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typingUsers])

  function emitTyping() {
    const socket = getSocket()
    if (!isTypingRef.current) {
      isTypingRef.current = true
      socket.emit('typing', { taskId, username: currentUser, name: currentName })
    }
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      isTypingRef.current = false
      socket.emit('stop-typing', { taskId, username: currentUser })
    }, 2000)
  }

  function handleTextChange(val: string) {
    setText(val)
    emitTyping()

    // Detect @mention
    const cursor = inputRef.current?.selectionStart ?? val.length
    const slice = val.slice(0, cursor)
    const match = slice.match(/@(\w*)$/)
    if (match) {
      setMentionQuery(match[1].toLowerCase())
      setMentionIndex(0)
    } else {
      setMentionQuery(null)
    }
  }

  const mentionResults = mentionQuery !== null
    ? ALL_USERS.filter(u => u !== currentUser && u.startsWith(mentionQuery))
    : []

  function insertMention(username: string) {
    const cursor = inputRef.current?.selectionStart ?? text.length
    const before = text.slice(0, cursor).replace(/@\w*$/, `@${username} `)
    const after = text.slice(cursor)
    const next = before + after
    setText(next)
    setMentionQuery(null)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(before.length, before.length)
    }, 0)
  }

  function parseMentions(content: string): string[] {
    return (content.match(/@(\w+)/g) ?? []).map(m => m.slice(1))
  }

  async function handleImagePick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const compressed = await compressImage(file)
    setPendingImage(compressed)
    setPendingImageName(file.name)
    e.target.value = ''
  }

  const handleSend = useCallback(() => {
    const content = text.trim()
    if (!content && !pendingImage) return
    const mentions = parseMentions(content)
    const imageData = pendingImage ?? undefined
    setText('')
    setPendingImage(null)
    setPendingImageName('')
    setMentionQuery(null)

    // Stop typing indicator
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    if (isTypingRef.current) {
      isTypingRef.current = false
      getSocket().emit('stop-typing', { taskId, username: currentUser })
    }

    startTransition(async () => {
      const msg = await sendMessage(taskId, taskTitle, content, mentions, imageData)
      // Server action also emits via socket, but optimistically add it
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    })
  }, [text, pendingImage, taskId, taskTitle, currentUser, startTransition])

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })
  }

  function renderContent(content: string, isMine: boolean) {
    const parts = content.split(/(@\w+)/g)
    return parts.map((part, i) =>
      part.startsWith('@')
        ? <span key={i} className={`font-semibold ${isMine ? 'text-blue-200' : 'text-[#0a3d6b]'}`}>{part}</span>
        : part
    )
  }

  async function handlePaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const file = Array.from(e.clipboardData.items)
      .find(item => item.type.startsWith('image/'))
      ?.getAsFile()
    if (!file) return
    e.preventDefault()
    const compressed = await compressImage(file)
    setPendingImage(compressed)
    setPendingImageName('clipboard.jpg')
  }

  return (
    <div className="flex flex-col h-full" dir="rtl">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-2 space-y-3 min-h-0">
        {messages.length === 0 && (
          <p className="text-center text-xs text-gray-400 mt-8">هنوز پیامی ارسال نشده است</p>
        )}
        {messages.map(msg => {
          const isMine = msg.author === currentUser
          return (
            <div key={msg.id} className={`flex gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Avatar */}
              <div className="w-7 h-7 rounded-full bg-[#0a3d6b] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                {msg.authorName.charAt(0).toUpperCase()}
              </div>
              <div className={`flex flex-col gap-0.5 max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                {!isMine && (
                  <span className="text-[10px] text-gray-400">{msg.authorName}</span>
                )}
                {msg.imageUrl && (
                  <button
                    onClick={() => setLightbox(msg.imageUrl!)}
                    className="rounded-xl overflow-hidden border border-gray-200 hover:opacity-90 transition"
                  >
                    <Image
                      src={msg.imageUrl}
                      alt="تصویر"
                      width={220}
                      height={160}
                      className="object-cover max-h-40"
                      unoptimized
                    />
                  </button>
                )}
                {msg.content && (
                  <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    isMine
                      ? 'bg-[#0a3d6b] text-white rounded-tr-sm'
                      : 'bg-gray-100 text-gray-800 rounded-tl-sm'
                  }`}>
                    {renderContent(msg.content, isMine)}
                  </div>
                )}
                <span className="text-[10px] text-gray-400">{formatTime(msg.createdAt)}</span>
              </div>
            </div>
          )
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex gap-2 items-center">
            <div className="w-7 h-7 rounded-full bg-gray-300 text-gray-500 text-xs flex items-center justify-center shrink-0">
              {typingUsers[0].name.charAt(0).toUpperCase()}
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2">
              <span className="text-xs text-gray-500">
                {typingUsers[0].name} در حال تایپ است
              </span>
              <span className="inline-flex gap-0.5 mr-1">
                {[0,1,2].map(i => (
                  <span
                    key={i}
                    className="w-1 h-1 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Pending image preview */}
      {pendingImage && (
        <div className="px-3 py-1.5 border-t border-gray-100 flex items-center gap-2">
          <Image src={pendingImage} alt="پیش‌نمایش" width={48} height={48} className="rounded-lg object-cover h-12 w-12" unoptimized />
          <span className="text-xs text-gray-500 flex-1 truncate">{pendingImageName}</span>
          <button onClick={() => { setPendingImage(null); setPendingImageName('') }} className="text-gray-400 hover:text-red-400 text-sm">✕</button>
        </div>
      )}

      {/* Mention dropdown */}
      {mentionResults.length > 0 && (
        <div className="mx-3 mb-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {mentionResults.map((u, i) => (
            <button
              key={u}
              onMouseDown={e => { e.preventDefault(); insertMention(u) }}
              className={`w-full text-right px-3 py-2 text-sm hover:bg-gray-50 ${i === mentionIndex ? 'bg-gray-50' : ''}`}
            >
              @{u}
            </button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="px-3 pb-3 pt-1 border-t border-gray-100 flex gap-2 items-end">
        <input
          ref={fileInputRef as unknown as React.RefObject<HTMLInputElement>}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImagePick}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-[#0a3d6b] transition shrink-0 mb-0.5"
          title="ارسال تصویر"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
            <circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
        </button>
        <textarea
          ref={inputRef}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30 resize-none max-h-28 overflow-y-auto"
          placeholder="پیام بنویسید... (@ برای منشن)"
          rows={1}
          value={text}
          onChange={e => handleTextChange(e.target.value)}
          onPaste={handlePaste}
          onKeyDown={e => {
            if (mentionResults.length > 0) {
              if (e.key === 'ArrowDown') { e.preventDefault(); setMentionIndex(i => Math.min(i + 1, mentionResults.length - 1)) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setMentionIndex(i => Math.max(i - 1, 0)) }
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); insertMention(mentionResults[mentionIndex]); return }
              if (e.key === 'Escape') { setMentionQuery(null) }
            }
            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
          }}
          style={{ height: 'auto' }}
          onInput={e => {
            const el = e.currentTarget
            el.style.height = 'auto'
            el.style.height = `${Math.min(el.scrollHeight, 112)}px`
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() && !pendingImage}
          className="w-8 h-8 flex items-center justify-center bg-[#0a3d6b] text-white rounded-xl hover:bg-[#0d4d87] disabled:opacity-40 transition shrink-0 mb-0.5"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="تصویر" className="max-w-full max-h-full rounded-xl object-contain" />
        </div>
      )}
    </div>
  )
}
