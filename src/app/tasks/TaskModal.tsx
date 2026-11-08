'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import DatePicker from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import type { Task, Status, ChecklistItem } from '@/app/actions/tasks'
import {
  updateTask, deleteTask,
  addChecklistItem, toggleChecklistItem, deleteChecklistItem,
} from '@/app/actions/tasks'
import ChatThread from './ChatThread'

const STATUSES: { id: Status; label: string }[] = [
  { id: 'BACKLOG',     label: 'بک‌لاگ' },
  { id: 'TODO',        label: 'انجام دادنی' },
  { id: 'IN_PROGRESS', label: 'در حال انجام' },
  { id: 'REVIEW',      label: 'بررسی' },
  { id: 'DONE',        label: 'انجام شد' },
]

const USERS = ['ebrahim', 'elham', 'javad']

export default function TaskModal({ task, currentUser, currentName, onClose, onUpdate, onDelete }: {
  task: Task
  currentUser: string
  currentName: string
  onClose: () => void
  onUpdate: (t: Task) => void
  onDelete: (id: string) => void
}) {
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [status, setStatus] = useState<Status>(task.status)
  const [assignee, setAssignee] = useState(task.assignee ?? '')
  const [dueDate, setDueDate] = useState(task.dueDate ?? '')
  const [checklist, setChecklist] = useState<ChecklistItem[]>(task.checklist)
  const [newItem, setNewItem] = useState('')
  const [activeTab, setActiveTab] = useState<'details' | 'chat'>('details')
  const [, startTransition] = useTransition()
  const backdropRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  function currentTask(overrides: Partial<Task> = {}): Task {
    return { ...task, title, description: description || null, status, assignee: assignee || null, dueDate: dueDate || null, checklist, ...overrides }
  }

  function save(patch: Partial<Pick<Task, 'title' | 'description' | 'status' | 'assignee' | 'dueDate'>>) {
    startTransition(() => { updateTask(task.id, patch) })
    onUpdate(currentTask(patch))
  }

  function handleAddItem() {
    if (!newItem.trim()) return
    const text = newItem.trim()
    setNewItem('')
    startTransition(async () => {
      const item = await addChecklistItem(task.id, text)
      const updated = [...checklist, item]
      setChecklist(updated)
      onUpdate(currentTask({ checklist: updated }))
    })
  }

  function handleToggle(itemId: string, done: boolean) {
    const updated = checklist.map(i => i.id === itemId ? { ...i, done } : i)
    setChecklist(updated)
    onUpdate(currentTask({ checklist: updated }))
    startTransition(() => { toggleChecklistItem(task.id, itemId, done) })
  }

  function handleDeleteItem(itemId: string) {
    const updated = checklist.filter(i => i.id !== itemId)
    setChecklist(updated)
    onUpdate(currentTask({ checklist: updated }))
    startTransition(() => { deleteChecklistItem(task.id, itemId) })
  }

  function handleDelete() {
    if (!confirm('آیا از حذف این وظیفه مطمئنید؟')) return
    startTransition(() => { deleteTask(task.id) })
    onDelete(task.id)
  }

  const doneCount = checklist.filter(i => i.done).length

  return (
    <div
      ref={backdropRef}
      onClick={e => { if (e.target === backdropRef.current) onClose() }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      {/* Wide modal: side-by-side on desktop, tabs on mobile */}
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-hidden flex flex-col" dir="rtl">

        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-6 pt-5 pb-3 border-b border-gray-100 shrink-0">
          <input
            className="text-lg font-bold text-[#0a3d6b] flex-1 border-b border-transparent hover:border-gray-200 focus:border-[#0a3d6b] focus:outline-none py-0.5 bg-transparent"
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => save({ title })}
          />
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        {/* Mobile tabs */}
        <div className="flex lg:hidden border-b border-gray-100 shrink-0">
          {(['details', 'chat'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-sm font-medium transition ${
                activeTab === tab
                  ? 'text-[#0a3d6b] border-b-2 border-[#0a3d6b]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab === 'details' ? 'جزئیات' : 'گفتگو'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex flex-1 min-h-0 overflow-hidden">

          {/* Details panel */}
          <div className={`flex flex-col gap-5 overflow-y-auto p-6 w-full lg:w-[420px] lg:border-l border-gray-100 shrink-0 ${activeTab === 'chat' ? 'hidden lg:flex' : 'flex'}`}>

            {/* Status + Assignee */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">وضعیت</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30 bg-white"
                  value={status}
                  onChange={e => { const s = e.target.value as Status; setStatus(s); save({ status: s }) }}
                >
                  {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">مسئول</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30 bg-white"
                  value={assignee}
                  onChange={e => { setAssignee(e.target.value); save({ assignee: e.target.value || null } as never) }}
                >
                  <option value="">— بدون مسئول —</option>
                  {USERS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
              </div>
            </div>

            {/* Due date */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">تاریخ سررسید</label>
              <DatePicker
                calendar={persian}
                locale={persian_fa}
                calendarPosition="bottom-right"
                value={dueDate ? new Date(dueDate) : null}
                onChange={(date) => {
                  if (!date) {
                    setDueDate('')
                    save({ dueDate: null })
                    return
                  }
                  const d = date.toDate()
                  const iso = d.toISOString().split('T')[0]
                  setDueDate(iso)
                  save({ dueDate: iso })
                }}
                render={(value, openCalendar) => (
                  <div className="relative">
                    <input
                      readOnly
                      value={value}
                      onClick={openCalendar}
                      placeholder="انتخاب تاریخ..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30 bg-white cursor-pointer text-right"
                    />
                    {dueDate && (
                      <button
                        onClick={() => { setDueDate(''); save({ dueDate: null }) }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                      >✕</button>
                    )}
                  </div>
                )}
              />
            </div>

            {/* Description */}
            <div>
              <label className="text-xs text-gray-500 block mb-1">توضیحات</label>
              <textarea
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30 resize-none"
                rows={3}
                placeholder="توضیحات وظیفه..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                onBlur={() => save({ description: description || null } as never)}
              />
            </div>

            {/* Checklist */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs text-gray-500">چک‌لیست</label>
                {checklist.length > 0 && (
                  <span className="text-xs text-gray-400">{doneCount}/{checklist.length}</span>
                )}
              </div>

              {checklist.length > 0 && (
                <div className="mb-2 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{ width: `${(doneCount / checklist.length) * 100}%` }}
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5 mb-2">
                {checklist.map(item => (
                  <div key={item.id} className="flex items-center gap-2 group">
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={e => handleToggle(item.id, e.target.checked)}
                      className="rounded accent-[#0a3d6b] w-4 h-4 shrink-0"
                    />
                    <span className={`text-sm flex-1 ${item.done ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition text-sm"
                    >✕</button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30"
                  placeholder="آیتم جدید..."
                  value={newItem}
                  onChange={e => setNewItem(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddItem() }}
                />
                <button
                  onClick={handleAddItem}
                  className="bg-[#0a3d6b] text-white rounded-lg px-3 py-1.5 text-sm hover:bg-[#0d4d87] transition"
                >افزودن</button>
              </div>
            </div>

            {/* Delete */}
            <div className="border-t border-gray-100 pt-4 mt-auto">
              <button
                onClick={handleDelete}
                className="text-sm text-red-400 hover:text-red-600 transition"
              >حذف این وظیفه</button>
            </div>
          </div>

          {/* Chat panel */}
          <div className={`flex-1 min-h-0 min-w-0 ${activeTab === 'details' ? 'hidden lg:flex lg:flex-col' : 'flex flex-col'}`}>
            <ChatThread
              taskId={task.id}
              taskTitle={task.title}
              currentUser={currentUser}
              currentName={currentName}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
