'use client'

import { HeroFadeUp } from '@/components/ui/motion'

interface HeroProps {
  ready: boolean
}

export default function Hero({ ready }: HeroProps) {
  return (
    <section
      className="relative overflow-hidden px-6 md:px-10 py-20 md:py-24 text-center"
      style={{
        background: 'linear-gradient(135deg, #062a4e 0%, #1565a8 55%, #0d7a8a 100%)',
      }}
    >
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ top: -80, left: -80, width: 350, height: 350, background: 'rgba(255,255,255,0.04)' }}
      />
      <div
        className="absolute rounded-full pointer-events-none"
        style={{ bottom: -100, right: -60, width: 450, height: 450, background: 'rgba(255,255,255,0.03)' }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <HeroFadeUp ready={ready} delay={0.05}>
          <div
            className="inline-block text-xs font-semibold px-5 py-1.5 rounded-full border mb-6"
            style={{
              background: 'rgba(255,255,255,0.12)',
              color: '#90d9f0',
              borderColor: 'rgba(255,255,255,0.18)',
            }}
          >
            🏥 سامانه تخصصی طب کار
          </div>
        </HeroFadeUp>

        <HeroFadeUp ready={ready} delay={0.18}>
          <h1
            className="text-4xl md:text-5xl font-black text-white leading-tight mb-5"
            style={{ fontFamily: 'var(--font-vazirmatn)' }}
          >
            مدیریت هوشمند
            <br />
            <em className="not-italic" style={{ color: '#5dd9e0' }}>سلامت شغلی</em> کارکنان
          </h1>
        </HeroFadeUp>

        <HeroFadeUp ready={ready} delay={0.32}>
          <p
            className="text-base leading-loose mb-10"
            style={{ color: 'rgba(255,255,255,0.72)' }}
          >
            از سال ۱۳۹۶، همراه صنایع مختلف کشور — از بیمارستان صنعت نفت تا شرکت ملی حفاری ایران.
            سامانه‌ای که سلامت کارکنان بیش از ۲۰ شرکت را به‌صورت مستمر پایش می‌کند.
          </p>
        </HeroFadeUp>

        <HeroFadeUp ready={ready} delay={0.44}>
          <div className="flex gap-3.5 justify-center flex-wrap">
            <a
              href="#contact"
              className="rounded-xl text-base font-bold px-8 py-3.5 transition-all"
              style={{ background: '#5dd9e0', color: '#0a3d6b', fontFamily: 'var(--font-vazirmatn)' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#3fd0d7'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#5dd9e0'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              درخواست دمو رایگان
            </a>
            <a
              href="#features"
              className="rounded-xl text-base font-medium px-8 py-3.5 border transition-all"
              style={{
                background: 'transparent',
                color: '#fff',
                borderColor: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-vazirmatn)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.09)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              مشاهده امکانات
            </a>
          </div>
        </HeroFadeUp>
      </div>
    </section>
  )
}
