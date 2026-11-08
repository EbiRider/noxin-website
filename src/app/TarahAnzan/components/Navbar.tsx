'use client'

import { useState } from 'react'

const NAV_LINKS = [
  { label: 'صفحه اصلی', href: '#home' },
  { label: 'خدمات ثبتی', href: '#services' },
  { label: 'خدمات فنی', href: '#services' },
  { label: 'خدمات حقوقی', href: '#services' },
  { label: 'قوانین و مقررات', href: '#laws' },
  { label: 'پروژه‌ها', href: '#projects' },
  { label: 'درباره ما', href: '#about' },
  { label: 'تماس با ما', href: '#contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-[#0d1b2e]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full border-2 border-[#e8b923] flex items-center justify-center shrink-0">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#e8b923]" fill="currentColor">
              <path d="M12 2 3 6v2h18V6l-9-4zM5 10v9H3v2h18v-2h-2v-9h-2v9h-3v-9h-2v9H9v-9H7v9H5v-9z" />
            </svg>
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-white font-bold text-base md:text-lg">پارس طراح انزان</p>
            <p className="text-[10px] md:text-xs text-[#9fb0c3]">
              کارگزاری فنی، مهندسی و حقوقی، ثبت اسناد و املاک کشور
            </p>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-6 text-sm text-[#c7d2e0]">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="hover:text-[#e8b923] transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#request"
            className="hidden sm:flex items-center gap-2 bg-[#e8b923] text-[#0d1b2e] font-bold text-sm px-4 py-2 rounded-md hover:bg-[#f2c94c] transition-colors"
          >
            ثبت درخواست
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden text-white p-2"
            aria-label="منو"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden border-t border-white/10 bg-[#0d1b2e] px-4 py-3 flex flex-col gap-3 text-sm text-[#c7d2e0]">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} onClick={() => setOpen(false)} className="hover:text-[#e8b923]">
              {l.label}
            </a>
          ))}
          <a href="#request" className="bg-[#e8b923] text-[#0d1b2e] font-bold text-center px-4 py-2 rounded-md">
            ثبت درخواست
          </a>
        </nav>
      )}
    </header>
  )
}
