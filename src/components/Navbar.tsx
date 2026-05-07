'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { label: 'مزیت‌ها', href: '#advantages' },
  { label: 'امکانات', href: '#features' },
  { label: 'فناوری', href: '#tech' },
  { label: 'امنیت', href: '#security' },
  { label: 'تماس با ما', href: '#contact' },
]

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 h-16 border-b"
        style={{ background: '#fff', borderColor: '#e0eaf4' }}
      >
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 no-underline">
          <Image src="/logoIcon.svg" alt="نوکسین" width={36} height={36} />
          <span
            className="text-xl font-black"
            style={{ color: '#0a3d6b', fontFamily: 'var(--font-vazirmatn)' }}
          >
            نو<span style={{ color: '#0d9aa8' }}>کسین</span>
          </span>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex gap-7">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium no-underline transition-colors"
              style={{ color: '#4a6070' }}
              onMouseEnter={(e) => ((e.target as HTMLElement).style.color = '#1565a8')}
              onMouseLeave={(e) => ((e.target as HTMLElement).style.color = '#4a6070')}
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Desktop CTA */}
          <a
            href="#contact"
            className="hidden md:block rounded-lg text-sm font-bold text-white px-5 py-2.5 transition-colors"
            style={{ background: '#1565a8', fontFamily: 'var(--font-vazirmatn)' }}
            onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#0f4f8a')}
            onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#1565a8')}
          >
            درخواست دمو
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-lg transition-colors"
            style={{ color: '#0a3d6b' }}
            onClick={() => setIsOpen(true)}
            aria-label="باز کردن منو"
          >
            <span className="block w-5 h-0.5 rounded-full bg-current" />
            <span className="block w-5 h-0.5 rounded-full bg-current" />
            <span className="block w-3.5 h-0.5 rounded-full bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-50"
              style={{ background: 'rgba(6,24,39,0.55)', backdropFilter: 'blur(4px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer panel — slides in from the right (RTL start side) */}
            <motion.div
              className="fixed top-0 right-0 z-50 h-full w-72 flex flex-col shadow-2xl"
              style={{ background: '#fff' }}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              {/* Drawer header */}
              <div
                className="flex items-center justify-between px-5 py-4 border-b"
                style={{ borderColor: '#e0eaf4' }}
              >
                <a href="#" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                  <Image src="/logoIcon.svg" alt="نوکسین" width={30} height={30} />
                  <span className="text-lg font-black" style={{ color: '#0a3d6b' }}>
                    نو<span style={{ color: '#0d9aa8' }}>کسین</span>
                  </span>
                </a>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors text-xl"
                  style={{ color: '#4a6070' }}
                  aria-label="بستن منو"
                >
                  ✕
                </button>
              </div>

              {/* Drawer links */}
              <nav className="flex flex-col px-4 pt-4 gap-1">
                {links.map((l, i) => (
                  <motion.a
                    key={l.href}
                    href={l.href}
                    className="text-sm font-medium px-3 py-3 rounded-xl no-underline transition-colors"
                    style={{ color: '#1a2332' }}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#f0f6ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => setIsOpen(false)}
                  >
                    {l.label}
                  </motion.a>
                ))}
              </nav>

              {/* Drawer CTA */}
              <div className="mt-auto px-5 pb-8">
                <a
                  href="#contact"
                  className="block w-full text-center text-sm font-bold text-white py-3.5 rounded-xl transition-colors"
                  style={{ background: '#1565a8', fontFamily: 'var(--font-vazirmatn)' }}
                  onClick={() => setIsOpen(false)}
                >
                  درخواست دمو رایگان
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
