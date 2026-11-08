import fs from 'fs'
import path from 'path'
import type { Task } from '@/app/actions/tasks'
import type { Message } from '@/app/actions/messages'
import type { Notification } from '@/app/actions/notifications'

const dataDir = path.join(process.cwd(), 'data')

function ensureDir() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
}

function readJson<T>(file: string, fallback: T): T {
  ensureDir()
  if (!fs.existsSync(file)) return fallback
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8'))
    // Migrate old object-keyed format to array format
    if (Array.isArray(fallback) && !Array.isArray(parsed) && parsed !== null && typeof parsed === 'object') {
      const migrated = Object.values(parsed) as unknown as T
      writeJson(file, migrated)  // persist migration immediately
      return migrated
    }
    return parsed
  } catch { return fallback }
}

function writeJson(file: string, data: unknown) {
  ensureDir()
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// ── Tasks ──────────────────────────────────────────────
const tasksFile = path.join(dataDir, 'tasks.json')

export function getTasks(): Task[] {
  return readJson<Task[]>(tasksFile, []).sort((a, b) => a.order - b.order)
}

export function getTask(id: string): Task | undefined {
  return readJson<Task[]>(tasksFile, []).find(t => t.id === id)
}

export function saveTask(task: Task): void {
  const tasks = readJson<Task[]>(tasksFile, [])
  const idx = tasks.findIndex(t => t.id === task.id)
  if (idx >= 0) tasks[idx] = task
  else tasks.push(task)
  writeJson(tasksFile, tasks)
}

export function removeTask(id: string): void {
  writeJson(tasksFile, readJson<Task[]>(tasksFile, []).filter(t => t.id !== id))
}

// ── Messages ───────────────────────────────────────────
const messagesFile = path.join(dataDir, 'messages.json')

export function getAllMessages(): Message[] {
  return readJson<Message[]>(messagesFile, [])
}

export function getMessages(taskId: string): Message[] {
  return readJson<Message[]>(messagesFile, [])
    .filter(m => m.taskId === taskId)
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
}

export function saveMessage(message: Message): void {
  const messages = readJson<Message[]>(messagesFile, [])
  messages.push(message)
  writeJson(messagesFile, messages)
}

export function deleteMessage(id: string): void {
  writeJson(messagesFile, readJson<Message[]>(messagesFile, []).filter(m => m.id !== id))
}

export function removeMessagesForTask(taskId: string): void {
  writeJson(messagesFile, readJson<Message[]>(messagesFile, []).filter(m => m.taskId !== taskId))
}

// ── Notifications ──────────────────────────────────────
const notificationsFile = path.join(dataDir, 'notifications.json')

export function getNotifications(userId: string): Notification[] {
  return readJson<Notification[]>(notificationsFile, [])
    .filter(n => n.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function saveNotification(notification: Notification): void {
  const notifications = readJson<Notification[]>(notificationsFile, [])
  notifications.push(notification)
  writeJson(notificationsFile, notifications)
}

export function markNotificationRead(id: string): void {
  const notifications = readJson<Notification[]>(notificationsFile, [])
  const idx = notifications.findIndex(n => n.id === id)
  if (idx >= 0) notifications[idx].read = true
  writeJson(notificationsFile, notifications)
}

export function markAllNotificationsRead(userId: string): void {
  const notifications = readJson<Notification[]>(notificationsFile, [])
  notifications.forEach(n => { if (n.userId === userId) n.read = true })
  writeJson(notificationsFile, notifications)
}

export function getUnreadCount(userId: string): number {
  return readJson<Notification[]>(notificationsFile, [])
    .filter(n => n.userId === userId && !n.read).length
}

export function deleteNotification(id: string): void {
  writeJson(notificationsFile, readJson<Notification[]>(notificationsFile, []).filter(n => n.id !== id))
}

export function clearAllNotifications(userId: string): void {
  writeJson(notificationsFile, readJson<Notification[]>(notificationsFile, []).filter(n => n.userId !== userId))
}
