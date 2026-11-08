import { auth, signOut } from '@/auth'
import { getFiles } from '@/app/actions/files'
import Image from 'next/image'
import Link from 'next/link'
import FilesClient from './FilesClient'
import NotificationBell from '@/app/dashboard/NotificationBell'

export default async function FilesPage() {
  const [session, files] = await Promise.all([auth(), getFiles()])
  const username = session?.user?.username ?? ''

  return (
    <div className="min-h-screen bg-[#f0f4f8] flex flex-col" dir="rtl">
      <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Image src="/logoNoxin.svg" alt="Noxin" width={90} height={36} />
          <span className="text-gray-300">|</span>
          <Link href="/dashboard" className="text-sm text-gray-400 hover:text-[#0a3d6b] transition">پنل</Link>
          <span className="text-gray-300">/</span>
          <span className="text-sm font-medium text-[#0a3d6b]">اشتراک‌گذاری فایل</span>
        </div>
        <div className="flex items-center gap-3">
          <NotificationBell username={username} />
          <span className="text-sm text-gray-500">{session?.user?.name}</span>
          <form action={async () => { 'use server'; await signOut({ redirectTo: '/login' }) }}>
            <button className="text-sm text-red-500 hover:text-red-700 transition">خروج</button>
          </form>
        </div>
      </header>
      <FilesClient
        initialFiles={files}
        currentUser={username}
      />
    </div>
  )
}
