'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const SLIDES = [
  { src: '/tarahAnzan/cadaster.png', caption: 'کاداستر و حدنگار' },
  { src: '/tarahAnzan/map layout.png', caption: 'نقشه‌برداری و طراحی نقشه' },
  { src: '/tarahAnzan/utm.png', caption: 'تهیه نقشه UTM' },
  { src: '/tarahAnzan/utm2.png', caption: 'تهیه نقشه UTM' },
  { src: '/tarahAnzan/single document.png', caption: 'صدور سند تک‌برگ' },
  { src: '/tarahAnzan/land divide.png', caption: 'تفکیک اراضی' },
  { src: '/tarahAnzan/land emerge.png', caption: 'تجمیع اراضی' },
  { src: '/tarahAnzan/land scale.png', caption: 'تعیین حدود اراضی' },
  { src: '/tarahAnzan/plate placement.png', caption: 'جانمایی پلاک' },
  { src: '/tarahAnzan/resolve conflict.png', caption: 'رفع تداخل ثبتی' },
  { src: '/tarahAnzan/legal matters.png', caption: 'امور حقوقی' },
  { src: '/tarahAnzan/official.png', caption: 'کارشناسی رسمی' },
]

export default function HeroSlider() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % SLIDES.length), 4500)
    return () => clearInterval(id)
  }, [])

  const go = (dir: number) => setIndex((i) => (i + dir + SLIDES.length) % SLIDES.length)

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-[#e8b923]/30 shadow-2xl bg-[#0d1b2e]">
      <div className="relative w-full aspect-[3/2]">
        {SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === index ? 1 : 0 }}
          >
            <Image
              src={encodeURI(s.src)}
              alt={s.caption}
              fill
              className="object-contain"
              sizes="100vw"
              priority={i === 0}
            />
          </div>
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0d1b2e] to-transparent p-4 md:p-6">
          <p className="text-white font-bold text-sm md:text-base">{SLIDES[index].caption}</p>
        </div>

        <button
          onClick={() => go(-1)}
          aria-label="اسلاید قبلی"
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0d1b2e]/60 border border-white/20 text-white flex items-center justify-center hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M15 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => go(1)}
          aria-label="اسلاید بعدی"
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0d1b2e]/60 border border-white/20 text-white flex items-center justify-center hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      <div className="absolute top-3 inset-x-0 flex items-center justify-center gap-1.5">
        {SLIDES.map((s, i) => (
          <button
            key={s.src}
            onClick={() => setIndex(i)}
            aria-label={`اسلاید ${i + 1}`}
            className="h-1.5 rounded-full transition-all"
            style={{
              width: i === index ? '18px' : '6px',
              background: i === index ? '#e8b923' : 'rgba(255,255,255,.4)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
