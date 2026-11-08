import { StaggerGrid, StaggerItem } from '@/components/ui/motion'

const STATS = [
  { label: 'سال تجربه', value: '۱۵+', icon: 'medal' },
  { label: 'پروژه انجام شده', value: '۳۲۵۰+', icon: 'building' },
  { label: 'مراجعه‌کننده', value: '۱۲۸۷۰+', icon: 'users' },
  { label: 'رضایت مشتریان', value: '۹۸٪', icon: 'smile' },
  { label: 'کارشناسان', value: '۳۲+', icon: 'expert' },
  { label: 'شعب فعال', value: '۷', icon: 'branch' },
]

function StatIcon({ name }: { name: string }) {
  const common = 'w-6 h-6 text-[#e8b923]'
  const paths: Record<string, JSX.Element> = {
    medal: <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3z" />,
    building: <path d="M4 21V7l8-4 8 4v14M9 21v-6h6v6M9 11h.01M15 11h.01M9 15h.01M15 15h.01" />,
    users: <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />,
    smile: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01" />,
    expert: <path d="M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 21c0-4 4-6 8-6s8 2 8 6" />,
    branch: <path d="M4 4h16v4H4zM4 10h16v10H4zM9 14h.01M9 18h.01M15 14h.01M15 18h.01" />,
  }
  return (
    <svg viewBox="0 0 24 24" className={common} fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  )
}

export default function StatsBar() {
  return (
    <section className="bg-[#0d1b2e] border-y border-[#e8b923]/20">
      <StaggerGrid className="max-w-7xl mx-auto px-4 md:px-6 py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
        {STATS.map((s) => (
          <StaggerItem key={s.label} className="flex flex-col items-center text-center gap-2">
            <StatIcon name={s.icon} />
            <p className="text-white font-black text-xl">{s.value}</p>
            <p className="text-[#8ea0b5] text-xs">{s.label}</p>
          </StaggerItem>
        ))}
      </StaggerGrid>
    </section>
  )
}
