'use client'

import { FadeUp, StaggerGrid, StaggerItem } from '@/components/ui/motion'

const techs = [
  { tag: 'Frontend',  title: 'Next.js',          desc: 'رابط کاربری مستقل و مدرن با عملکرد سریع' },
  { tag: 'Backend',   title: '.NET Core 8',       desc: 'بک‌اند قدرتمند مبتنی بر Clean Architecture' },
  { tag: 'Database',  title: 'SQL Server 2021',   desc: 'پایگاه داده سازمانی با قابلیت بالا' },
  { tag: 'Protocol',  title: 'REST API / HTTPS',  desc: 'ارتباط ایمن و استاندارد بین لایه‌ها' },
  { tag: 'Auth',      title: 'JWT + RBAC',        desc: 'احراز هویت امن و کنترل دسترسی نقش‌محور' },
  { tag: 'استقرار',   title: 'On-Premise',        desc: 'نصب روی سرور سازمان، بدون وابستگی به Cloud' },
]

export default function TechStack() {
  return (
    <section
      id="tech"
      className="py-14 px-6 md:px-10 border-t"
      style={{ background: '#f7fafd', borderColor: '#e0eaf4' }}
    >
      <div className="max-w-5xl mx-auto">
        <FadeUp>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#0d9aa8' }}>
            معماری فناوری
          </p>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#0a3d6b' }}>زیرساخت مدرن و قابل اعتماد</h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: '#6b7f96' }}>
            معماری Clean Architecture با تفکیک کامل لایه‌ها و امنیت بالا
          </p>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
          {techs.map((t) => (
            <StaggerItem key={t.title}>
              <div
                className="bg-white rounded-xl px-4 py-5 text-center border h-full"
                style={{ borderColor: '#e0eaf4' }}
              >
                <span
                  className="inline-block text-xs font-bold px-3 py-1 rounded-full mb-2.5"
                  style={{ background: '#ddeeff', color: '#1565a8' }}
                >
                  {t.tag}
                </span>
                <h4 className="text-sm font-bold mb-1.5" style={{ color: '#1a2332' }}>{t.title}</h4>
                <p className="text-xs leading-snug" style={{ color: '#7a8fa6' }}>{t.desc}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
