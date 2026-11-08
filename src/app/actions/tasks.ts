'use server'

import { getTasks as dbGetTasks, getTask, saveTask, removeTask } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'crypto'
import { auth } from '@/auth'
import { createNotifications } from '@/app/actions/notifications'

export type Status = 'BACKLOG' | 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'

export type ChecklistItem = { id: string; text: string; done: boolean }

export type Task = {
  id: string
  title: string
  description: string | null
  status: Status
  assignee: string | null
  dueDate: string | null
  order: number
  createdAt: string
  updatedAt: string
  checklist: ChecklistItem[]
}

export async function getTasks(): Promise<Task[]> {
  return dbGetTasks()
}

export async function createTask(title: string): Promise<Task> {
  const all = dbGetTasks()
  const maxOrder = all.length > 0 ? Math.max(...all.map(t => t.order)) : -1
  const task: Task = {
    id: randomUUID(),
    title,
    description: null,
    status: 'BACKLOG',
    assignee: null,
    dueDate: null,
    order: maxOrder + 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    checklist: [],
  }
  saveTask(task)
  revalidatePath('/tasks')
  return task
}

export async function updateTask(id: string, data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'assignee' | 'dueDate'>>): Promise<void> {
  const task = getTask(id)
  if (!task) return
  const updated = { ...task, ...data, updatedAt: new Date().toISOString() }
  saveTask(updated)

  revalidatePath('/tasks')

  // Notify new assignee (best-effort, never blocks the save)
  if ('assignee' in data && data.assignee && data.assignee !== task.assignee) {
    try {
      const session = await auth()
      const fromUser = session?.user?.username ?? ''
      const fromName = session?.user?.name ?? ''
      if (fromUser) {
        await createNotifications({
          type: 'assigned',
          taskId: id,
          taskTitle: updated.title,
          fromUser,
          fromName,
          recipients: [data.assignee],
        })
      }
    } catch { /* notification failure must not break task saving */ }
  }
}

export async function deleteTask(id: string): Promise<void> {
  removeTask(id)
  revalidatePath('/tasks')
}

export async function moveTask(id: string, status: Status): Promise<void> {
  const task = getTask(id)
  if (!task) return
  saveTask({ ...task, status, updatedAt: new Date().toISOString() })
  revalidatePath('/tasks')
}

export async function reorderTask(id: string, status: Status, dstIndex: number): Promise<void> {
  const all = dbGetTasks()
  const task = all.find(t => t.id === id)
  if (!task) return

  const srcStatus = task.status
  const now = new Date().toISOString()

  // Build destination column without the dragged task, then insert at dstIndex
  const dstCol = all
    .filter(t => t.status === status && t.id !== id)
    .sort((a, b) => a.order - b.order)
  dstCol.splice(dstIndex, 0, { ...task, status, updatedAt: now })
  dstCol.forEach((t, i) => saveTask({ ...t, order: i }))

  // Compact source column if cross-column move
  if (srcStatus !== status) {
    const srcCol = all
      .filter(t => t.status === srcStatus && t.id !== id)
      .sort((a, b) => a.order - b.order)
    srcCol.forEach((t, i) => saveTask({ ...t, order: i }))
  }

  revalidatePath('/tasks')
}

export async function addChecklistItem(taskId: string, text: string): Promise<ChecklistItem> {
  const task = getTask(taskId)
  if (!task) throw new Error('Task not found')
  const item: ChecklistItem = { id: randomUUID(), text, done: false }
  saveTask({ ...task, checklist: [...task.checklist, item], updatedAt: new Date().toISOString() })
  revalidatePath('/tasks')
  return item
}

export async function toggleChecklistItem(taskId: string, itemId: string, done: boolean): Promise<void> {
  const task = getTask(taskId)
  if (!task) return
  saveTask({
    ...task,
    checklist: task.checklist.map(i => i.id === itemId ? { ...i, done } : i),
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/tasks')
}

export async function deleteChecklistItem(taskId: string, itemId: string): Promise<void> {
  const task = getTask(taskId)
  if (!task) return
  saveTask({
    ...task,
    checklist: task.checklist.filter(i => i.id !== itemId),
    updatedAt: new Date().toISOString(),
  })
  revalidatePath('/tasks')
}
