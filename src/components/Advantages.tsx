'use client'

import { FadeUp, StaggerGrid, StaggerItem } from '@/components/ui/motion'

const items = [
  { icon: '💰', bg: '#ddeeff', title: 'کاهش هزینه‌ها',       desc: 'کاهش هزینه‌های اجرایی و افزایش بهره‌وری مراکز از طریق دیجیتالی‌سازی فرایندها' },
  { icon: '📜', bg: '#d3f7f5', title: 'انطباق با آیین‌نامه‌ها', desc: 'انطباق کامل با آیین‌نامه رسمی وزارت بهداشت و الزامات قانونی طب کار' },
  { icon: '⚡', bg: '#d7f3e2', title: 'افزایش سرعت',          desc: 'افزایش سرعت تکمیل پرونده‌ها و کاهش چشمگیر حجم کار پرسنل مرکز' },
  { icon: '🎯', bg: '#fdecd7', title: 'بهبود دقت',            desc: 'بهبود دقت در تشخیص و نظردهی پزشک با تحلیل هوشمند داده‌ها' },
]

export default function Advantages() {
  return (
    <section id="advantages" className="bg-white py-14 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#0d9aa8' }}>
            مزیت‌های کلی
          </p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0a3d6b' }}>چرا ژینوس؟</h2>
          <p className="text-sm mb-9 leading-relaxed" style={{ color: '#6b7f96' }}>
            چهار مزیت اصلی که ژینوس را از سایر سامانه‌های طب کار متمایز می‌کند
          </p>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((item) => (
            <StaggerItem key={item.title}>
              <div
                className="rounded-2xl p-7 border transition-all duration-200 bg-white cursor-default h-full"
                style={{ borderColor: '#e0eaf4' }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = '#1565a8'
                  el.style.transform = 'translateY(-3px)'
                  el.style.boxShadow = '0 8px 28px rgba(21,101,168,0.09)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = '#e0eaf4'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4"
                  style={{ background: item.bg }}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-1.5" style={{ color: '#1a2332' }}>{item.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: '#6b7f96' }}>{item.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
