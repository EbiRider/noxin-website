import { HeroFadeUp } from '@/components/ui/motion'
import HeroSlider from './HeroSlider'

const FEATURES = [
  { title: 'دقت و کیفیت', desc: 'استفاده از تجهیزات پیشرفته', icon: 'target' },
  { title: 'سرعت در اجرا', desc: 'تحویل سریع و به موقع', icon: 'bolt' },
  { title: 'تجربه و تخصص', desc: 'بیش از ۱۵ سال سابقه حرفه‌ای', icon: 'medal' },
  { title: 'اعتماد و اطمینان', desc: 'مجوز رسمی از سازمان ثبت', icon: 'shield' },
]

function FeatureIcon({ name }: { name: string }) {
  const common = 'w-5 h-5 text-[#e8b923]'
  switch (name) {
    case 'target':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="12" r="8" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      )
    case 'bolt':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="currentColor">
          <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
        </svg>
      )
    case 'medal':
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth={2}>
          <circle cx="12" cy="8" r="5" />
          <path d="M8 12 6 22l6-3 6 3-2-10" />
        </svg>
      )
    default:
      return (
        <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" />
        </svg>
      )
  }
}

export default function Hero({ ready }: { ready: boolean }) {
  return (
    <section id="home" className="relative overflow-hidden bg-[#0d1b2e]">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(rgba(232,185,35,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(232,185,35,.15) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#e8b923]/10 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#1e3a5f]/60 blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-10 md:py-14">
        <HeroFadeUp ready={ready} className="mb-10">
          <HeroSlider />
        </HeroFadeUp>

        <div className="max-w-3xl mx-auto text-center">
          <HeroFadeUp ready={ready} delay={0.1}>
            <h1 className="text-white font-black text-3xl md:text-5xl leading-tight mb-2">
              کارگزاری فنی، مهندسی و حقوقی
            </h1>
            <p className="font-nastaliq text-[#e8b923] font-bold text-2xl md:text-3xl mb-4">
              پارس طراح انزان
            </p>
            <p className="text-[#c7d2e0] text-sm md:text-base leading-7 mb-6">
              مرجع تخصصی خدمات ثبتی، نقشه‌برداری، کاداستر و امور حقوقی و مهندسی
              <br className="hidden md:block" /> با تکیه بر دانش، تجربه و قانون
            </p>
          </HeroFadeUp>

          <HeroFadeUp ready={ready} delay={0.2}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
              {FEATURES.map((f) => (
                <div key={f.title} className="bg-white/5 border border-white/10 rounded-lg px-3 py-3">
                  <FeatureIcon name={f.icon} />
                  <p className="text-white text-xs font-bold mt-2">{f.title}</p>
                  <p className="text-[#8ea0b5] text-[10px] mt-0.5">{f.desc}</p>
                </div>
              ))}
            </div>
          </HeroFadeUp>

          <HeroFadeUp ready={ready} delay={0.3}>
            <div className="flex flex-wrap justify-center gap-3">
              <a
                href="#request"
                className="flex items-center gap-2 bg-[#e8b923] text-[#0d1b2e] font-bold text-sm px-6 py-3 rounded-md hover:bg-[#f2c94c] transition-colors"
              >
                ثبت درخواست مشاوره رایگان
              </a>
              <a
                href="#services"
                className="flex items-center gap-2 border border-white/20 text-white font-bold text-sm px-6 py-3 rounded-md hover:border-[#e8b923] hover:text-[#e8b923] transition-colors"
              >
                مشاهده همه خدمات
              </a>
            </div>
          </HeroFadeUp>
        </div>
      </div>
    </section>
  )
}
