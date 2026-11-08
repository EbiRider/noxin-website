import { StaggerGrid, StaggerItem } from '@/components/ui/motion'

const LAWS = [
  'قانون ثبت اسناد و املاک',
  'آیین‌نامه قانون ثبت',
  'قانون جامع حدنگار (کاداستر)',
  'قانون الزام به ثبت رسمی معاملات',
  'قانون افراز و فروش املاک مشاع',
  'قانون تعیین تکلیف اراضی فاقد سند',
]

const CIRCULARS = [
  { no: '۱۴۰۳/۱۷۲/۵', date: '۱۴۰۳/۱۲/۲۰', title: 'دستورالعمل اجرایی قانون حدنگار (کاداستر)' },
  { no: '۱۴۰۳/۹۸/۴۶', date: '۱۴۰۳/۱۱/۰۵', title: 'ضوابط تهیه و تأیید نقشه‌های UTM' },
  { no: '۱۴۰۳/۵/۱۸', date: '۱۴۰۳/۰۹/۱۸', title: 'دستورالعمل تفکیک و افراز املاک' },
  { no: '۱۴۰۳/۶۲/۲۲', date: '۱۴۰۳/۰۸/۲۲', title: 'نحوه جانمایی و تعیین مختصات املاک' },
  { no: '۱۴۰۳/۴۵/۱۱', date: '۱۴۰۳/۰۷/۱۱', title: 'دستورالعمل رفع تداخلات ثبتی' },
]

const PORTAL = [
  'جستجوی بخشنامه',
  'جستجوی قانون و آیین‌نامه',
  'دانلود فرم‌ها',
  'دانلود نمونه دادخواست',
  'دانلود نمونه نقشه',
  'محاسبه تعرفه خدمات',
]

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 text-[#e8b923] shrink-0" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PanelCard({
  title,
  icon,
  children,
  cta,
}: {
  title: string
  icon: JSX.Element
  children: React.ReactNode
  cta: string
}) {
  return (
    <StaggerItem className="bg-[#14263f] border border-white/10 rounded-xl p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>
      <div className="flex-1 space-y-2.5">{children}</div>
      <a
        href="#"
        className="mt-4 flex items-center justify-center gap-2 border border-[#e8b923]/50 text-[#e8b923] text-xs font-bold py-2 rounded-md hover:bg-[#e8b923] hover:text-[#0d1b2e] transition-colors"
      >
        {cta}
      </a>
    </StaggerItem>
  )
}

export default function InfoPanels() {
  return (
    <section id="laws" className="bg-[#0f2138] py-14 md:py-16">
      <StaggerGrid className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        <PanelCard
          title="قوانین و مقررات"
          cta="مشاهده همه قوانین"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#e8b923]" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M12 3v3M4 8h16M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0zM7 21h10" />
            </svg>
          }
        >
          {LAWS.map((l) => (
            <div key={l} className="flex items-center gap-2 text-[#c7d2e0] text-xs">
              <CheckIcon />
              <span>{l}</span>
            </div>
          ))}
        </PanelCard>

        <PanelCard
          title="بانک بخشنامه‌ها"
          cta="مشاهده همه بخشنامه‌ها"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#e8b923]" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <path d="M6 2h9l3 3v17H6V2zM9 11h6M9 15h6M9 7h3" />
            </svg>
          }
        >
          {CIRCULARS.map((c) => (
            <div key={c.no} className="text-[#c7d2e0] text-xs border-b border-white/5 pb-1.5">
              <div className="flex justify-between text-[#8ea0b5] text-[10px] mb-0.5">
                <span>{c.no}</span>
                <span>{c.date}</span>
              </div>
              <p className="text-white">{c.title}</p>
            </div>
          ))}
        </PanelCard>

        <PanelCard
          title="سامانه هوشمند"
          cta="ورود به سامانه"
          icon={
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#e8b923]" fill="none" stroke="currentColor" strokeWidth={1.6}>
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 1 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 1 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 1 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 1 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
            </svg>
          }
        >
          {PORTAL.map((p) => (
            <div key={p} className="flex items-center gap-2 text-[#c7d2e0] text-xs">
              <CheckIcon />
              <span>{p}</span>
            </div>
          ))}
        </PanelCard>
      </StaggerGrid>
    </section>
  )
}
