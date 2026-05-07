'use client'

import { FadeUp, StaggerGrid, StaggerItem } from '@/components/ui/motion'

const stats = [
  { num: '۱۳۹۶', label: 'سال تأسیس' },
  { num: '+۲۰',  label: 'شرکت تحت پایش' },
  { num: '۵',    label: 'پروژه بزرگ ملی' },
  { num: 'AI',   label: 'هوش مصنوعی' },
]

export default function About() {
  return (
    <section
      id="about"
      className="py-16 px-6 md:px-10"
      style={{ background: 'linear-gradient(135deg, #062a4e, #0a3d6b)' }}
    >
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <FadeUp>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#5dd9e0' }}>
            معرفی شرکت
          </p>
          <h2 className="text-2xl font-bold mb-6 text-white">سابقه‌ای که به آن افتخار می‌کنیم</h2>
          <p className="text-sm leading-loose mb-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
            از سال ۱۳۹۶ فعالیت خود را با این باور آغاز کردیم که سلامت و ایمنی نیروی انسانی،
            پایه اصلی توسعه پایدار هر سازمان است.
          </p>
          <p className="text-sm leading-loose mb-5" style={{ color: 'rgba(255,255,255,0.72)' }}>
            همکاری با بیمارستان صنعت نفت، شرکت ملی حفاری ایران، بازار کار عمان و استقرار
            نرم‌افزار در مرکز پزشکی آب و برق خوزستان، بخشی از مسیر ماست.
          </p>
          <p className="text-sm leading-loose" style={{ color: 'rgba(255,255,255,0.72)' }}>
            تیم ما متشکل از متخصصان نخبه و دانشگاهی است که با تکیه بر تحقیق و توسعه، هوش
            مصنوعی را برای تحلیل دقیق‌تر و پیش‌بینی ریسک‌ها به‌کار می‌گیرد.
          </p>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-2 gap-4">
          {stats.map((s) => (
            <StaggerItem key={s.label}>
              <div
                className="rounded-xl p-5 text-center border"
                style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.1)' }}
              >
                <span className="block text-3xl font-black mb-1" style={{ color: '#5dd9e0' }}>
                  {s.num}
                </span>
                <span className="text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
                  {s.label}
                </span>
              </div>
            </StaggerItem>
          ))}
        </StaggerGrid>
      </div>
    </section>
  )
}
