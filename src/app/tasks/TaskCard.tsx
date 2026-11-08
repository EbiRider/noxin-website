'use client'

import type { Task } from '@/app/actions/tasks'

const ASSIGNEE_COLORS: Record<string, string> = {
  ebrahim: 'bg-blue-100 text-blue-700',
  elham:   'bg-pink-100 text-pink-700',
}

function dueDateLabel(dueDate: string): { label: string; cls: string } {
  const due   = new Date(dueDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  due.setHours(0, 0, 0, 0)
  const diff = Math.round((due.getTime() - today.getTime()) / 86400000)

  const label = due.toLocaleDateString('fa-IR', { month: 'short', day: 'numeric' })
  if (diff < 0)  return { label, cls: 'bg-red-100 text-red-600' }
  if (diff === 0) return { label: 'امروز', cls: 'bg-orange-100 text-orange-600' }
  if (diff === 1) return { label: 'فردا',  cls: 'bg-orange-100 text-orange-600' }
  return { label, cls: 'bg-gray-100 text-gray-500' }
}

export default function TaskCard({ task, isDragging, onClick }: {
  task: Task
  isDragging: boolean
  onClick: () => void
}) {
  const done = task.checklist.filter(i => i.done).length
  const total = task.checklist.length
  const due = task.dueDate ? dueDateLabel(task.dueDate) : null

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-lg p-3 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition select-none ${
        isDragging ? 'shadow-lg rotate-1 scale-105' : ''
      }`}
    >
      <p className="text-sm font-medium text-gray-800 leading-snug">{task.title}</p>

      {task.description && (
        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between mt-2 gap-2 flex-wrap">
        {total > 0 && (
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-400 rounded-full transition-all"
                style={{ width: `${(done / total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-400">{done}/{total}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mr-auto flex-wrap justify-end">
          {due && (
            <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${due.cls}`}>
              📅 {due.label}
            </span>
          )}
          {task.assignee && (
            <span className={`text-xs rounded-full px-2 py-0.5 font-medium ${ASSIGNEE_COLORS[task.assignee] ?? 'bg-gray-100 text-gray-600'}`}>
              {task.assignee}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
