'use server'

import { randomUUID } from 'crypto'
import { auth } from '@/auth'
import {
  getNotifications as dbGetNotifications,
  saveNotification,
  markNotificationRead as dbMarkRead,
  markAllNotificationsRead as dbMarkAllRead,
  getUnreadCount as dbGetUnreadCount,
  deleteNotification as dbDeleteNotification,
  clearAllNotifications as dbClearAll,
} from '@/lib/db'

export type Notification = {
  id: string
  userId: string
  type: 'assigned' | 'mentioned'
  taskId: string
  taskTitle: string
  fromUser: string
  fromName: string
  read: boolean
  createdAt: string
}

export async function getNotifications(): Promise<Notification[]> {
  const session = await auth()
  if (!session?.user?.username) return []
  return dbGetNotifications(session.user.username)
}

export async function getUnreadCount(): Promise<number> {
  const session = await auth()
  if (!session?.user?.username) return 0
  return dbGetUnreadCount(session.user.username)
}

export async function markNotificationRead(id: string): Promise<void> {
  dbMarkRead(id)
}

export async function markAllRead(): Promise<void> {
  const session = await auth()
  if (!session?.user?.username) return
  dbMarkAllRead(session.user.username)
}

export async function deleteNotification(id: string): Promise<void> {
  dbDeleteNotification(id)
}

export async function clearAllNotifications(): Promise<void> {
  const session = await auth()
  if (!session?.user?.username) return
  dbClearAll(session.user.username)
}

export async function createNotifications({
  type,
  taskId,
  taskTitle,
  fromUser,
  fromName,
  recipients,
}: {
  type: 'assigned' | 'mentioned'
  taskId: string
  taskTitle: string
  fromUser: string
  fromName: string
  recipients: string[]
}): Promise<void> {
  for (const userId of recipients) {
    if (userId === fromUser) continue  // don't notify yourself
    const notification: Notification = {
      id: randomUUID(),
      userId,
      type,
      taskId,
      taskTitle,
      fromUser,
      fromName,
      read: false,
      createdAt: new Date().toISOString(),
    }
    saveNotification(notification)
    // Push real-time notification
    if (global._io) {
      global._io.to(`user:${userId}`).emit('notification', notification)
    }
  }
}
