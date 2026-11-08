'use client'

import { useState, useEffect, useRef } from 'react'
import { getNotifications, getUnreadCount, markNotificationRead, markAllRead, deleteNotification, clearAllNotifications, type Notification } from '@/app/actions/notifications'
import { getSocket } from '@/lib/socket'

export default function NotificationBell({ username }: { username: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unread, setUnread] = useState(0)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getNotifications().then(n => {
      setNotifications(n)
      setUnread(n.filter(x => !x.read).length)
    })
  }, [])

  useEffect(() => {
    const socket = getSocket()
    socket.emit('join-user', username)

    socket.on('notification', (n: Notification) => {
      setNotifications(prev => [n, ...prev])
      setUnread(c => c + 1)
    })

    return () => { socket.off('notification') }
  }, [username])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function handleOpen() {
    setOpen(o => !o)
  }

  async function handleMarkRead(id: string) {
    await markNotificationRead(id)
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    setUnread(prev => Math.max(0, prev - 1))
  }

  async function handleMarkAll() {
    await markAllRead()
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const n = notifications.find(x => x.id === id)
    await deleteNotification(id)
    setNotifications(prev => prev.filter(x => x.id !== id))
    if (n && !n.read) setUnread(c => Math.max(0, c - 1))
  }

  async function handleClearAll() {
    await clearAllNotifications()
    setNotifications([])
    setUnread(0)
  }

  function label(n: Notification) {
    return n.type === 'assigned'
      ? `${n.fromName} وظیفه «${n.taskTitle}» را به شما سپرد`
      : `${n.fromName} شما را در «${n.taskTitle}» منشن کرد`
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition text-gray-500"
        aria-label="اعلان‌ها"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unread > 0 && (
          <span className="absolute -top-0.5 -left-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
            {unread > 99 ? '99+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden" dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <span className="text-sm font-bold text-[#0a3d6b]">اعلان‌ها</span>
            <div className="flex items-center gap-3">
              {unread > 0 && (
                <button onClick={handleMarkAll} className="text-xs text-gray-400 hover:text-[#0a3d6b] transition">
                  خوانده شد
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={handleClearAll} className="text-xs text-gray-400 hover:text-red-500 transition">
                  حذف همه
                </button>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-xs text-gray-400 py-8">اعلانی ندارید</p>
            ) : (
              notifications.map(n => (
                <div
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition group ${!n.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#0a3d6b] text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {n.fromName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 leading-relaxed">{label(n)}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(n.createdAt).toLocaleString('fa-IR', { dateStyle: 'short', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                    {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500" />}
                    <button
                      onClick={e => handleDelete(e, n.id)}
                      className="text-gray-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition text-sm leading-none"
                    >✕</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
