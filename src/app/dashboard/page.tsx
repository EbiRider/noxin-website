import { auth, signOut } from '@/auth'
import { getServerStats } from '@/app/actions/server-stats'
import Image from 'next/image'
import Link from 'next/link'
import NotificationBell from './NotificationBell'

const modules = [
  { href: '/tasks', icon: '📋', title: 'مدیریت وظایف',       description: 'ایجاد، تخصیص و پیگیری وظایف تیم' },
  { href: '/files', icon: '📁', title: 'اشتراک‌گذاری فایل', description: 'آپلود و دانلود فایل برای اعضای تیم' },
]

function formatBytes(bytes: number) {
  const gb = bytes / (1024 ** 3)
  return gb >= 1 ? `${gb.toFixed(1)} GB` : `${(bytes / (1024 ** 2)).toFixed(0)} MB`
}

function StatBar({ label, used, total, color }: { label: string; used: number; total: number; color: string }) {
  const pct = total > 0 ? Math.round((used / total) * 100) : 0
  return (
    <div>
      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-gray-600 font-medium">{label}</span>
        <span className="text-gray-400 tabular-nums" dir="ltr">{formatBytes(used)} / {formatBytes(total)} ({pct}%)</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default async function DashboardPage() {
  const [session, stats] = await Promise.all([auth(), getServerStats()])
  const username = session?.user?.username ?? ''

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f0f7] to-[#f0f4f8]" dir="rtl">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Image src="/logoNoxin.svg" alt="Noxin" width={100} height={40} />
        <div className="flex items-center gap-3">
          <NotificationBell username={username} />
          <span className="text-sm text-gray-600">خوش آمدید، <strong>{session?.user?.name}</strong></span>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }) }}>
            <button className="text-sm text-red-500 hover:text-red-700 transition">خروج</button>
          </form>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10 flex flex-col gap-8">
        {/* Modules */}
        <div>
          <h1 className="text-xl font-bold text-[#0a3d6b] mb-1">پنل مدیریت</h1>
          <p className="text-gray-500 text-sm mb-5">ماژول مورد نظر را انتخاب کنید</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map(m => (
              <Link
                key={m.href}
                href={m.href}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#0a3d6b]/20 transition group"
              >
                <div className="text-3xl mb-3">{m.icon}</div>
                <h2 className="text-base font-bold text-[#0a3d6b] group-hover:text-[#0d4d87]">{m.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{m.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Server Resources */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-5">
            <span className="text-lg">🖥️</span>
            <h2 className="text-base font-bold text-[#0a3d6b]">منابع سرور</h2>
            <span className="text-xs text-gray-400 mr-auto">{stats.cpuCount} هسته CPU</span>
          </div>
          <div className="flex flex-col gap-4">
            <StatBar
              label="رم"
              used={stats.totalRam - stats.freeRam}
              total={stats.totalRam}
              color="bg-blue-400"
            />
            {stats.totalDisk > 0 && (
              <StatBar
                label="فضای دیسک"
                used={stats.usedDisk}
                total={stats.totalDisk}
                color={stats.usedDisk / stats.totalDisk > 0.8 ? 'bg-red-400' : 'bg-green-400'}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
