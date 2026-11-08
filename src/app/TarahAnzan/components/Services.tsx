import { FadeUp, StaggerGrid, StaggerItem } from '@/components/ui/motion'

const SERVICES = [
  { title: 'صدور سند مالکیت', icon: 'doc' },
  { title: 'نقشه UTM', icon: 'map' },
  { title: 'تفکیک', icon: 'split' },
  { title: 'افراز', icon: 'grid' },
  { title: 'تجمیع', icon: 'merge' },
  { title: 'تعیین حدود', icon: 'bounds' },
  { title: 'جانمایی پلاک', icon: 'pin' },
  { title: 'رفع تداخل', icon: 'no-overlap' },
  { title: 'کاداستر و حدنگار', icon: 'layers' },
  { title: 'امور حقوقی', icon: 'scale' },
  { title: 'نقشه‌برداری', icon: 'survey' },
  { title: 'کارشناسی رسمی', icon: 'expert' },
]

function ServiceIcon({ name }: { name: string }) {
  const common = 'w-7 h-7 text-[#e8b923]'
  const paths: Record<string, JSX.Element> = {
    doc: (
      <path d="M6 2h9l3 3v17H6V2z M15 2v3h3M9 11h6M9 15h6M9 7h3" />
    ),
    map: <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2zM9 4v14M15 6v14" />,
    split: <path d="M12 3v6M12 21v-6M5 9l7 3 7-3M5 15l7-3 7 3" />,
    grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
    merge: <path d="M6 4v6l6 4 6-4V4M6 20v-6M18 20v-6M12 14v6" />,
    bounds: <path d="M4 4h16v16H4z M4 4l4 4M20 4l-4 4M4 20l4-4M20 20l-4-4" />,
    pin: <path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />,
    'no-overlap': <path d="M4 6h10v10H4zM10 10h10v10H10zM4 6l14 14" />,
    layers: <path d="M12 3 2 8l10 5 10-5-10-5zM2 13l10 5 10-5M2 18l10 5 10-5" />,
    scale: <path d="M12 3v3M4 8h16M6 8l-3 6a3 3 0 0 0 6 0zM18 8l-3 6a3 3 0 0 0 6 0zM7 21h10" />,
    survey: <path d="M12 3v11M8 3h8M6 22l6-8 6 8M4 14l16-3" />,
    expert: <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 4-6 8-6s8 2 8 6" />,
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

export default function Services() {
  return (
    <section id="services" className="bg-[#0f2138] py-14 md:py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <FadeUp className="flex items-center gap-3 mb-8">
          <span className="w-1.5 h-6 bg-[#e8b923] rounded-full" />
          <h2 className="text-white font-bold text-xl md:text-2xl">خدمات ما</h2>
        </FadeUp>

        <StaggerGrid className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {SERVICES.map((s) => (
            <StaggerItem
              key={s.title}
              className="group bg-[#14263f] border border-white/10 rounded-xl px-4 py-6 flex flex-col items-center gap-3 text-center hover:border-[#e8b923]/60 hover:-translate-y-1 transition-all cursor-pointer"
            >
              <ServiceIcon name={s.icon} />
              <p className="text-white text-xs font-bold">{s.title}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <FadeUp className="text-center mt-8" delay={0.15}>
          <a
            href="#request"
            className="inline-flex items-center gap-2 border border-[#e8b923] text-[#e8b923] font-bold text-sm px-6 py-2.5 rounded-md hover:bg-[#e8b923] hover:text-[#0d1b2e] transition-colors"
          >
            مشاهده همه خدمات ثبتی
          </a>
        </FadeUp>
      </div>
    </section>
  )
}
