'use client'

import Image from 'next/image'

const links = [
  { label: 'مزیت‌ها', href: '#advantages' },
  { label: 'امکانات', href: '#features' },
  { label: 'فناوری', href: '#tech' },
  { label: 'امنیت', href: '#security' },
  { label: 'تماس', href: '#contact' },
]

export default function Navbar() {
  return (
    <nav
      className="sticky top-0 z-40 flex items-center justify-between px-6 md:px-10 h-16 border-b"
      style={{ background: '#fff', borderColor: '#e0eaf4' }}
    >
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <Image src="/logoIcon.svg" alt="نوکسین" width={36} height={36} />
        <span
          className="text-xl font-black"
          style={{ color: '#0a3d6b', fontFamily: 'var(--font-vazirmatn)' }}
        >
          نو<span style={{ color: '#0d9aa8' }}>کسین</span>
        </span>
      </a>

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

      <a
        href="#contact"
        className="rounded-lg text-sm font-bold text-white px-5 py-2.5 transition-colors"
        style={{ background: '#1565a8', fontFamily: 'var(--font-vazirmatn)' }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.background = '#0f4f8a')}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.background = '#1565a8')}
      >
        درخواست دمو
      </a>
    </nav>
  )
}
