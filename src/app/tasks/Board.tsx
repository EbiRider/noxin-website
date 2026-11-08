'use client'

import { useState, useTransition } from 'react'
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd'
import type { Task, Status } from '@/app/actions/tasks'
import { createTask, reorderTask } from '@/app/actions/tasks'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

const COLUMNS: { id: Status; label: string; color: string }[] = [
  { id: 'BACKLOG',     label: 'بک‌لاگ',       color: 'bg-gray-200' },
  { id: 'TODO',        label: 'انجام دادنی',  color: 'bg-blue-200' },
  { id: 'IN_PROGRESS', label: 'در حال انجام', color: 'bg-yellow-200' },
  { id: 'REVIEW',      label: 'بررسی',        color: 'bg-purple-200' },
  { id: 'DONE',        label: 'انجام شد',     color: 'bg-green-200' },
]

export default function Board({ initialTasks, currentUser, currentName }: { initialTasks: Task[]; currentUser: string; currentName: string }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [newTitle, setNewTitle] = useState<Record<string, string>>({})
  const [adding, setAdding] = useState<string | null>(null)
  const [, startTransition] = useTransition()

  function tasksFor(status: Status) {
    return tasks.filter(t => t.status === status).sort((a, b) => a.order - b.order)
  }

  function onDragEnd(result: DropResult) {
    const { source, destination, draggableId } = result
    if (!destination) return

    const srcStatus = source.droppableId as Status
    const dstStatus = destination.droppableId as Status
    const dstIndex  = destination.index

    setTasks(prev => {
      const srcCol = prev.filter(t => t.status === srcStatus).sort((a, b) => a.order - b.order)
      const moved  = prev.find(t => t.id === draggableId)!
      const srcWithout = srcCol.filter(t => t.id !== draggableId)

      const dstWithout = srcStatus === dstStatus
        ? srcWithout
        : prev.filter(t => t.status === dstStatus).sort((a, b) => a.order - b.order)

      const newDst = [...dstWithout]
      newDst.splice(dstIndex, 0, { ...moved, status: dstStatus })

      const updates = new Map<string, { order: number; status: Status }>()
      newDst.forEach((t, i) => updates.set(t.id, { order: i, status: dstStatus }))
      if (srcStatus !== dstStatus) {
        srcWithout.forEach((t, i) => updates.set(t.id, { order: i, status: srcStatus }))
      }

      return prev.map(t => {
        const u = updates.get(t.id)
        return u ? { ...t, order: u.order, status: u.status } : t
      })
    })

    startTransition(() => { reorderTask(draggableId, dstStatus, dstIndex) })
  }

  async function handleAddTask(status: Status) {
    const title = newTitle[status]?.trim()
    if (!title) return
    setNewTitle(p => ({ ...p, [status]: '' }))
    setAdding(null)
    startTransition(async () => {
      const task = await createTask(title)
      const moved = { ...task, status }
      await reorderTask(task.id, status, 9999)
      setTasks(prev => [...prev, moved])
    })
  }

  function onTaskUpdate(updated: Task) {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
    setSelectedTask(updated)
  }

  function onTaskDelete(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id))
    setSelectedTask(null)
  }

  return (
    <>
      <div className="flex-1 overflow-x-auto p-6">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 h-full min-w-max">
            {COLUMNS.map(col => (
              <div key={col.id} className="w-64 flex flex-col gap-2">
                <div className={`${col.color} rounded-lg px-3 py-2 flex items-center justify-between`}>
                  <span className="text-sm font-bold text-gray-700">{col.label}</span>
                  <span className="text-xs bg-white/60 rounded-full px-2 py-0.5 text-gray-600">
                    {tasksFor(col.id).length}
                  </span>
                </div>

                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 flex flex-col gap-2 rounded-lg p-2 min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-white/60' : 'bg-transparent'
                      }`}
                    >
                      {tasksFor(col.id).map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard
                                task={task}
                                isDragging={snapshot.isDragging}
                                onClick={() => setSelectedTask(task)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {adding === col.id ? (
                        <div className="bg-white rounded-lg p-2 shadow-sm flex flex-col gap-2">
                          <input
                            autoFocus
                            className="text-sm border border-gray-200 rounded px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30"
                            placeholder="عنوان وظیفه..."
                            value={newTitle[col.id] ?? ''}
                            onChange={e => setNewTitle(p => ({ ...p, [col.id]: e.target.value }))}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleAddTask(col.id)
                              if (e.key === 'Escape') setAdding(null)
                            }}
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAddTask(col.id)}
                              className="text-xs bg-[#0a3d6b] text-white rounded px-3 py-1.5 hover:bg-[#0d4d87] transition"
                            >افزودن</button>
                            <button
                              onClick={() => setAdding(null)}
                              className="text-xs text-gray-500 hover:text-gray-700"
                            >لغو</button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAdding(col.id)}
                          className="text-sm text-gray-400 hover:text-gray-600 hover:bg-white/60 rounded-lg px-3 py-2 text-right transition w-full"
                        >+ افزودن وظیفه</button>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {selectedTask && (
        <TaskModal
          task={selectedTask}
          currentUser={currentUser}
          currentName={currentName}
          onClose={() => setSelectedTask(null)}
          onUpdate={onTaskUpdate}
          onDelete={onTaskDelete}
        />
      )}
    </>
  )
}
