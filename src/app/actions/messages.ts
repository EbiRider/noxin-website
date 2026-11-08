'use server'

import { randomUUID } from 'crypto'
import { auth } from '@/auth'
import { saveMessage, getMessages as dbGetMessages, getAllMessages, deleteMessage as dbDeleteMessage, removeMessagesForTask } from '@/lib/db'
import { createNotifications } from '@/app/actions/notifications'
import { revalidatePath } from 'next/cache'
import fs from 'fs'
import path from 'path'

export type Message = {
  id: string
  taskId: string
  author: string
  authorName: string
  content: string
  imageUrl?: string
  mentions: string[]
  createdAt: string
}

const chatImagesDir = path.join(process.cwd(), 'data', 'chat-images')

export async function getMessages(taskId: string): Promise<Message[]> {
  return dbGetMessages(taskId)
}

export async function sendMessage(
  taskId: string,
  taskTitle: string,
  content: string,
  mentions: string[],
  imageData?: string  // base64 data URL
): Promise<Message> {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  let imageUrl: string | undefined
  if (imageData) {
    fs.mkdirSync(chatImagesDir, { recursive: true })
    const base64 = imageData.replace(/^data:image\/\w+;base64,/, '')
    const ext = imageData.match(/data:image\/(\w+)/)?.[1] ?? 'jpg'
    const filename = `${randomUUID()}.${ext}`
    fs.writeFileSync(path.join(chatImagesDir, filename), Buffer.from(base64, 'base64'))
    imageUrl = `/api/chat-images/${filename}`
  }

  const message: Message = {
    id: randomUUID(),
    taskId,
    author: session.user.username ?? '',
    authorName: session.user.name ?? '',
    content,
    imageUrl,
    mentions,
    createdAt: new Date().toISOString(),
  }

  saveMessage(message)

  // Create notifications for mentions
  if (mentions.length > 0) {
    await createNotifications({
      type: 'mentioned',
      taskId,
      taskTitle,
      fromUser: session.user.username ?? '',
      fromName: session.user.name ?? '',
      recipients: mentions,
    })
  }

  // Emit via socket if available
  if (global._io) {
    global._io.to(`task:${taskId}`).emit('message', message)
  }

  revalidatePath('/tasks')
  return message
}

export async function deleteMessage(messageId: string): Promise<void> {
  const session = await auth()
  if (!session?.user) return
  const messages = getAllMessages()
  const msg = messages.find((m: Message) => m.id === messageId)
  if (!msg || msg.author !== session.user.username) return
  if (msg.imageUrl) {
    const filename = msg.imageUrl.split('/').pop()!
    const filePath = path.join(chatImagesDir, filename)
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath)
  }
  dbDeleteMessage(messageId)
  revalidatePath('/tasks')
}

export { removeMessagesForTask }
