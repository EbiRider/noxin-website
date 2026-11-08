'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { username, password, redirect: false })
    setLoading(false)
    if (res?.ok) {
      router.push('/dashboard')
    } else {
      setError('نام کاربری یا رمز عبور اشتباه است')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#e8f0f7] to-[#f0f4f8]">
      <div className="bg-white rounded-2xl shadow-xl p-10 w-full max-w-sm flex flex-col items-center gap-6">
        <Image src="/logoNoxin.svg" alt="Noxin" width={120} height={48} priority />
        <div className="text-center">
          <h1 className="text-xl font-bold text-[#0a3d6b]">ورود به پنل</h1>
          <p className="text-sm text-gray-500 mt-1">با حساب کاربری خود وارد شوید</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" dir="rtl">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">نام کاربری</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30"
              placeholder="نام کاربری"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">رمز عبور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a3d6b]/30"
              required
            />
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0a3d6b] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#0d4d87] transition disabled:opacity-60"
          >
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>
      </div>
    </div>
  )
}
