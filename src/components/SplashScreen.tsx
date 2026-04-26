'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

export default function SplashScreen({ onDone }: { onDone: () => void }) {
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), 1800)
    const doneTimer = setTimeout(() => onDone(), 2350)
    return () => {
      clearTimeout(exitTimer)
      clearTimeout(doneTimer)
    }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center ${
        exiting ? 'splash-exit' : 'splash-enter'
      }`}
      style={{
        background: 'linear-gradient(135deg, #062a4e 0%, #1565a8 55%, #0d7a8a 100%)',
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          top: -80, left: -80, width: 350, height: 350,
          background: 'rgba(255,255,255,0.04)',
        }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          bottom: -100, right: -60, width: 450, height: 450,
          background: 'rgba(255,255,255,0.03)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-6 px-8">
        <Image
          src="/logoNoxin.svg"
          alt="نوکسین"
          width={420}
          height={113}
          priority
          className="w-72 sm:w-96 md:w-[420px] h-auto"
        />
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-white/40"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
