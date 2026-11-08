'use client'

import { useEffect, useState } from 'react'

export default function Splash({ onDone }: { onDone: () => void }) {
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0d1b2e] ${
        exiting ? 'splash-exit' : 'splash-enter'
      }`}
    >
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,185,35,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(232,185,35,.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#e8b923]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#1e3a5f]/60 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center gap-5 px-8">
        <div className="w-20 h-20 rounded-full border-2 border-[#e8b923] flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-[#e8b923]" fill="currentColor">
            <path d="M12 2 3 6v2h18V6l-9-4zM5 10v9H3v2h18v-2h-2v-9h-2v9h-3v-9h-2v9H9v-9H7v9H5v-9z" />
          </svg>
        </div>
        <p className="font-nastaliq text-[#e8b923] font-bold text-3xl sm:text-4xl">پارس طراح انزان</p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#e8b923]"
              style={{ animation: `ta-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ta-pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50%       { opacity: 1;   transform: scale(1.1); }
        }
      `}</style>
    </div>
  )
}
